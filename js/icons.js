/* Icon pixel-art 8x8 — vẽ bằng SVG, không cần file ảnh */
(function () {
  var PAL = {
    a: "#e3eef2", b: "#8fa5b0", g: "#f5c542", h: "#93602f", d: "#5c3a18",
    w: "#ece8d6", s: "#b9b39a", k: "#1b1b1b",
    p: "#d39a62", q: "#8e5a2e",
    c: "#8a3fe0", y: "#f7e26b", u: "#5b1fa6",
    l: "#7f8b98", m: "#3a4450",
    r: "#c0392b"
  };

  var MAPS = {
    sword: [
      "......ab",
      ".....aab",
      "....aab.",
      "...aab..",
      "g.aab...",
      ".gab....",
      ".hg.....",
      "h.g....."
    ],
    dungeon: [
      ".wwwwww.",
      "wwwwwwww",
      "wkkwwkkw",
      "wkkwwkkw",
      "wwwsswww",
      ".wwwwww.",
      ".wswsws.",
      "..wwwww."
    ],
    paw: [
      ".p....p.",
      "pp.pp.pp",
      "pp.pp.pp",
      "..pppp..",
      ".pppppp.",
      "pppppppp",
      "ppq..qpp",
      ".pp..pp."
    ],
    book: [
      "cccccccc",
      "cuuuuuuc",
      "cuyyyyuc",
      "cuyuuyuc",
      "cuyyyyuc",
      "cuuyuuuc",
      "cuuuuuuc",
      "cccccccc"
    ],
    lock: [
      "..llll..",
      ".l....l.",
      ".l....l.",
      "llllllll",
      "lggggggl",
      "lggmmggl",
      "lggmmggl",
      "llllllll"
    ],
    chest: [
      ".hhhhhh.",
      "hhhhhhhh",
      "hddddddh",
      "hhhgghhh",
      "hhhgghhh",
      "hhhhhhhh",
      "hddddddh",
      "hhhhhhhh"
    ]
  };

  function render(name, px) {
    var map = MAPS[name];
    if (!map) return "";
    var rects = "";
    for (var y = 0; y < map.length; y++) {
      for (var x = 0; x < map[y].length; x++) {
        var ch = map[y][x];
        if (ch !== "." && PAL[ch]) {
          rects += '<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02" fill="' + PAL[ch] + '"/>';
        }
      }
    }
    var size = px || 48;
    return '<svg class="pxicon" viewBox="0 0 8 8" width="' + size + '" height="' + size +
      '" shape-rendering="crispEdges" aria-hidden="true" focusable="false">' + rects + "</svg>";
  }

  window.ZennezIcons = { render: render };

  document.addEventListener("DOMContentLoaded", function () {
    var nodes = document.querySelectorAll("[data-icon]");
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.innerHTML = render(n.getAttribute("data-icon"), parseInt(n.getAttribute("data-size"), 10) || 48);
    }
  });
})();
