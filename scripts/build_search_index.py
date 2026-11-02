#!/usr/bin/env python3
"""Build assets/search-index.json from every page listed in assets/js/nav.js (+ index.html)."""
import json
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class Extract(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip = 0
        self.title = ""
        self.desc = ""
        self.h1 = ""
        self.heads = []
        self.text = []
        self._cur = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("script", "style", "svg", "pre"):
            self.skip += 1
        if tag == "meta" and a.get("name") == "description":
            self.desc = a.get("content", "")
        if tag in ("h1", "h2", "h3", "title"):
            self._cur = tag
            if tag != "title":
                self.heads.append([tag, ""])

    def handle_endtag(self, tag):
        if tag in ("script", "style", "svg", "pre") and self.skip:
            self.skip -= 1
        if tag in ("h1", "h2", "h3", "title"):
            self._cur = None

    def handle_data(self, d):
        if self._cur == "title":
            self.title += d
        elif self._cur and self.heads:
            self.heads[-1][1] += d
        if not self.skip:
            self.text.append(d)


def main():
    nav = (ROOT / "assets/js/nav.js").read_text(encoding="utf-8")
    files = ["index.html"] + re.findall(r'\bf:\s*"([^"]+)"', nav)
    out = []
    for f in files:
        p = ROOT / f
        if not p.exists():
            continue
        ex = Extract()
        ex.feed(p.read_text(encoding="utf-8"))
        h1 = next((h[1] for h in ex.heads if h[0] == "h1"), ex.title)
        heads = [re.sub(r"^#", "", h[1]).strip() for h in ex.heads if h[0] in ("h2", "h3")]
        body = re.sub(r"\s+", " ", " ".join(ex.text)).strip()
        out.append({"u": f, "t": re.sub(r"\s+", " ", h1).strip(), "d": ex.desc, "h": heads, "x": body[:6000]})
    (ROOT / "assets/search-index.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Indexed {len(out)} pages")


if __name__ == "__main__":
    main()
