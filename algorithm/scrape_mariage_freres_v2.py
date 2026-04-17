#!/usr/bin/env python3
"""
Mariage Frères full catalogue scraper — v2.
- Discovers all category pages from site navigation
- Adds purchase_url to each product
- Deduplicates by name, keeping the highest-priced variant
- Outputs: algorithm/data/mariage_freres_products.json
"""

import json
import re
import time
from pathlib import Path
from typing import Dict, List, Optional, Set
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.mariagefreres.com"
START_URL = "https://www.mariagefreres.com/en/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
                  "Chrome/124 Safari/537.36",
    "Accept-Language": "en-GB,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

OUTPUT_FILE = Path(__file__).parent / "data" / "mariage_freres_products.json"
IMAGE_DIR = Path(__file__).parent / "data" / "mf_images"
DELAY = 1.5

# Explicit category seed list — covers all known navigation sections.
# The scraper also discovers additional pages from the site nav dynamically.
SEED_CATEGORY_URLS = [
    # Tea family
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
    "https://www.mariagefreres.com/en/tea/tea-family/rooibos.html",
    "https://www.mariagefreres.com/en/tea/tea-family/theine-free.html",
    "https://www.mariagefreres.com/en/tea/tea-family/sans-theine.html",
    # Fragrance
    "https://www.mariagefreres.com/en/tea/fragrance/fruity-flowery.html",
    "https://www.mariagefreres.com/en/tea/fragrance/earl-grey-citrus.html",
    "https://www.mariagefreres.com/en/tea/fragrance/rose-teas.html",
    "https://www.mariagefreres.com/en/tea/fragrance/mint.html",
    "https://www.mariagefreres.com/en/tea/fragrance/vanilla.html",
    "https://www.mariagefreres.com/en/tea/fragrance/chocolate.html",
    "https://www.mariagefreres.com/en/tea/fragrance/gourmand.html",
    "https://www.mariagefreres.com/en/tea/fragrance/spicy.html",
    "https://www.mariagefreres.com/en/tea/fragrance/smoky-teas.html",
    # Origins
    "https://www.mariagefreres.com/en/tea/origins/japan.html",
    "https://www.mariagefreres.com/en/tea/origins/china.html",
    "https://www.mariagefreres.com/en/tea/origins/india.html",
    "https://www.mariagefreres.com/en/tea/origins/ceylon.html",
    "https://www.mariagefreres.com/en/tea/origins/nepal.html",
    "https://www.mariagefreres.com/en/tea/origins/taiwan.html",
    "https://www.mariagefreres.com/en/tea/origins/africa.html",
    "https://www.mariagefreres.com/en/tea/origins/vietnam.html",
    "https://www.mariagefreres.com/en/tea/origins/korea.html",
    "https://www.mariagefreres.com/en/tea/origins/others.html",
    # Iconic / popular
    "https://www.mariagefreres.com/en/tea/iconic-teas/the-most-popular-teas.html",
    "https://www.mariagefreres.com/en/tea/iconic-teas/our-grandes-signatures.html",
    "https://www.mariagefreres.com/en/tea/iconic-teas/premier-cru.html",
    "https://www.mariagefreres.com/en/tea/iconic-teas/organic-teas.html",
    # Wellness / health
    "https://www.mariagefreres.com/en/tea/health-benefits/slimming.html",
    "https://www.mariagefreres.com/en/tea/health-benefits/detox.html",
    "https://www.mariagefreres.com/en/tea/health-benefits/energising.html",
    "https://www.mariagefreres.com/en/tea/health-benefits/relaxing.html",
    # Season
    "https://www.mariagefreres.com/en/tea/season/spring-teas.html",
    "https://www.mariagefreres.com/en/tea/season/summer-teas.html",
    "https://www.mariagefreres.com/en/tea/season/autumn-teas.html",
    "https://www.mariagefreres.com/en/tea/season/winter-teas.html",
    # Time of day
    "https://www.mariagefreres.com/en/tea/tea-moment/morning-tea.html",
    "https://www.mariagefreres.com/en/tea/tea-moment/afternoon-tea.html",
    "https://www.mariagefreres.com/en/tea/tea-moment/evening-tea.html",
]

# Patterns that indicate a URL is a product page (not a category/blog/account page)
PRODUCT_URL_PATTERNS = [
    re.compile(r"/en/[^/]+-t[a-z]\d{3,6}[^/]*\.html$", re.I),
    re.compile(r"/en/[^/]+-te\d{3,6}[^/]*\.html$", re.I),
]

# URL fragments that are never product pages
SKIP_FRAGMENTS = [
    "/tea/", "/collection", "/customer", "/checkout", "/account",
    "/cart", "/wishlist", "/search", "/blog", "/recipe", "/press",
    "/store", "/about", "/contact", "/sitemap", "/gift", "/club",
    "/teabox", "/subscription",
]


# ---------------------------------------------------------------------------
# HTTP helpers
# ---------------------------------------------------------------------------

def get_page(url: str, session: requests.Session) -> Optional[BeautifulSoup]:
    try:
        resp = session.get(url, headers=HEADERS, timeout=25)
        resp.raise_for_status()
        return BeautifulSoup(resp.text, "html.parser")
    except requests.RequestException as e:
        print(f"  [ERROR] {url}: {e}")
        return None


def download_image(url: str, session: requests.Session, dest_dir: Path) -> Optional[str]:
    if not url or url.startswith("data:"):
        return None
    try:
        full_url = urljoin(BASE_URL, url)
        filename = Path(urlparse(full_url).path).name
        if not filename or "." not in filename:
            return None
        dest = dest_dir / filename
        if dest.exists():
            return f"mf_images/{filename}"
        resp = session.get(full_url, headers=HEADERS, timeout=25, stream=True)
        resp.raise_for_status()
        with open(dest, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
        return f"mf_images/{filename}"
    except Exception as e:
        print(f"  [IMG ERROR] {url}: {e}")
        return None


# ---------------------------------------------------------------------------
# Category / URL discovery
# ---------------------------------------------------------------------------

def is_product_url(url: str) -> bool:
    if any(frag in url for frag in SKIP_FRAGMENTS):
        return False
    if not url.startswith(BASE_URL + "/en/"):
        return False
    if not url.endswith(".html"):
        return False
    path = url[len(BASE_URL):]
    return any(p.search(path) for p in PRODUCT_URL_PATTERNS)


def discover_category_urls_from_nav(session: requests.Session) -> Set[str]:
    """Pull all /en/tea/… category URLs from the site navigation."""
    soup = get_page(START_URL, session)
    if not soup:
        return set()
    found = set()
    for a in soup.find_all("a", href=True):
        href = urljoin(BASE_URL, a["href"])
        if (
            href.startswith(BASE_URL + "/en/tea/")
            and href.endswith(".html")
            and not any(frag in href for frag in ["/customer", "/checkout", "/cart"])
        ):
            found.add(href)
    return found


def get_all_listing_pages(cat_url: str, session: requests.Session) -> List[str]:
    """Follow pagination to collect all listing page URLs for a category."""
    pages = [cat_url]
    soup = get_page(cat_url, session)
    if not soup:
        return pages

    pager = soup.find(class_=re.compile(r"pager|pagination|toolbar", re.I))
    if pager:
        for a in pager.find_all("a", href=True):
            href = urljoin(BASE_URL, a["href"])
            if href not in pages and href.startswith(BASE_URL):
                pages.append(href)

    # Also try ?p=N style pagination
    for page_num in range(2, 20):
        sep = "&" if "?" in cat_url else "?"
        page_url = f"{cat_url}{sep}p={page_num}"
        if page_url not in pages:
            test = get_page(page_url, session)
            if test:
                product_links = extract_product_urls_from_listing(test)
                if product_links:
                    pages.append(page_url)
                    time.sleep(DELAY)
                else:
                    break
            else:
                break

    return pages


def extract_product_urls_from_listing(soup: BeautifulSoup) -> List[str]:
    urls = set()
    for a in soup.find_all("a", href=True):
        href = urljoin(BASE_URL, a["href"])
        if is_product_url(href):
            urls.add(href)
        # Fallback: match any /en/<slug>-<ref>.html where ref is alphanumeric code
        elif (
            href.startswith(BASE_URL + "/en/")
            and href.endswith(".html")
            and not any(frag in href for frag in SKIP_FRAGMENTS)
        ):
            slug = href.split("/en/")[-1]
            # Product slugs typically: some-tea-name-TJ1234-packaging.html
            if re.search(r"-[A-Z]{1,3}\d{3,}", slug):
                urls.add(href)
    return list(urls)


# ---------------------------------------------------------------------------
# Price parsing
# ---------------------------------------------------------------------------

def parse_max_price(prices: List[str]) -> Optional[float]:
    """Extract the highest numeric GBP price from the messy prices list."""
    amounts = []
    for p in prices:
        # Find all £N or £N.NN patterns
        for m in re.finditer(r"£\s*([\d,]+(?:\.\d{1,2})?)", p):
            try:
                val = float(m.group(1).replace(",", ""))
                amounts.append(val)
            except ValueError:
                pass
    return max(amounts) if amounts else None


# ---------------------------------------------------------------------------
# Product page parser
# ---------------------------------------------------------------------------

def parse_product_page(url: str, soup: BeautifulSoup, session: requests.Session) -> dict:
    product: dict = {
        "name": None,
        "purchase_url": url,
        "reference": None,
        "category": None,
        "type": None,
        "description": None,
        "ingredients": None,
        "origin": None,
        "caffeine_level": None,
        "temperature_c": None,
        "steep_time": None,
        "price_gbp": None,
        "prices_raw": [],
        "images": [],
    }

    # Name — h1
    h1 = soup.find("h1")
    if h1:
        product["name"] = h1.get_text(strip=True)

    # Reference code
    ref_match = re.search(r"\b(T[A-Z]\d{3,5}[A-Z]?)\b", soup.get_text())
    if ref_match:
        product["reference"] = ref_match.group(1)

    # Category from breadcrumb
    breadcrumb = soup.find(class_=re.compile(r"breadcrumb", re.I))
    if breadcrumb:
        crumbs = [li.get_text(strip=True) for li in breadcrumb.find_all("li")]
        product["category"] = " > ".join(crumbs)

    # Tea type from category
    if product["category"]:
        cat_lower = product["category"].lower()
        if "black" in cat_lower:
            product["type"] = "black"
        elif "green" in cat_lower:
            product["type"] = "green"
        elif "white" in cat_lower:
            product["type"] = "white"
        elif "oolong" in cat_lower or "blue" in cat_lower:
            product["type"] = "oolong"
        elif "pu-erh" in cat_lower or "puerh" in cat_lower:
            product["type"] = "pu-erh"
        elif "rooibos" in cat_lower:
            product["type"] = "rooibos"
        elif "herbal" in cat_lower or "theine-free" in cat_lower or "sans theine" in cat_lower:
            product["type"] = "herbal"
        elif "mate" in cat_lower:
            product["type"] = "mate"
        elif "yellow" in cat_lower:
            product["type"] = "yellow"
        elif "smoky" in cat_lower:
            product["type"] = "black"

    # Description — longest meaningful paragraph
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
        product["temperature_c"] = int(temp.group(1))

    # Steep time
    steep = re.search(r"(\d[\d–\-]*)\s*(min(?:ute)?s?)", full_text, re.I)
    if steep:
        product["steep_time"] = steep.group(0).strip()

    # Caffeine level
    caffeine = re.search(r"(caffeine|theine)[^\n.]{0,80}", full_text, re.I)
    if caffeine:
        product["caffeine_level"] = caffeine.group(0).strip()

    # Origin
    origin_match = re.search(r"origin[s]?\s*[:\-]?\s*([A-Z][^\n.,]{2,50})", full_text)
    if origin_match:
        product["origin"] = origin_match.group(1).strip()

    # Ingredients
    ingredients_match = re.search(r"ingredient[s]?\s*[:\-]?\s*([^\n]{5,300})", full_text, re.I)
    if ingredients_match:
        product["ingredients"] = ingredients_match.group(1).strip()

    # Prices
    for price_el in soup.find_all(class_=re.compile(r"price", re.I)):
        text = price_el.get_text(strip=True)
        if re.search(r"[\d,\.]+", text) and ("£" in text or "€" in text or "$" in text):
            product["prices_raw"].append(text)
    product["prices_raw"] = list(dict.fromkeys(product["prices_raw"]))
    product["price_gbp"] = parse_max_price(product["prices_raw"])

    # Images
    skip_terms = ["icon", "logo", "flag", "arrow", "pixel", "spacer", "blank", "cart",
                  "star", "picto", "payment", "livraison", "expedition", "shipping"]
    seen_imgs: Set[str] = set()
    for img in soup.find_all("img", src=True):
        src = img.get("src") or img.get("data-src", "")
        if not src or src in seen_imgs:
            continue
        seen_imgs.add(src)
        if any(t in src.lower() for t in skip_terms):
            continue
        full_img_url = urljoin(BASE_URL, src)
        local_path = download_image(src, session, IMAGE_DIR)
        product["images"].append({
            "url": full_img_url,
            "alt": img.get("alt", ""),
            "local": local_path,
        })

    return product


# ---------------------------------------------------------------------------
# Deduplication
# ---------------------------------------------------------------------------

def deduplicate(products: List[dict]) -> List[dict]:
    """Keep one entry per tea name — the one with the highest GBP price."""
    by_name: Dict[str, dict] = {}
    for p in products:
        name = (p.get("name") or "").strip()
        if not name:
            continue
        existing = by_name.get(name)
        if existing is None:
            by_name[name] = p
        else:
            existing_price = existing.get("price_gbp") or 0
            new_price = p.get("price_gbp") or 0
            if new_price > existing_price:
                by_name[name] = p
    return list(by_name.values())


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    session = requests.Session()

    # Discover additional categories from the site nav
    print("Discovering category URLs from site navigation…")
    nav_categories = discover_category_urls_from_nav(session)
    time.sleep(DELAY)

    all_categories: Set[str] = set(SEED_CATEGORY_URLS) | nav_categories
    print(f"Total category URLs to crawl: {len(all_categories)}\n")

    # Collect all product page URLs
    all_product_urls: Set[str] = set()
    for cat_url in sorted(all_categories):
        cat_name = cat_url.split("/")[-1].replace(".html", "")
        print(f"  Category: {cat_name}")
        listing_pages = get_all_listing_pages(cat_url, session)
        for page_url in listing_pages:
            soup = get_page(page_url, session)
            if soup:
                found = extract_product_urls_from_listing(soup)
                all_product_urls.update(found)
                print(f"    {page_url.split('/')[-1]} → +{len(found)} products")
            time.sleep(DELAY)

    print(f"\nTotal unique product URLs discovered: {len(all_product_urls)}\n")

    # Scrape each product page
    products: List[dict] = []
    for i, url in enumerate(sorted(all_product_urls), 1):
        print(f"[{i}/{len(all_product_urls)}] {url.split('/')[-1]}")
        soup = get_page(url, session)
        if soup:
            product = parse_product_page(url, soup, session)
            products.append(product)
            print(f"  → {product['name'] or '(no name)'} | £{product['price_gbp']} | "
                  f"{len(product['images'])} images")
        time.sleep(DELAY)

    print(f"\nRaw scraped: {len(products)} products")

    # Deduplicate
    deduplicated = deduplicate(products)
    print(f"After deduplication: {len(deduplicated)} unique teas\n")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(deduplicated, f, ensure_ascii=False, indent=2)

    print(f"Saved to {OUTPUT_FILE}")
    print(f"Images in {IMAGE_DIR}/")


if __name__ == "__main__":
    main()
