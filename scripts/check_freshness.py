#!/usr/bin/env python3
"""List Part 6 (Bambu X2D + AMS 2 Pro) pages by the date their Bambu facts were last checked.

Each x2d/*.html page carries <body ... data-verified="YYYY-MM-DD">: the last day its
Bambu-specific facts were compared with Bambu Lab's documentation. Vendor facts age
faster than the rest of the handbook, so pages older than the limit are listed as due.

Usage:  python scripts/check_freshness.py [--months N] [--today YYYY-MM-DD] [--strict]
Default limit is 6 months. Exit code 1 only with --strict when a page is due or undated.
After re-checking a page, update its data-verified date (a re-verification is a PATCH release).
"""
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BODY = re.compile(r"<body\b[^>]*>", re.I)
VERIFIED = re.compile(r'data-verified="([^"]*)"')


def arg(name, default):
    if name in sys.argv:
        i = sys.argv.index(name)
        if i + 1 < len(sys.argv):
            return sys.argv[i + 1]
    return default


def months_between(a, b):
    return (b.year - a.year) * 12 + (b.month - a.month) - (1 if b.day < a.day else 0)


def main():
    limit = int(arg("--months", "6"))
    today = date.fromisoformat(arg("--today", date.today().isoformat()))
    rows, problems = [], 0
    for page in sorted((ROOT / "x2d").glob("*.html")):
        rel = page.relative_to(ROOT).as_posix()
        m = BODY.search(page.read_text(encoding="utf-8"))
        v = VERIFIED.search(m.group(0)) if m else None
        if not v:
            rows.append((rel, "—", None, "UNDATED"))
            problems += 1
            continue
        try:
            d = date.fromisoformat(v.group(1))
        except ValueError:
            rows.append((rel, v.group(1), None, "BAD DATE"))
            problems += 1
            continue
        age = months_between(d, today)
        due = age >= limit
        problems += due
        rows.append((rel, d.isoformat(), age, "DUE" if due else "ok"))
    rows.sort(key=lambda r: (r[2] is not None, -(r[2] or 0)))
    width = max(len(r[0]) for r in rows)
    print(f"Part 6 freshness on {today.isoformat()} (limit {limit} months)\n")
    for rel, d, age, status in rows:
        age_txt = "" if age is None else f"{age} mo"
        print(f"  {rel:<{width}}  {d:<10}  {age_txt:>5}  {status}")
    print(f"\n{problems} page(s) due for re-verification" if problems else "\nAll Part 6 pages are within the limit.")
    return 1 if problems and "--strict" in sys.argv else 0


if __name__ == "__main__":
    sys.exit(main())
