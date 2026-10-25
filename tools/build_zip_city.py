#!/usr/bin/env python3
"""T-138 (2026-10-25): build data/zip_city.js -- ZIP -> USPS default city + state -- for every
ZIP in data/zip_index.js, from the `zipcodes` PyPI package (MIT license, USPS ZIP Code
database: https://pypi.org/project/zipcodes/).

One-time/occasional build, run by hand and committed. Re-run whenever zip_index.js's ZIP
universe changes (a new state added, etc). Does not touch zip_index.js or any plans_*.json
county data -- those stay the business source of truth for which plans sell where.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ZIP_INDEX = ROOT / "data" / "zip_index.js"
OUT = ROOT / "data" / "zip_city.js"


def load_zip_universe():
    text = ZIP_INDEX.read_text()
    m = re.search(r"ZIP_INDEX\s*=\s*(\{.*\})", text, re.DOTALL)
    if not m:
        sys.exit(f"could not find ZIP_INDEX object in {ZIP_INDEX}")
    return json.loads(m.group(1).rstrip(";\n "))


def main():
    try:
        import zipcodes
    except ImportError:
        sys.exit("pip install zipcodes  (PyPI, MIT license) first")

    universe = load_zip_universe()
    by_zip = {}
    for rec in zipcodes.list_all():
        city, state = rec.get("city"), rec.get("state")
        if city and state:
            by_zip[rec["zip_code"]] = f"{city}, {state}"

    out = {}
    missing = []
    for zip5 in universe:
        place = by_zip.get(zip5)
        if place:
            out[zip5] = place
        else:
            missing.append(zip5)

    ordered = dict(sorted(out.items()))
    body = json.dumps(ordered, separators=(",", ":"), ensure_ascii=False)
    OUT.write_text(
        "// T-138 (2026-10-25): ZIP -> USPS default city + state, for every ZIP in\n"
        "// data/zip_index.js. Built by tools/build_zip_city.py from the `zipcodes` PyPI\n"
        "// package (MIT, USPS ZIP Code database, https://pypi.org/project/zipcodes/).\n"
        "// A ZIP with no entry here falls back to the plain ZIP wherever placeText()/\n"
        "// placePill() are used -- never blocks the flow. Rebuild after zip_index.js changes.\n"
        f"const ZIP_CITY = {body};\n"
    )
    print(f"wrote {len(out)} zips to {OUT}")
    print(f"{len(missing)} of {len(universe)} zip_index.js entries had no zipcodes match"
          + (f" (first 10: {missing[:10]})" if missing else ""))


if __name__ == "__main__":
    main()
