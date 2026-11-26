/* ramyara.com — renders the page from the files in _data/.
   You shouldn't need to edit this file to update content. */
(function () {
  "use strict";
  var DATA = JSON.parse(document.getElementById("site-data").textContent || "{}");
  var P = DATA.profile || {};
  var BUCKETS = DATA.buckets || [];
  var DOTS = DATA.dots || [];
  var ORGS = DATA.organizations || [];
  var PHOTO_DIR = "assets/photos/";
  var NS = "http://www.w3.org/2000/svg";
  var ME = { x: 500, y: 300 };
  var W = 1000, H = 640;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function linkAttrs(url) {
    return /^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : "";
  }
  // Tiny formatter: [text](url) links and *italic* words.
  function md(s) {
    var out = esc(s);
    out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, t, u) { return '<a href="' + u + '"' + linkAttrs(u.replace(/&amp;/g, "&")) + ">" + t + "</a>"; });
    out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return out;
  }
  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function photoSrc(f) { return PHOTO_DIR + f; }
  var bucketById = {};
  BUCKETS.forEach(function (b) { bucketById[b.id] = b; });

  /* ---------- hero, now, what's next ---------- */
  if (P.headline) $("headline").innerHTML = md(P.headline);
  if (P.portrait) { var pi = $("portrait"); pi.src = photoSrc(P.portrait); pi.alt = P.name || "Portrait"; } else $("portrait").hidden = true;
  function paras(list) { return (list || []).map(function (t) { return "<p>" + md(t) + "</p>"; }).join(""); }
  $("now-text").innerHTML = paras(P.now);
  if (P.whats_next && P.whats_next.length) $("next-text").innerHTML = paras(P.whats_next); else $("next-box").hidden = true;
  if (P.map_intro) $("map-intro").textContent = P.map_intro;
  if (P.map_hint) $("map-hint").textContent = P.map_hint;

  var hi = [];
  if (P.email) hi.push('<a href="mailto:' + esc(P.email) + '" title="' + esc(P.email) + '">Email</a>');
  if (P.linkedin) hi.push('<a href="' + esc(P.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>');
  if (P.substack) hi.push('<a href="' + esc(P.substack) + '" target="_blank" rel="noopener">Substack</a>');
  $("hi").innerHTML = hi.join('<span class="sep" aria-hidden="true">|</span>');

  /* ---------- writing ---------- */
  $("writing").innerHTML = (DATA.writing || []).map(function (w) {
    var h = '<article class="work">';
    if (w.image) h += '<a href="' + esc(w.url) + '"' + linkAttrs(w.url) + ' tabindex="-1" aria-hidden="true"><img class="thumb" loading="lazy" src="' + photoSrc(w.image) + '" alt=""></a>';
    h += '<h3><a href="' + esc(w.url) + '"' + linkAttrs(w.url) + ">" + esc(w.title) + "</a></h3>";
    if (w.text) h += "<p>" + md(w.text) + "</p>";
    if (w.essays && w.essays.length) {
      h += "<ul>" + w.essays.map(function (e) { return '<li><a href="' + esc(e.url) + '"' + linkAttrs(e.url) + ">" + esc(e.title) + "</a></li>"; }).join("") + "</ul>";
    }
    return h + "</article>";
  }).join("");

  /* ---------- photos ---------- */
  $("photos-grid").innerHTML = (DATA.photos || []).map(function (p) {
    return '<figure><img loading="lazy" src="' + photoSrc(p.file) + '" alt="' + esc(p.alt || p.caption || "Photo by Ramya") + '"><figcaption>' + esc(p.caption || "") + "</figcaption></figure>";
  }).join("");

  /* ---------- recs ---------- */
  var recs = DATA.recs || {};
  function recList(title, items) {
    if (!items || !items.length) return "";
    return "<div><h3>" + title + "</h3><ol>" + items.map(function (r) {
      return '<li><a class="t" href="' + esc(r.url) + '"' + linkAttrs(r.url) + ">" + esc(r.title) + "</a>" +
        (r.by ? '<span class="by">' + esc(r.by) + "</span>" : "") +
        (r.note ? '<span class="why">' + md(r.note) + "</span>" : "") + "</li>";
    }).join("") + "</ol></div>";
  }
  $("recs").innerHTML = recList("Read", recs.read) + recList("Watch &amp; listen", recs.watch);

  /* ---------- background (chapters) ---------- */
  var BG = DATA.background || {};
  function logoImg(f, alt, cls) { return '<img class="' + cls + '" src="assets/logos/' + esc(f) + '" alt="' + esc(alt || "") + '" loading="lazy">'; }
  $("bg-sections").innerHTML = '<ol class="chapters">' + (BG.chapters || []).map(function (c) {
    var head = (c.logo ? '<span class="chapter-logo">' + logoImg(c.logo, c.heading, "logo") + "</span>" : "") +
      (c.heading ? '<h2 class="' + (c.logo ? "sr" : "") + '">' + md(c.heading) + "</h2>" : "");
    var along = (c.alongside || []).map(function (x) {
      return "<li>" + (x.logo ? logoImg(x.logo, "", "logo sm") : "") + "<span>" + md(x.text || "") + "</span>" + (x.when ? '<span class="d">' + esc(x.when) + "</span>" : "") + "</li>";
    }).join("");
    return '<li class="chapter' + (c.highlight ? " highlight" : "") + '">' +
      '<div class="when"><span class="yrs">' + esc(c.years || "") + '</span><span class="name">' + esc(c.name || "") + "</span></div>" +
      '<div class="main">' + head + (c.role ? '<p class="role">' + md(c.role) + "</p>" : "") +
      (c.points && c.points.length ? "<ul>" + c.points.map(function (p) { return "<li>" + md(p) + "</li>"; }).join("") + "</ul>" : "") + "</div>" +
      (along ? '<div class="along"><p class="label">Alongside</p><ul>' + along + "</ul></div>" : "<div></div>") +
      "</li>";
  }).join("") + "</ol>";

  /* ---------- map: place dots ---------- */
  var placed = [];
  function far(x, y) {
    for (var i = 0; i < placed.length; i++) { if (Math.hypot(placed[i].x - x, placed[i].y - y) < 72) return false; }
    for (var j = 0; j < BUCKETS.length; j++) { if (Math.hypot(BUCKETS[j].x - x, BUCKETS[j].y - y) < 70) return false; }
    if (Math.hypot(ME.x - x, ME.y - y) < 130) return false;
    return x > 40 && x < W - 40 && y > 30 && y < H - 30;
  }
  DOTS.forEach(function (d) { if (typeof d.x === "number" && typeof d.y === "number") placed.push(d); });
  DOTS.forEach(function (d) {
    if (typeof d.x === "number" && typeof d.y === "number") return;
    var bs = (d.buckets || []).map(function (id) { return bucketById[id]; }).filter(Boolean);
    if (!bs.length) bs = [{ x: ME.x, y: ME.y - 150 }];
    var cx = 0, cy = 0;
    bs.forEach(function (b) { cx += b.x; cy += b.y; });
    cx /= bs.length; cy /= bs.length;
    var vx = cx - ME.x, vy = cy - ME.y, len = Math.hypot(vx, vy) || 1;
    var bx = cx + (vx / len) * 80, by = cy + (vy / len) * 80;
    var found = null;
    for (var r = 0; r <= 360 && !found; r += 18) {
      for (var a = 0; a < 16; a++) {
        var x = bx + Math.cos(a * Math.PI / 8) * r, y = by + Math.sin(a * Math.PI / 8) * r;
        if (far(x, y)) { found = { x: Math.round(x), y: Math.round(y) }; break; }
      }
    }
    found = found || { x: Math.round(bx), y: Math.round(by) };
    d.x = Math.min(W - 40, Math.max(40, found.x)); d.y = Math.min(H - 30, Math.max(30, found.y));
    if (!d.label) d.label = d.x > 760 ? "left" : "right";
    placed.push(d);
  });

  function labelPos(d) {
    switch (d.label) {
      case "left": return { x: d.x - 14, y: d.y + 5, a: "end" };
      case "above": return { x: d.x, y: d.y - 14, a: "middle" };
      case "below": return { x: d.x, y: d.y + 26, a: "middle" };
      case "below-left": return { x: d.x + 12, y: d.y + 26, a: "end" };
      case "below-right": return { x: d.x - 12, y: d.y + 26, a: "start" };
      default: return { x: d.x + 14, y: d.y + 5, a: "start" };
    }
  }

  /* ---------- map: draw ---------- */
  var svg = $("map");
  var gS = $("spokes"), gE = $("edges"), gH = $("hubs"), gN = $("nodes");
  var chipWrap = $("chips");
  BUCKETS.forEach(function (b) {
    el("path", { "class": "spoke", d: "M" + ME.x + " " + ME.y + " L" + b.x + " " + b.y }, gS);
    var w = Math.max(110, b.name.length * 8.6 + 34);
    var g = el("g", { "class": "hub", tabindex: "0", role: "button", "aria-pressed": "false", "aria-label": "Show everything in " + b.name, "data-hub": b.id }, gH);
    el("rect", { x: b.x - w / 2, y: b.y - 14, width: w, height: 28, rx: 14 }, g);
    var t = el("text", { x: b.x, y: b.y + 4, "text-anchor": "middle" }, g);
    t.textContent = b.name;
    var chip = document.createElement("button");
    chip.type = "button"; chip.textContent = b.name; chip.setAttribute("aria-pressed", "false"); chip.setAttribute("data-hub", b.id); chip.id = "chip-" + b.id;
    chipWrap.appendChild(chip);
  });

  var nodeEls = [], edgeEls = [];
  DOTS.forEach(function (d) {
    (d.buckets || []).forEach(function (bid) {
      var b = bucketById[bid];
      if (!b) return;
      var ed = el("path", { "class": "edge", d: "M" + b.x + " " + b.y + " L" + d.x + " " + d.y, "data-hub": bid, "data-dot": d.id }, gE);
      ed._hub = b; ed._dot = d;
      edgeEls.push(ed);
    });
    var g = el("g", { "class": "node", tabindex: "0", role: "button", "aria-pressed": "false", "aria-label": d.title, "data-id": d.id, "data-hubs": (d.buckets || []).join(" ") }, gN);
    el("circle", { cx: d.x, cy: d.y, r: 7.5 }, g);
    var lp = labelPos(d);
    var t = el("text", { x: lp.x, y: lp.y, "text-anchor": lp.a }, g);
    t.textContent = d.title;
    g._dot = d;
    nodeEls.push(g);
  });

  /* ---------- map: motion ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Hover or focus a dot to light up its connections.
  function hoverOn(g) {
    var id = g.getAttribute("data-id"), hubs = g.getAttribute("data-hubs").split(" ");
    svg.classList.add("hovering");
    nodeEls.forEach(function (n) { n.classList.toggle("hl", n === g); });
    edgeEls.forEach(function (e) { e.classList.toggle("hl", e.getAttribute("data-dot") === id); });
    gH.querySelectorAll(".hub").forEach(function (h) { h.classList.toggle("hl", hubs.indexOf(h.getAttribute("data-hub")) > -1); });
  }
  function hoverOff() {
    svg.classList.remove("hovering");
    svg.querySelectorAll(".hl").forEach(function (n) { n.classList.remove("hl"); });
  }
  nodeEls.forEach(function (g) {
    g.addEventListener("mouseenter", function () { hoverOn(g); });
    g.addEventListener("mouseleave", hoverOff);
    g.addEventListener("focus", function () { hoverOn(g); });
    g.addEventListener("blur", hoverOff);
  });
  if (!reduceMotion) {
    // Draw the lines in, then let the dots drift gently.
    svg.classList.add("intro");
    svg.querySelectorAll(".spoke, .edge").forEach(function (p, i) {
      var len = p.getTotalLength ? p.getTotalLength() : 400;
      p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      p.style.transition = "stroke-dashoffset 0.9s ease " + (0.05 + i * 0.025) + "s";
    });
    nodeEls.forEach(function (g, i) { g.style.transitionDelay = (0.35 + i * 0.04) + "s"; });
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      svg.classList.remove("intro");
      svg.querySelectorAll(".spoke, .edge").forEach(function (p) { p.style.strokeDashoffset = 0; });
      setTimeout(function () {
        svg.querySelectorAll(".spoke, .edge").forEach(function (p) { p.style.strokeDasharray = ""; p.style.strokeDashoffset = ""; p.style.transition = ""; });
        nodeEls.forEach(function (g) { g.style.transitionDelay = ""; });
        startDrift();
      }, 2200);
    }); });
  }
  function startDrift() {
    var phase = nodeEls.map(function (_, i) { return i * 1.7; });
    var t0 = performance.now();
    function frame(now) {
      if (!document.hidden && !svg.closest(".view").hidden) {
        var t = (now - t0) / 1000;
        nodeEls.forEach(function (g, i) {
          var dx = Math.sin(t * 0.5 + phase[i]) * 3, dy = Math.cos(t * 0.4 + phase[i] * 1.3) * 3;
          g._dx = dx; g._dy = dy;
          g.setAttribute("transform", "translate(" + dx.toFixed(2) + " " + dy.toFixed(2) + ")");
        });
        var byId = {};
        nodeEls.forEach(function (g) { byId[g.getAttribute("data-id")] = g; });
        edgeEls.forEach(function (e) {
          var g = byId[e._dot.id];
          e.setAttribute("d", "M" + e._hub.x + " " + e._hub.y + " L" + (e._dot.x + (g._dx || 0)).toFixed(2) + " " + (e._dot.y + (g._dy || 0)).toFixed(2));
        });
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- detail panel ---------- */
  var detail = $("detail"), card = $("card"), mainImg = $("main-photo"), cap = $("photo-cap"), thumbs = $("thumbs");
  function showPhotos(list) {
    list = (list || []).filter(function (p) { return p && p.file; });
    detail.classList.toggle("no-photo", !list.length);
    thumbs.innerHTML = "";
    if (!list.length) { mainImg.removeAttribute("src"); return; }
    function pick(i) {
      mainImg.src = photoSrc(list[i].file);
      mainImg.alt = list[i].alt || list[i].caption || "";
      cap.textContent = list[i].caption || "";
      thumbs.querySelectorAll("button").forEach(function (b, j) { b.setAttribute("aria-pressed", j === i ? "true" : "false"); });
    }
    if (list.length > 1) {
      list.forEach(function (p, i) {
        var b = document.createElement("button");
        b.type = "button"; b.setAttribute("aria-label", p.caption || "Photo " + (i + 1));
        b.innerHTML = '<img src="' + photoSrc(p.file) + '" alt="">';
        b.addEventListener("click", function () { pick(i); });
        thumbs.appendChild(b);
      });
    }
    pick(0);
  }
  function tagsHtml(ids) {
    return '<div class="tags">' + (ids || []).map(function (id) { return bucketById[id] ? "<span>" + esc(bucketById[id].name) + "</span>" : ""; }).join("") + "</div>";
  }
  function showDot(id) {
    var d = DOTS.filter(function (x) { return x.id === id; })[0];
    if (!d) return;
    nodeEls.forEach(function (g) { g.setAttribute("aria-pressed", g.getAttribute("data-id") === id ? "true" : "false"); });
    card.innerHTML = "<h3>" + esc(d.title) + "</h3>" + (d.kind ? '<p class="kind">' + esc(d.kind) + "</p>" : "") + "<p>" + md(d.text || "") + "</p>" + tagsHtml(d.buckets);
    showPhotos(d.photos);
  }
  function showBucket(bid) {
    var b = bucketById[bid];
    var inB = DOTS.filter(function (d) { return (d.buckets || []).indexOf(bid) > -1; });
    var orgs = ORGS.filter(function (o) { return (o.buckets || []).indexOf(bid) > -1; });
    var h = "<h3>" + esc(b.name) + "</h3>" + (b.blurb ? "<p>" + md(b.blurb) + "</p>" : "");
    h += '<p class="sub">On the map</p><ul class="dotlist">' + inB.map(function (d) { return '<li><button type="button" data-goto="' + esc(d.id) + '">' + esc(d.title) + "</button></li>"; }).join("") + "</ul>";
    if (orgs.length) h += '<p class="sub">Organizations I\'ve worked with</p><ul class="orgs">' + orgs.map(function (o) { return "<li>" + esc(o.name) + "</li>"; }).join("") + "</ul>";
    card.innerHTML = h;
    card.querySelectorAll("[data-goto]").forEach(function (btn) { btn.addEventListener("click", function () { showDot(btn.getAttribute("data-goto")); }); });
    var first = inB.filter(function (d) { return d.photos && d.photos.length; })[0];
    showPhotos(first ? [first.photos[0]] : []);
  }

  var hubEls = gH.querySelectorAll(".hub"), chipEls = chipWrap.querySelectorAll("button"), active = null;
  function filter(bid) {
    active = active === bid ? null : bid;
    hubEls.forEach(function (h) { h.setAttribute("aria-pressed", h.getAttribute("data-hub") === active ? "true" : "false"); });
    chipEls.forEach(function (c) { c.setAttribute("aria-pressed", c.getAttribute("data-hub") === active ? "true" : "false"); });
    svg.classList.toggle("filtering", !!active);
    nodeEls.forEach(function (g) { g.classList.toggle("dim", !!active && g.getAttribute("data-hubs").split(" ").indexOf(active) < 0); });
    edgeEls.forEach(function (e) {
      var on = !!active && e.getAttribute("data-hub") === active;
      e.classList.toggle("dim", !!active && !on);
      e.classList.toggle("lit", on);
    });
    if (active) { nodeEls.forEach(function (g) { g.setAttribute("aria-pressed", "false"); }); showBucket(active); }
    else showDot(DEFAULT);
  }
  function onKey(fn) { return function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); } }; }
  nodeEls.forEach(function (g) {
    var id = g.getAttribute("data-id");
    g.addEventListener("click", function () { showDot(id); });
    g.addEventListener("keydown", onKey(function () { showDot(id); }));
  });
  hubEls.forEach(function (h) {
    var id = h.getAttribute("data-hub");
    h.addEventListener("click", function () { filter(id); });
    h.addEventListener("keydown", onKey(function () { filter(id); }));
  });
  chipEls.forEach(function (c) { c.addEventListener("click", function () { filter(c.getAttribute("data-hub")); }); });

  var DEFAULT = (DOTS.filter(function (d) { return (d.buckets || []).length >= 3; })[0] || DOTS[0] || {}).id;
  if (DEFAULT) showDot(DEFAULT);

  /* ---------- tabs ---------- */
  var views = document.querySelectorAll(".view");
  var tabLinks = document.querySelectorAll("[data-tab]");
  var names = Array.prototype.map.call(views, function (v) { return v.getAttribute("data-view"); });
  function route(first) {
    var want = (location.hash || "").replace(/^#/, "");
    if (names.indexOf(want) < 0) want = "map";
    views.forEach(function (v) { v.hidden = v.getAttribute("data-view") !== want; });
    tabLinks.forEach(function (a) { if (a.getAttribute("data-tab") === want) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    document.title = want === "map" ? (P.name || "Ramya Ravichandran") : (P.name || "Ramya Ravichandran") + " · " + want.replace("-", " ");
    if (!first) window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", function () { route(false); });
  route(true);
})();
