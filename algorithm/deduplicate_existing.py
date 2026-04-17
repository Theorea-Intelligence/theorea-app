#!/usr/bin/env python3
"""
Post-process the existing mariage_freres_products.json:
- Add purchase_url (= the existing url field)
- Parse a clean price_gbp (highest GBP price found)
- Deduplicate by name, keeping highest price
"""

import json
import re
from pathlib import Path

INPUT = Path(__file__).parent / "data" / "mariage_freres_products.json"


def parse_max_price(prices: list) -> "float | None":
    amounts = []
    for p in prices:
        for m in re.finditer(r"£\s*([\d,]+(?:\.\d{1,2})?)", str(p)):
            try:
                amounts.append(float(m.group(1).replace(",", "")))
            except ValueError:
                pass
    return max(amounts) if amounts else None


def infer_type(category: "str | None") -> "str | None":
    if not category:
        return None
    cat = category.lower()
    if "black" in cat:
        return "black"
    if "green" in cat:
        return "green"
    if "white" in cat:
        return "white"
    if "oolong" in cat or "blue" in cat:
        return "oolong"
    if "pu-erh" in cat or "puerh" in cat:
        return "pu-erh"
    if "rooibos" in cat:
        return "rooibos"
    if "herbal" in cat or "theine" in cat:
        return "herbal"
    if "mate" in cat:
        return "mate"
    if "yellow" in cat:
        return "yellow"
    return None


def main():
    data = json.loads(INPUT.read_text(encoding="utf-8"))
    print(f"Loaded {len(data)} raw products")

    enriched = []
    for p in data:
        price_gbp = parse_max_price(p.get("prices", []))
        enriched.append({
            "name": (p.get("name") or "").strip(),
            "purchase_url": p.get("url") or "",
            "reference": p.get("reference"),
            "category": p.get("category"),
            "type": p.get("type") or infer_type(p.get("category")),
            "description": p.get("description"),
            "ingredients": p.get("ingredients"),
            "origin": p.get("origin"),
            "caffeine_level": p.get("caffeine_level"),
            "temperature_c": int(p["temperature_c"]) if p.get("temperature_c") else None,
            "steep_time": p.get("steep_time"),
            "price_gbp": price_gbp,
            "prices_raw": p.get("prices", []),
            "images": p.get("images", []),
        })

    # Deduplicate: keep highest-priced variant per name
    by_name: dict[str, dict] = {}
    for p in enriched:
        name = p["name"]
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

    result = sorted(by_name.values(), key=lambda x: x["name"])
    print(f"After deduplication: {len(result)} unique teas")

    INPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Written back to {INPUT}")

    # Summary
    with_price = sum(1 for p in result if p["price_gbp"])
    print(f"Products with GBP price: {with_price}/{len(result)}")
    types = {}
    for p in result:
        t = p.get("type") or "unknown"
        types[t] = types.get(t, 0) + 1
    print("By type:", dict(sorted(types.items())))


if __name__ == "__main__":
    main()
