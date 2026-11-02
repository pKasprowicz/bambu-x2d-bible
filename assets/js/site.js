/* The 3D Printing Compendium — site chrome & interactive components.
   Pages only need:  <body data-page="section/file.html">  + <main class="content">…</main>
   Everything else (header, sidebar, TOC, pager, search, tabs, quizzes…) is built here. */
(function () {
  "use strict";
  var NAV = window.C3D_NAV;
  var body = document.body;
  var page = body.dataset.page || "index.html";
  var depth = page.split("/").length - 1;
  var base = depth ? "../".repeat(depth) : "";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var el = function (tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  };
  var store = {
    get: function (k) { try { return localStorage.getItem("c3d:" + k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem("c3d:" + k, v); } catch (e) { /* private mode */ } },
    del: function (k) { try { localStorage.removeItem("c3d:" + k); } catch (e) { /* ignore */ } }
  };

  /* ---------- Theme ---------- */
  var savedTheme = store.get("theme");
  var theme = savedTheme || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);

  /* ---------- Shared SVG marker defs ---------- */
  body.insertAdjacentHTML("afterbegin",
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<marker id="c3d-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
    '<path d="M0 0 L10 5 L0 10 z" fill="context-stroke"/></marker></defs></svg>');

  /* ---------- Locate page in nav ---------- */
  var flat = [];
  NAV.parts.forEach(function (p) { p.pages.forEach(function (pg) { flat.push({ part: p, page: pg }); }); });
  var idx = flat.findIndex(function (x) { return x.page.f === page; });
  var here = idx >= 0 ? flat[idx] : null;

  /* ---------- Chrome ---------- */
  var layout = el("div", { class: "layout" });
  var content = $("main.content") || $("main") || el("main", { class: "content" });
  content.classList.add("content");
  content.id = "content";
  var progress = el("div", { class: "progress-bar" });

  var logo = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="21" width="26" height="6" rx="2" fill="#e8590c"/><rect x="6" y="14" width="20" height="5" rx="2" fill="#f0a43a"/><rect x="9" y="8" width="14" height="4" rx="2" fill="#ffc46b"/><path d="M16 2v4" stroke="#2f7bd8" stroke-width="3" stroke-linecap="round"/></svg>';
  var header = el("header", { class: "site-header" },
    '<button class="icon-btn menu-btn" aria-label="Menu">☰</button>' +
    '<a class="brand" href="' + base + 'index.html">' + logo + '<span>' + NAV.short + '<small>from first print to expert</small></span></a>' +
    (NAV.version ? '<a class="ver-chip" href="' + (NAV.repo ? NAV.repo + '/releases/tag/v' + NAV.version : '#') + '" rel="noopener" title="Release notes">v' + NAV.version + '</a>' : '') +
    '<span class="spacer"></span>' +
    '<button class="icon-btn search-btn" aria-label="Search"><span aria-hidden="true">🔍</span><span class="lbl">Search…</span><kbd>/</kbd></button>' +
    '<button class="icon-btn theme-btn" aria-label="Toggle dark mode">🌓</button>');

  var sidebar = el("nav", { class: "sidebar", "aria-label": "Site navigation" });
  var homeLink = el("div", { class: "nav-part open" }, '<ul style="display:block;margin-left:0;border:0;padding:0"><li><a href="' + base + 'index.html"' + (page === "index.html" ? ' class="current"' : "") + '>🏠 Home</a></li></ul>');
  sidebar.appendChild(homeLink);
  NAV.parts.forEach(function (p) {
    var open = here && here.part.id === p.id;
    var wrap = el("div", { class: "nav-part" + (open ? " open" : "") });
    var btn = el("button", { "aria-expanded": open ? "true" : "false" }, '<span>' + p.icon + '</span><span>' + p.title + '</span><span class="chev">▶</span>');
    var ul = el("ul");
    p.pages.forEach(function (pg) {
      var li = el("li");
      var a = el("a", { href: base + pg.f, title: pg.d }, '<span class="lvl-dot l' + pg.level + '"></span><span>' + pg.t + '</span>');
      if (pg.f === page) a.classList.add("current");
      li.appendChild(a); ul.appendChild(li);
    });
    btn.addEventListener("click", function () { wrap.classList.toggle("open"); btn.setAttribute("aria-expanded", wrap.classList.contains("open")); });
    wrap.appendChild(btn); wrap.appendChild(ul); sidebar.appendChild(wrap);
  });
  sidebar.appendChild(el("p", { style: "font-size:12px;color:var(--muted);margin:14px 8px" },
    '<span class="lvl-dot l1" style="display:inline-block"></span> beginner &nbsp;<span class="lvl-dot l2" style="display:inline-block"></span> intermediate &nbsp;<span class="lvl-dot l3" style="display:inline-block"></span> advanced'));

  var toc = el("aside", { class: "toc", "aria-label": "On this page" });

  content.parentNode.insertBefore(layout, content);
  layout.appendChild(sidebar); layout.appendChild(content); layout.appendChild(toc);
  body.insertBefore(header, body.firstChild.nextSibling || body.firstChild);
  body.insertBefore(progress, body.firstChild);

  /* Pager + footer */
  if (here) {
    var pager = el("nav", { class: "pager", "aria-label": "Previous and next page" });
    var prev = flat[idx - 1], next = flat[idx + 1];
    if (prev) pager.appendChild(el("a", { class: "prev", href: base + prev.page.f }, "<small>← Previous</small>" + prev.page.t));
    if (next) pager.appendChild(el("a", { class: "next", href: base + next.page.f }, "<small>Next →</small>" + next.page.t));
    content.appendChild(pager);
  }
  var footer = el("footer", { class: "site-footer" },
    "The 3D Printing Compendium · built for GitHub Pages · Settings shown are starting points — always validate on your own printer & filament.<br>Product facts for the Bambu Lab X2D and AMS 2 Pro come from Bambu Lab's public documentation and may change with firmware updates." +
    (NAV.version ? '<br><small>Version ' + NAV.version + (NAV.repo ? ' · <a href="' + NAV.repo + '/blob/master/CHANGELOG.md" rel="noopener">changelog</a> · <a href="' + NAV.repo + '/releases" rel="noopener">releases</a>' : '') + '</small>' : ''));
  body.appendChild(footer);
  var kicker = $(".home-hero .kicker");
  if (kicker && NAV.version) kicker.appendChild(el("a", { class: "ver-chip", href: (NAV.repo || "") + "/blob/master/CHANGELOG.md", rel: "noopener", title: "What changed" }, "v" + NAV.version + " · changelog"));
  var toTop = el("button", { class: "icon-btn to-top", "aria-label": "Back to top" }, "↑");
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0 }); });
  body.appendChild(toTop);

  /* Title */
  if (here && !/·/.test(document.title)) document.title = here.page.t + " · " + NAV.short;

  /* ---------- Header interactions ---------- */
  $(".menu-btn").addEventListener("click", function () { body.classList.toggle("nav-open"); });
  document.addEventListener("click", function (e) {
    if (body.classList.contains("nav-open") && !e.target.closest(".sidebar") && !e.target.closest(".menu-btn")) body.classList.remove("nav-open");
  });
  $(".theme-btn").addEventListener("click", function () {
    var t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t); store.set("theme", t);
  });
  var cur = $(".sidebar a.current");
  if (cur) cur.scrollIntoView({ block: "center" });

  /* ---------- Headings: anchors + TOC ---------- */
  var used = {};
  var heads = $$("h2, h3", content).filter(function (h) { return !h.closest(".tool, .card, .callout, .exercise > header, .tab:not(.active) .x-skip"); });
  $$("h2, h3, h4", content).forEach(function (h) {
    if (!h.id) {
      var s = h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
      var n = s, i = 2; while (used[n] || document.getElementById(n)) n = s + "-" + i++;
      h.id = n;
    }
    used[h.id] = 1;
    if (h.tagName !== "H1" && !h.querySelector(".anchor")) h.insertAdjacentHTML("afterbegin", '<a class="anchor" href="#' + h.id + '" aria-label="Link to section">#</a>');
  });
  if (heads.length > 2) {
    toc.innerHTML = "<h4>On this page</h4>";
    heads.forEach(function (h) {
      var a = el("a", { href: "#" + h.id, class: h.tagName.toLowerCase() }, h.textContent.replace(/^#/, ""));
      toc.appendChild(a);
    });
  } else toc.style.display = "none";

  /* ---------- Scroll: progress, scroll spy, to-top ---------- */
  var tocLinks = $$("a", toc);
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    toTop.classList.toggle("show", h.scrollTop > 700);
    if (!tocLinks.length) return;
    var current = null;
    for (var i = 0; i < heads.length; i++) { if (heads[i].getBoundingClientRect().top < 120) current = heads[i].id; else break; }
    tocLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + current); });
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- Tabs ---------- */
  $$(".tabs").forEach(function (t) {
    var panes = $$(":scope > .tab", t);
    var list = el("div", { class: "tab-list", role: "tablist" });
    panes.forEach(function (p, i) {
      var b = el("button", { role: "tab", "aria-selected": i === 0 ? "true" : "false" }, p.getAttribute("data-title") || "Tab " + (i + 1));
      b.addEventListener("click", function () {
        $$("button", list).forEach(function (x) { x.setAttribute("aria-selected", "false"); }); b.setAttribute("aria-selected", "true");
        panes.forEach(function (x) { x.classList.remove("active"); }); p.classList.add("active");
      });
      list.appendChild(b);
      if (i === 0) p.classList.add("active");
    });
    t.insertBefore(list, t.firstChild);
  });

  /* ---------- Code copy buttons ---------- */
  $$("pre").forEach(function (pre) {
    var b = el("button", { class: "copy", type: "button" }, "Copy");
    b.addEventListener("click", function () {
      var txt = (pre.querySelector("code") || pre).innerText;
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { b.textContent = "Copied ✓"; setTimeout(function () { b.textContent = "Copy"; }, 1400); }, function () { b.textContent = "Press Ctrl+C"; });
    });
    pre.appendChild(b);
  });

  /* ---------- Figures: lightbox ---------- */
  $$("figure.fig").forEach(function (f) {
    var svg = $("svg", f);
    if (!svg || f.classList.contains("no-zoom")) return;
    f.classList.add("zoomable");
    f.addEventListener("click", function (e) {
      if (e.target.closest("a, button, input, select")) return;
      var lb = el("div", { class: "lightbox" }); var inner = el("div"); inner.appendChild(svg.cloneNode(true)); lb.appendChild(inner);
      lb.addEventListener("click", function () { lb.remove(); }); document.addEventListener("keydown", function esc(ev) { if (ev.key === "Escape") { lb.remove(); document.removeEventListener("keydown", esc); } });
      body.appendChild(lb);
    });
  });

  /* ---------- Quizzes ---------- */
  var quizzes = $$(".quiz");
  var score = { right: 0, total: 0 };
  var sb = $(".score-board");
  function updateScore() { if (sb) sb.innerHTML = "🎯 Score: <b>" + score.right + "</b> / " + score.total + " answered · " + quizzes.length + " questions in this quiz"; }
  quizzes.forEach(function (q) {
    var opts = $(".options", q);
    if (opts) { /* authored answers sit mostly in one slot: shuffle so position gives nothing away */
      var items = $$("li", opts), k, j, t;
      for (k = items.length - 1; k > 0; k--) { j = Math.floor(Math.random() * (k + 1)); t = items[k]; items[k] = items[j]; items[j] = t; }
      items.forEach(function (li) { opts.appendChild(li); });
    }
    $$(".options li", q).forEach(function (li) {
      li.addEventListener("click", function () {
        if (q.classList.contains("answered")) return;
        q.classList.add("answered"); score.total++;
        if (li.hasAttribute("data-correct")) { li.classList.add("correct"); score.right++; }
        else { li.classList.add("wrong"); $$(".options li[data-correct]", q).forEach(function (c) { c.classList.add("correct"); }); }
        updateScore();
      });
    });
  });
  updateScore();

  /* ---------- Checklists (persisted) ---------- */
  $$("ul.checklist").forEach(function (ul, ui) {
    $$("li", ul).forEach(function (li, i) {
      var cb = $("input[type=checkbox]", li);
      if (!cb) {
        cb = el("input", { type: "checkbox" });
        var lab = el("label"); while (li.firstChild) lab.appendChild(li.firstChild);
        li.appendChild(cb); li.appendChild(lab);
      } else if (!$("label", li)) {
        var rest = el("label"); var n = cb.nextSibling; while (n) { var nx = n.nextSibling; rest.appendChild(n); n = nx; } li.appendChild(rest);
      }
      var key = "chk:" + page + ":" + (ul.id || ui) + ":" + i;
      if (store.get(key) === "1") { cb.checked = true; li.classList.add("checked"); }
      cb.addEventListener("change", function () { li.classList.toggle("checked", cb.checked); store.set(key, cb.checked ? "1" : "0"); });
    });
  });

  /* ---------- Exercises: completion tracking ---------- */
  $$("section.exercise[id]").forEach(function (ex) {
    var key = "done:" + ex.id;
    var foot = $("footer", ex) || ex.appendChild(el("footer"));
    var lab = el("label", { class: "ex-done-btn" }, '<input type="checkbox"> <span>Mark as completed</span>');
    var cb = $("input", lab);
    if (store.get(key) === "1") { cb.checked = true; ex.classList.add("done"); }
    cb.addEventListener("change", function () { ex.classList.toggle("done", cb.checked); store.set(key, cb.checked ? "1" : "0"); });
    foot.insertBefore(lab, foot.firstChild);
  });
  /* <div class="progress-summary" data-prefix="L1-" data-total="10"> → counts done:<prefix>* keys */
  $$(".progress-summary[data-prefix]").forEach(function (ps) {
    var prefix = ps.getAttribute("data-prefix"), total = +ps.getAttribute("data-total") || 0, done = 0;
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k.indexOf("c3d:done:" + prefix) === 0 && localStorage.getItem(k) === "1") done++; } } catch (e) { /* ignore */ }
    ps.innerHTML = '<strong>' + (ps.getAttribute("data-label") || prefix) + '</strong><div class="track"><div class="fill" style="width:' + (total ? Math.min(100, done / total * 100) : 0) + '%"></div></div><span>' + done + ' / ' + total + '</span>';
  });

  /* ---------- Search ---------- */
  var modal = el("div", { class: "search-modal" }, '<div class="search-box"><input type="search" placeholder="Search the compendium… (e.g. stringing, PETG, tolerance)" aria-label="Search"><div class="search-results"></div></div>');
  body.appendChild(modal);
  var sInput = $("input", modal), sRes = $(".search-results", modal), sIndex = null, sSel = -1;
  function loadIndex(cb) {
    if (sIndex) return cb();
    fetch(base + "assets/search-index.json").then(function (r) { return r.json(); }).then(function (j) { sIndex = j; cb(); }).catch(function () {
      sIndex = flat.map(function (x) { return { u: x.page.f, t: x.page.t, d: x.page.d, h: [] }; }); cb();
    });
  }
  function runSearch() {
    var q = sInput.value.trim().toLowerCase();
    if (!q) { sRes.innerHTML = '<div class="none">Type to search ' + (sIndex ? sIndex.length : "") + ' pages…</div>'; return; }
    var terms = q.split(/\s+/);
    var scored = [];
    sIndex.forEach(function (p) {
      var title = p.t.toLowerCase(), desc = (p.d || "").toLowerCase(), heads2 = (p.h || []).map(function (h) { return h.toLowerCase(); }), txt = (p.x || "").toLowerCase();
      var s = 0, ok = true, hit = null;
      terms.forEach(function (t) {
        var ts = 0;
        if (title.indexOf(t) >= 0) ts += 10;
        if (desc.indexOf(t) >= 0) ts += 4;
        for (var i = 0; i < heads2.length; i++) if (heads2[i].indexOf(t) >= 0) { ts += 6; hit = hit || p.h[i]; break; }
        if (txt.indexOf(t) >= 0) ts += 1;
        if (!ts) ok = false; s += ts;
      });
      if (ok) scored.push({ p: p, s: s, hit: hit });
    });
    scored.sort(function (a, b) { return b.s - a.s; });
    sSel = -1;
    sRes.innerHTML = scored.length ? scored.slice(0, 25).map(function (r) {
      return '<a href="' + base + r.p.u + '"><b>' + r.p.t + '</b><span>' + (r.hit ? "§ " + r.hit + " — " : "") + (r.p.d || "") + '</span></a>';
    }).join("") : '<div class="none">No matches. Try a different word.</div>';
  }
  function openSearch() { modal.classList.add("open"); sInput.value = ""; loadIndex(function () { runSearch(); }); setTimeout(function () { sInput.focus(); }, 20); }
  function closeSearch() { modal.classList.remove("open"); }
  $(".search-btn").addEventListener("click", openSearch);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeSearch(); });
  sInput.addEventListener("input", runSearch);
  sInput.addEventListener("keydown", function (e) {
    var links = $$("a", sRes);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault(); sSel = Math.max(0, Math.min(links.length - 1, sSel + (e.key === "ArrowDown" ? 1 : -1)));
      links.forEach(function (l, i) { l.classList.toggle("sel", i === sSel); }); if (links[sSel]) links[sSel].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter" && links.length) { location.href = (links[sSel] || links[0]).href; }
  });
  document.addEventListener("keydown", function (e) {
    var tag = (document.activeElement && document.activeElement.tagName) || "";
    if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(tag)) { e.preventDefault(); openSearch(); }
    if (e.key === "Escape") closeSearch();
  });

  /* ---------- External links ---------- */
  $$('a[href^="http"]').forEach(function (a) { a.setAttribute("rel", "noopener noreferrer"); a.setAttribute("target", "_blank"); });

  /* ---------- Public hook for page scripts ---------- */
  window.C3D = { store: store, $: $, $$: $$, el: el, base: base };
  document.dispatchEvent(new Event("c3d:ready"));
})();
