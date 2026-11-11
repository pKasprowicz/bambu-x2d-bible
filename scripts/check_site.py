#!/usr/bin/env python3
"""Validate the static site: nav entries, links, anchors, SVG well-formedness, tag balance.

Usage:  python scripts/check_site.py [--strict] [path/to/page.html ...]
Without file arguments every page is checked. Exit code 1 if there are errors.
Warnings (e.g. few figures) do not fail unless --strict.
"""
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urldefrag

ROOT = Path(__file__).resolve().parent.parent
VOID = {"meta", "link", "br", "hr", "img", "input", "source", "col", "area", "base", "wbr", "embed", "track", "param"}
TRACKED = {"div", "section", "table", "thead", "tbody", "tr", "ul", "ol", "li", "details", "summary", "figure", "figcaption",
           "main", "header", "footer", "nav", "article", "aside", "pre", "p", "td", "th", "span", "a", "button", "select",
           "label", "h1", "h2", "h3", "h4", "script", "style", "code", "em", "strong", "dl", "dt", "dd", "blockquote", "form", "textarea"}
SVG_CHILD_OK = True
PLACEHOLDER = re.compile(r"\b(TODO|FIXME|lorem ipsum|coming soon|TBD)\b", re.I)


def nav_files():
    src = (ROOT / "assets/js/nav.js").read_text(encoding="utf-8")
    return re.findall(r'\bf:\s*"([^"]+)"', src)


def css_classes():
    css = (ROOT / "assets/css/style.css").read_text(encoding="utf-8")
    return set(re.findall(r"\.([a-zA-Z_][\w-]*)", css))


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.ids, self.links, self.classes = [], [], []
        self.stack, self.errors = [], []
        self.data_page = None
        self.in_script = False
        self.text = []
        self.fig_count = 0
        self.title = None
        self._in_title = False
        self.heads = []
        self._head_tag = None
        self.inline_css_classes = set()
        self._in_style = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a and a["id"]:
            self.ids.append(a["id"])
        if tag == "body":
            self.data_page = a.get("data-page")
        if tag == "figure" and "fig" in (a.get("class") or "").split():
            self.fig_count += 1
        if tag == "title":
            self._in_title = True
        if tag in ("h2", "h3"):
            self._head_tag = tag
            self.heads.append("")
        if tag == "style":
            self._in_style = True
        for attr in ("href", "src"):
            if attr in a and a[attr]:
                self.links.append((tag, a[attr], self.getpos()[0]))
        if a.get("class"):
            self.classes.extend((c, self.getpos()[0]) for c in a["class"].split())
        if tag in ("script", "style"):
            self.in_script = True
        if tag in TRACKED and tag not in VOID:
            self.stack.append((tag, self.getpos()[0]))

    def handle_startendtag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.append(a["id"])
        if a.get("class"):
            self.classes.extend((c, self.getpos()[0]) for c in a["class"].split())

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.in_script = False
        if tag == "style":
            self._in_style = False
        if tag == "title":
            self._in_title = False
        if tag in ("h2", "h3"):
            self._head_tag = None
        if tag in TRACKED and tag not in VOID:
            if not self.stack:
                self.errors.append((self.getpos()[0], f"unexpected </{tag}>"))
                return
            if self.stack[-1][0] == tag:
                self.stack.pop()
                return
            # allow optional end tags for p/li/td/th/tr
            for i in range(len(self.stack) - 1, -1, -1):
                if self.stack[i][0] == tag:
                    for t, ln in self.stack[i + 1:]:
                        if t not in ("p", "li", "td", "th", "tr", "dt", "dd"):
                            self.errors.append((ln, f"<{t}> not closed before </{tag}> (line {self.getpos()[0]})"))
                    del self.stack[i:]
                    return
            self.errors.append((self.getpos()[0], f"unexpected </{tag}> (no matching open tag)"))

    def handle_data(self, data):
        if self._in_title:
            self.title = (self.title or "") + data
        if self._in_style:
            self.inline_css_classes.update(re.findall(r"\.([a-zA-Z_][\w-]*)", data))
        if self._head_tag and self.heads:
            self.heads[-1] += data
        if not self.in_script:
            self.text.append(data)


def check_svgs(html, rel, errors):
    for m in re.finditer(r"<svg\b.*?</svg>", html, re.S):
        block = m.group(0)
        line = html.count("\n", 0, m.start()) + 1
        xml = re.sub(r"&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)", "&amp;", block)
        if "&amp;" in xml and xml != block:
            errors.append((rel, line, "SVG contains a bare '&' — write &amp;"))
        if 'xmlns=' not in xml[:200]:
            xml = xml.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"', 1)
        try:
            ET.fromstring(xml)
        except ET.ParseError as e:
            errors.append((rel, line, f"SVG is not well-formed XML: {e}"))
        if "viewBox" not in block[:400] and "width=" not in block[:400]:
            errors.append((rel, line, "SVG without viewBox"))


def check_version(errors):
    """VERSION, nav.js and the newest CHANGELOG release must name the same version."""
    semver = r"\d+\.\d+\.\d+"
    try:
        v_file = (ROOT / "VERSION").read_text(encoding="utf-8").strip()
    except OSError:
        errors.append(("VERSION", 0, "file is missing"))
        return
    if not re.fullmatch(semver, v_file):
        errors.append(("VERSION", 0, f"'{v_file}' is not MAJOR.MINOR.PATCH"))
        return
    m = re.search(r'version:\s*"(' + semver + ')"', (ROOT / "assets/js/nav.js").read_text(encoding="utf-8-sig"))
    if not m or m.group(1) != v_file:
        errors.append(("assets/js/nav.js", 0, f"version is {m.group(1) if m else 'missing'}, VERSION says {v_file}"))
    try:
        log = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
    except OSError:
        errors.append(("CHANGELOG.md", 0, "file is missing"))
        return
    m = re.search(r"^## \[(" + semver + r")\]", log, re.M)
    if not m or m.group(1) != v_file:
        errors.append(("CHANGELOG.md", 0, f"newest release entry is {m.group(1) if m else 'missing'}, VERSION says {v_file}"))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    strict = "--strict" in sys.argv
    errors, warnings = [], []
    files_in_nav = nav_files()
    check_version(errors)
    for f in files_in_nav:
        if not (ROOT / f).exists():
            errors.append((f, 0, "listed in nav.js but file is missing"))
    all_pages = sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts and "node_modules" not in p.parts)
    all_rel = {p.relative_to(ROOT).as_posix() for p in all_pages}
    for p in all_rel:
        if p not in files_in_nav and p not in ("index.html", "404.html"):
            warnings.append((p, 0, "page exists but is not listed in nav.js"))
    targets = [Path(a).resolve() for a in args] if args else all_pages
    known_classes = css_classes()
    ids_cache = {}
    stats = []

    def ids_of(path):
        if path not in ids_cache:
            pg = Page()
            try:
                pg.feed(path.read_text(encoding="utf-8"))
            except Exception:
                pass
            ids_cache[path] = set(pg.ids)
        return ids_cache[path]

    for path in targets:
        if not path.exists():
            errors.append((str(path), 0, "file not found"))
            continue
        rel = path.relative_to(ROOT).as_posix()
        html = path.read_text(encoding="utf-8")
        pg = Page()
        pg.feed(html)
        pg.close()
        for ln, msg in pg.errors:
            errors.append((rel, ln, msg))
        if rel.startswith("x2d/"):
            mv = re.search(r'<body\b[^>]*\bdata-verified="(\d{4}-\d{2}-\d{2})"', html)
            if not mv:
                errors.append((rel, 0, 'Part 6 page needs <body data-verified="YYYY-MM-DD"> (see scripts/check_freshness.py)'))
        for tag, ln in pg.stack:
            errors.append((rel, ln, f"<{tag}> never closed"))
        seen = set()
        for i in pg.ids:
            if i in seen:
                errors.append((rel, 0, f"duplicate id '{i}'"))
            seen.add(i)
        if rel not in ("index.html", "404.html") and pg.data_page != rel:
            errors.append((rel, 0, f"body data-page='{pg.data_page}' should be '{rel}'"))
        if "\ufffd" in html:
            errors.append((rel, 0, "contains U+FFFD replacement characters (encoding problem)"))
        if not pg.title:
            errors.append((rel, 0, "missing <title>"))
        if "<h1" not in html:
            errors.append((rel, 0, "missing <h1>"))
        if html.count("<h1") > 1:
            warnings.append((rel, 0, "more than one <h1>"))
        text = " ".join(pg.text)
        m = PLACEHOLDER.search(text)
        if m:
            errors.append((rel, 0, f"placeholder text found: {m.group(0)}"))
        check_svgs(html, rel, errors)
        # classes
        for c, ln in pg.classes:
            if c not in known_classes and c not in pg.inline_css_classes:
                warnings.append((rel, ln, f"class '{c}' is not defined in style.css or page <style>"))
        # links
        for tag, href, ln in pg.links:
            if re.match(r"^(https?:|mailto:|tel:|data:|javascript:)", href):
                continue
            if href.startswith("/"):
                errors.append((rel, ln, f"absolute path link '{href}' (use relative)"))
                continue
            u, frag = urldefrag(href)
            tgt = path if u == "" else (path.parent / unquote(u)).resolve()
            try:
                tgt.relative_to(ROOT)
            except ValueError:
                errors.append((rel, ln, f"link escapes repo: {href}"))
                continue
            if tgt.is_dir():
                tgt = tgt / "index.html"
            if not tgt.exists():
                errors.append((rel, ln, f"broken link: {href}"))
                continue
            if frag and tgt.suffix == ".html" and frag not in ids_of(tgt):
                if frag not in ("top",):
                    errors.append((rel, ln, f"missing anchor #{frag} in {tgt.relative_to(ROOT).as_posix()}"))
        words = len(text.split())
        stats.append((rel, words, pg.fig_count))
        if rel in files_in_nav and pg.fig_count < 3 and not rel.startswith(("reference/glossary", "exercises/quizzes")):
            warnings.append((rel, 0, f"only {pg.fig_count} <figure class=fig> (aim for 4+)"))
        if rel in files_in_nav and words < 600 and not rel.startswith("exercises/quizzes"):
            warnings.append((rel, 0, f"only {words} words — page looks thin"))

    for rel, ln, msg in errors:
        print(f"ERROR   {rel}:{ln}: {msg}")
    for rel, ln, msg in warnings:
        print(f"warning {rel}:{ln}: {msg}")
    total_words = sum(w for _, w, _ in stats)
    total_figs = sum(f for _, _, f in stats)
    print(f"\nChecked {len(stats)} pages · {total_words:,} words · {total_figs} figures · {len(errors)} errors · {len(warnings)} warnings")
    sys.exit(1 if errors or (strict and warnings) else 0)


if __name__ == "__main__":
    main()
