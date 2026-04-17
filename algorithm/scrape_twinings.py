#!/usr/bin/env python3
"""
Twinings loose-leaf tea scraper.
- Fetches all products from the Shopify JSON API (clean, structured)
- Enriches each with brewing details from the product HTML page
- Deduplicates by canonical tea name, keeping highest price
- Outputs: algorithm/data/twinings_products.json
"""

import json
import re
import time
from html import unescape
from pathlib import Path
from typing import Dict, List, Optional

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://twinings.co.uk"
COLLECTION_JSON = "https://twinings.co.uk/collections/loose-leaf-tea/products.json?limit=250"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
                  "Chrome/124 Safari/537.36",
    "Accept-Language": "en-GB,en;q=0.9",
    "Accept": "application/json, text/html, */*",
}

OUTPUT_FILE = Path(__file__).parent / "data" / "twinings_products.json"
DELAY = 1.2

# Packaging / weight suffixes to strip when computing the canonical tea name
STRIP_PATTERNS = [
    r"\s*[-–]\s*\d+\s*(?:x\s*\d+\s*)?(?:g|ml|kg)\b",  # "- 125g", "- 4 x 125g"
    r"\s*\d+\s*(?:x\s*\d+\s*)?(?:g|ml|kg)\b",           # "125g", "500ml"
    r"\s*[-–]\s*\d+\s+(?:Pyramid|Loose)\s+(?:Tea\s+)?Bags?",
    r"\s*[-–]\s*\d+\s+Bags?",
    r"\bLoose\s+Tea\s+Caddy\b",
    r"\bLoose\s+Tea\b",
    r"\bLoose\s+Caddy\b",
    r"\bTea\s+Caddy\b",
    r"\bCaddy\b",
    r"\bPyramid\s+(?:Tea\s+)?Bags?\b",
    r"\bInternational\s+Blend\b",
    r"\bFlavour\b",
]


def get_json(url: str, session: requests.Session) -> Optional[dict]:
    try:
        resp = session.get(url, headers=HEADERS, timeout=25)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"  [JSON ERROR] {url}: {e}")
        return None


def get_html(url: str, session: requests.Session) -> Optional[BeautifulSoup]:
    try:
        headers = dict(HEADERS)
        headers["Accept"] = "text/html,application/xhtml+xml"
        resp = session.get(url, headers=headers, timeout=25)
        resp.raise_for_status()
        return BeautifulSoup(resp.text, "html.parser")
    except Exception as e:
        print(f"  [HTML ERROR] {url}: {e}")
        return None


def canonical_name(title: str) -> str:
    """Strip weight/packaging info to get the core tea name."""
    name = title
    for pat in STRIP_PATTERNS:
        name = re.sub(pat, "", name, flags=re.IGNORECASE)
    # Twinings prefixes — strip "Twinings –"
    name = re.sub(r"^Twinings\s*[–-]\s*", "", name, flags=re.IGNORECASE)
    # Strip trailing punctuation / dashes
    name = re.sub(r"[\s–\-]+$", "", name).strip()
    return name


def infer_type(tags: List[str], product_type: str, title: str) -> Optional[str]:
    combined = " ".join(tags + [product_type, title]).lower()
    if "black tea" in combined or "breakfast" in combined or "assam" in combined \
            or "darjeeling" in combined or "ceylon" in combined or "earl grey" in combined:
        return "black"
    if "green tea" in combined or "sencha" in combined or "gunpowder" in combined \
            or "matcha" in combined:
        return "green"
    if "white tea" in combined:
        return "white"
    if "oolong" in combined:
        return "oolong"
    if "pu-erh" in combined or "puerh" in combined:
        return "pu-erh"
    if "rooibos" in combined or "redbush" in combined or "red bush" in combined:
        return "rooibos"
    if "herbal" in combined or "peppermint" in combined or "camomile" in combined \
            or "chamomile" in combined or "mint" in combined or "fruit" in combined \
            or "hibiscus" in combined or "theine" in combined or "caffeine free" in combined:
        return "herbal"
    return None


def extract_brewing_info(soup: BeautifulSoup) -> dict:
    """Pull brewing temperature, steep time, caffeine from product HTML."""
    result: dict = {
        "temperature_c": None,
        "steep_time": None,
        "caffeine_level": None,
    }
    full_text = soup.get_text(" ", strip=True)

    temp = re.search(r"(\d{2,3})\s*°\s*[Cc]", full_text)
    if temp:
        result["temperature_c"] = int(temp.group(1))

    steep = re.search(r"(\d[\d–\-–]*)\s*(min(?:ute)?s?)", full_text, re.I)
    if steep:
        result["steep_time"] = steep.group(0).strip()

    caffeine = re.search(r"(caffeine|theine)[^\n.]{0,80}", full_text, re.I)
    if caffeine:
        result["caffeine_level"] = caffeine.group(0).strip()

    return result


def parse_shopify_product(raw: dict, session: requests.Session) -> dict:
    handle = raw.get("handle", "")
    purchase_url = f"{BASE_URL}/products/{handle}"
    title = raw.get("title", "").strip()
    raw_title = title

    # Price — take the highest variant price (as float, GBP)
    prices = []
    for v in raw.get("variants", []):
        try:
            prices.append(float(v["price"]))
        except (KeyError, ValueError, TypeError):
            pass
    price_gbp = max(prices) if prices else None

    # Tags as list
    tags_raw = raw.get("tags", [])
    tags = [t.strip() for t in tags_raw] if isinstance(tags_raw, list) else \
        [t.strip() for t in str(tags_raw).split(",")]

    # Strip HTML from description
    body_html = raw.get("body_html") or ""
    description = BeautifulSoup(body_html, "html.parser").get_text(" ", strip=True)

    # Origin from tags
    origin_tags = {"India", "China", "Japan", "Sri Lanka", "Ceylon", "Taiwan",
                   "Nepal", "Africa", "Kenya", "Assam", "Darjeeling"}
    origin = next((t for t in tags if t in origin_tags), None)

    # Images
    images = []
    for img in raw.get("images", []):
        src = img.get("src", "")
        if src:
            images.append({"url": src, "alt": img.get("alt", "")})

    product_type = raw.get("product_type", "")
    tea_type = infer_type(tags, product_type, title)

    # Fetch HTML page for brewing details
    print(f"  Fetching product page: {handle}")
    soup = get_html(purchase_url, session)
    brewing = extract_brewing_info(soup) if soup else {}

    return {
        "name": canonical_name(title),
        "name_full": raw_title,
        "purchase_url": purchase_url,
        "brand": "Twinings",
        "reference": raw.get("variants", [{}])[0].get("sku") if raw.get("variants") else None,
        "category": product_type,
        "type": tea_type,
        "description": description,
        "ingredients": None,  # not in API; would need page scrape per product
        "origin": origin,
        "tags": tags,
        "caffeine_level": brewing.get("caffeine_level"),
        "temperature_c": brewing.get("temperature_c"),
        "steep_time": brewing.get("steep_time"),
        "price_gbp": price_gbp,
        "images": images,
    }


def deduplicate(products: List[dict]) -> List[dict]:
    """Keep one entry per canonical name — the highest-priced one."""
    by_name: Dict[str, dict] = {}
    for p in products:
        name = p["name"]
        if not name:
            continue
        existing = by_name.get(name)
        if existing is None:
            by_name[name] = p
        else:
            if (p.get("price_gbp") or 0) > (existing.get("price_gbp") or 0):
                by_name[name] = p
    return sorted(by_name.values(), key=lambda x: x["name"])


def main():
    session = requests.Session()

    print("Fetching Twinings loose-leaf collection from Shopify JSON API…")
    data = get_json(COLLECTION_JSON, session)
    if not data or "products" not in data:
        print("Failed to fetch product list. Aborting.")
        return

    raw_products = data["products"]
    print(f"Found {len(raw_products)} products in API\n")

    products = []
    for i, raw in enumerate(raw_products, 1):
        print(f"[{i}/{len(raw_products)}] {raw.get('title', '?')}")
        product = parse_shopify_product(raw, session)
        products.append(product)
        print(f"  → canonical: '{product['name']}' | £{product['price_gbp']} | "
              f"type: {product['type']}")
        time.sleep(DELAY)

    print(f"\nRaw: {len(products)} | Deduplicating by name…")
    result = deduplicate(products)
    print(f"After deduplication: {len(result)} unique teas")

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nSaved to {OUTPUT_FILE}")

    # Summary
    types: Dict[str, int] = {}
    for p in result:
        t = p.get("type") or "unknown"
        types[t] = types.get(t, 0) + 1
    print("By type:", dict(sorted(types.items())))


if __name__ == "__main__":
    main()
