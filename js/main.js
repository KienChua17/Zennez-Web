(function () {
  "use strict";
  var C = window.ZENNEZ || {};

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- Điền thông tin từ config ---------- */
  $$("[data-discord]").forEach(function (a) { a.href = C.discord || "#"; a.target = "_blank"; });
  $$("[data-ip-host-inline]").forEach(function (n) { n.textContent = C.javaHost; });
  $$("[data-ip-port-inline]").forEach(function (n) { n.textContent = C.bedrockPort; });

  /* ---------- Sao chép ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  /* ---------- Hộp IP ---------- */
  var box = $("#ip-box");
  if (box) {
    var hostEl = $("[data-ip-host]", box);
    var portEl = $("[data-ip-port]", box);
    var portField = $(".field-port", box);
    var statusWrap = $("[data-status]", box);
    var statusText = $("[data-status-text]", box);
    var edition = "java";
    var cache = {};

    function currentHost() { return edition === "java" ? C.javaHost : C.bedrockHost; }

    function setStatus(state, text) {
      statusWrap.setAttribute("data-state", state);
      statusText.textContent = text;
    }

    function loadStatus() {
      if (!C.showStatus) { statusWrap.hidden = true; return; }
      var key = edition;
      if (cache[key]) { setStatus(cache[key].state, cache[key].text); return; }
      setStatus("loading", "Đang kiểm tra máy chủ…");

      var url = edition === "java"
        ? "https://api.mcsrvstat.us/3/" + encodeURIComponent(C.javaHost)
        : "https://api.mcsrvstat.us/bedrock/3/" + encodeURIComponent(C.bedrockHost + ":" + C.bedrockPort);

      fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var res;
          if (d && d.online) {
            var p = d.players || {};
            var txt = (p.online != null ? p.online : 0) + "/" + (p.max != null ? p.max : "?") + " người chơi đang online";
            if (d.version) txt += " · " + d.version;
            res = { state: "online", text: txt };
          } else {
            res = { state: "offline", text: "Máy chủ đang tắt hoặc không phản hồi" };
          }
          cache[key] = res;
          if (key === edition) setStatus(res.state, res.text);
        })
        .catch(function () {
          if (key === edition) setStatus("unknown", "Không lấy được trạng thái máy chủ");
        });
    }

    function setEdition(ed) {
      edition = ed;
      $$(".tab", box).forEach(function (t) {
        t.setAttribute("aria-selected", t.getAttribute("data-edition") === ed ? "true" : "false");
      });
      hostEl.textContent = currentHost();
      portEl.textContent = C.bedrockPort;
      portField.hidden = ed !== "bedrock";
      loadStatus();
    }

    $$(".tab", box).forEach(function (t) {
      t.addEventListener("click", function () { setEdition(t.getAttribute("data-edition")); });
    });

    $$(".field", box).forEach(function (f) {
      f.addEventListener("click", function () {
        var target = f.getAttribute("data-copy-target");
        var value = target === "port" ? String(C.bedrockPort) : currentHost();
        var hint = $(".field-hint", f);
        copyText(value).then(function () {
          hint.textContent = "Đã sao chép";
          f.classList.add("copied");
        }, function () {
          hint.textContent = "Bôi đen và chép tay";
        }).then(function () {
          setTimeout(function () { hint.textContent = "Sao chép"; f.classList.remove("copied"); }, 1600);
        });
      });
    });

    setEdition("java");
  }

  /* ---------- Bộ chọn tính năng ---------- */
  var ex = $("#explorer");
  if (ex) {
    ex.classList.add("is-js");
    var tabs = $$(".ex-tab", ex);
    var panels = $$(".panel", ex);

    function activate(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) {
        p.hidden = p.id !== tab.getAttribute("aria-controls");
      });
      if (focus) tab.focus();
    }

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { activate(t, false); });
      t.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") next = tabs[0];
        if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); activate(next, true); }
      });
    });

    activate(tabs[0], false);
  }

  /* ---------- Tìm kiếm wiki ---------- */
  var search = $("#wiki-search");
  if (search) {
    var docs = $$(".doc");
    var links = $$("#toc a");
    var none = $("#no-result");

    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      docs.forEach(function (d, i) {
        var hit = !q || d.textContent.toLowerCase().indexOf(q) !== -1;
        d.hidden = !hit;
        if (links[i]) links[i].parentNode.hidden = !hit;
        if (hit) shown++;
      });
      none.hidden = shown !== 0;
    });
  }

  /* ---------- Đánh dấu mục đang đọc trong wiki ---------- */
  if ("IntersectionObserver" in window && $("#toc")) {
    var map = {};
    $$("#toc a").forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          Object.keys(map).forEach(function (k) { map[k].removeAttribute("aria-current"); });
          map[en.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    $$(".doc").forEach(function (d) { io.observe(d); });
  }
})();
