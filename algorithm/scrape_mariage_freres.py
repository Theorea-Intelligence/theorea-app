#!/usr/bin/env python3
"""
Scraper for Mariage Frères product catalogue.
Outputs: mariage_freres_products.json + images in ./mf_images/
"""

import json
import re
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.mariagefreres.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    "Accept-Language": "en-GB,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

# Top-level category pages to crawl
CATEGORY_URLS = [
    "https://www.mariagefreres.com/en/tea/tea-family/black-tea.html",
    "https://www.mariagefreres.com/en/tea/tea-family/green-tea.html",
    "https://www.mariagefreres.com/en/tea/tea-family/green-tea-matcha.html",
    "https://www.mariagefreres.com/en/tea/tea-family/white-tea.html",
    "https://www.mariagefreres.com/en/tea/tea-family/blue-tea.html",
    "https://www.mariagefreres.com/en/tea/tea-family/yellow-tea.html",
    "https://www.mariagefreres.com/en/tea/tea-family/smoky-tea.html",
    "https://www.mariagefreres.com/en/tea/tea-family/pu-erh.html",
    "https://www.mariagefreres.com/en/tea/tea-family/crafted-tea.html",
    "https://www.mariagefreres.com/en/tea/tea-family/mate.html",
    "https://www.mariagefreres.com/en/tea/tea-family/sans-theine.html",
    "https://www.mariagefreres.com/en/tea/tea-family/rooibos.html",
    "https://www.mariagefreres.com/en/tea/tea-family/theine-free.html",
    "https://www.mariagefreres.com/en/tea/fragrance/fruity-flowery.html",
    "https://www.mariagefreres.com/en/tea/fragrance/earl-grey-citrus.html",
    "https://www.mariagefreres.com/en/tea/fragrance/rose-teas.html",
    "https://www.mariagefreres.com/en/tea/fragrance/mint.html",
    "https://www.mariagefreres.com/en/tea/fragrance/vanilla.html",
    "https://www.mariagefreres.com/en/tea/fragrance/chocolate.html",
    "https://www.mariagefreres.com/en/tea/fragrance/gourmand.html",
    "https://www.mariagefreres.com/en/tea/iconic-teas/the-most-popular-teas.html",
]

OUTPUT_FILE = "mariage_freres_products.json"
IMAGE_DIR = Path("mf_images")
DELAY = 1.2


def get_page(url: str, session: requests.Session) -> BeautifulSoup | None:
    try:
        resp = session.get(url, headers=HEADERS, timeout=25)
        resp.raise_for_status()
        return BeautifulSoup(resp.text, "html.parser")
    except requests.RequestException as e:
        print(f"  [ERROR] {url}: {e}")
        return None


def download_image(url: str, session: requests.Session, dest_dir: Path) -> str | None:
    if not url or url.startswith("data:"):
        return None
    try:
        full_url = urljoin(BASE_URL, url)
        filename = Path(urlparse(full_url).path).name
        if not filename or "." not in filename:
            return None
        dest = dest_dir / filename
        if dest.exists():
            return str(dest)
        resp = session.get(full_url, headers=HEADERS, timeout=25, stream=True)
        resp.raise_for_status()
        with open(dest, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
        return str(dest)
    except Exception as e:
        print(f"  [IMG ERROR] {url}: {e}")
        return None


def extract_product_urls_from_listing(soup: BeautifulSoup) -> list[str]:
    urls = set()
    for a in soup.find_all("a", href=True):
        href = a["href"]
        full = urljoin(BASE_URL, href)
        # Product pages: contain a reference code like -te1234- or end with specific pattern
        if re.search(r"-te\d+|/en/[^/]+-te\d+", full, re.I):
            urls.add(full)
        # Also catch /en/<slug>.html product pages that aren't category pages
        elif (
            full.startswith(BASE_URL + "/en/")
            and full.endswith(".html")
            and "/tea/" not in full
            and "/collection" not in full
            and "/customer" not in full
            and "/checkout" not in full
        ):
            # Likely a product page if the slug looks like a tea name
            slug = full.split("/en/")[-1].rstrip(".html")
            if len(slug) > 5 and "-" in slug:
                urls.add(full)
    return list(urls)


def get_all_listing_pages(cat_url: str, session: requests.Session) -> list[str]:
    """Follow ?p=N pagination to get all listing pages for a category."""
    pages = [cat_url]
    soup = get_page(cat_url, session)
    if not soup:
        return pages
    # Find last page number
    last = soup.find("a", class_=re.compile(r"last|next", re.I))
    pager = soup.find(class_=re.compile(r"pager|pagination", re.I))
    if pager:
        page_links = pager.find_all("a", href=True)
        for a in page_links:
            href = urljoin(BASE_URL, a["href"])
            if href not in pages:
                pages.append(href)
    return pages


def parse_product_page(url: str, soup: BeautifulSoup, session: requests.Session) -> dict:
    product = {
        "url": url,
        "name": None,
        "reference": None,
        "category": None,
        "type": None,
        "description": None,
        "ingredients": None,
        "origin": None,
        "caffeine_level": None,
        "temperature_c": None,
        "steep_time": None,
        "prices": [],
        "images": [],
    }

    # Name — h1
    h1 = soup.find("h1")
    if h1:
        product["name"] = h1.get_text(strip=True)

    # Reference code
    ref_match = re.search(r"TE\s*[\-\s]?\d{3,5}", soup.get_text(), re.I)
    if ref_match:
        product["reference"] = ref_match.group(0).strip()

    # Category from breadcrumb
    breadcrumb = soup.find(class_=re.compile(r"breadcrumb", re.I))
    if breadcrumb:
        crumbs = [li.get_text(strip=True) for li in breadcrumb.find_all("li")]
        product["category"] = " > ".join(crumbs)

    # Description — find the longest meaningful text block
    text_blocks = [
        p.get_text(" ", strip=True)
        for p in soup.find_all("p")
        if len(p.get_text(strip=True)) > 40
    ]
    if text_blocks:
        product["description"] = max(text_blocks, key=len)

    full_text = soup.get_text(" ", strip=True)

    # Brewing temperature
    temp = re.search(r"(\d{2,3})\s*°\s*[Cc]", full_text)
    if temp:
        product["temperature_c"] = temp.group(1)

    # Steep time
    steep = re.search(r"(\d[\d–\-]*)\s*(min(?:ute)?s?|second[s]?)", full_text, re.I)
    if steep:
        product["steep_time"] = steep.group(0).strip()

    # Caffeine / theine
    caffeine = re.search(r"(caffeine|theine)[^\n.]{0,80}", full_text, re.I)
    if caffeine:
        product["caffeine_level"] = caffeine.group(0).strip()

    # Origin
    origin = re.search(r"origin[s]?\s*[:\-]?\s*([A-Z][^\n.,]{2,50})", full_text)
    if origin:
        product["origin"] = origin.group(1).strip()

    # Ingredients
    ingredients = re.search(r"ingredient[s]?\s*[:\-]?\s*([^\n]{5,200})", full_text, re.I)
    if ingredients:
        product["ingredients"] = ingredients.group(1).strip()

    # Price(s)
    for price_el in soup.find_all(class_=re.compile(r"price", re.I)):
        text = price_el.get_text(strip=True)
        if re.search(r"[\d,\.]+", text) and "€" in text or "£" in text or "$" in text:
            product["prices"].append(text)
    product["prices"] = list(dict.fromkeys(product["prices"]))  # dedupe

    # Images — prefer product/main images
    seen = set()
    for img in soup.find_all("img", src=True):
        src = img.get("src") or img.get("data-src", "")
        if not src or src in seen:
            continue
        seen.add(src)
        skip_terms = ["icon", "logo", "flag", "arrow", "pixel", "spacer", "blank", "cart", "star"]
        if any(t in src.lower() for t in skip_terms):
            continue
        full_url = urljoin(BASE_URL, src)
        local_path = download_image(src, session, IMAGE_DIR)
        product["images"].append({
            "url": full_url,
            "alt": img.get("alt", ""),
            "local": local_path,
        })

    return product


def main():
    IMAGE_DIR.mkdir(exist_ok=True)
    session = requests.Session()

    # Collect all product URLs across categories
    all_product_urls: set[str] = set()
    print(f"Crawling {len(CATEGORY_URLS)} category pages…\n")

    for cat_url in CATEGORY_URLS:
        cat_name = cat_url.split("/")[-1].replace(".html", "")
        print(f"  Category: {cat_name}")
        listing_pages = get_all_listing_pages(cat_url, session)
        for page_url in listing_pages:
            soup = get_page(page_url, session)
            if soup:
                urls = extract_product_urls_from_listing(soup)
                all_product_urls.update(urls)
                print(f"    {page_url} → {len(urls)} products found")
            time.sleep(DELAY)

    print(f"\nTotal unique product URLs: {len(all_product_urls)}\n")

    products = []
    for i, url in enumerate(sorted(all_product_urls), 1):
        print(f"[{i}/{len(all_product_urls)}] {url}")
        soup = get_page(url, session)
        if soup:
            product = parse_product_page(url, soup, session)
            products.append(product)
            print(f"  → {product['name'] or '(no name)'} | ref: {product['reference']} | {len(product['images'])} images")
        time.sleep(DELAY)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"\nDone. {len(products)} products → {OUTPUT_FILE}")
    print(f"Images → {IMAGE_DIR}/")


if __name__ == "__main__":
    main()
