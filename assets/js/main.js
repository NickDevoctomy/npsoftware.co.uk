// npSoftware: cookie notice, colour theme button, copy-link button, project
// contents lists and the search page.
(function () {
  "use strict";

  // --- Cookie notice --------------------------------------------------------

  var COOKIE_KEY = "npsoftware-cookies-ok";

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* private mode: show it again next time */ }
  }

  function initCookieNotice() {
    var notice = document.querySelector("[data-cookie-notice]");
    if (!notice || storageGet(COOKIE_KEY)) return;
    notice.hidden = false;
    notice.querySelector("[data-cookie-accept]").addEventListener("click", function () {
      storageSet(COOKIE_KEY, "1");
      notice.hidden = true;
    });
  }

  // --- Colour theme ---------------------------------------------------------

  // System (no data-theme, so CSS follows prefers-color-scheme), light or
  // dark. The <head> applies a saved choice before the page draws; this runs
  // the header button, which cycles through the three.
  var THEME_KEY = "npsoftware-theme";
  var THEMES = ["system", "light", "dark"];

  function initThemeToggle() {
    var button = document.querySelector("[data-theme-toggle]");
    if (!button) return;
    var root = document.documentElement;

    function show(mode) {
      var next = THEMES[(THEMES.indexOf(mode) + 1) % THEMES.length];
      button.setAttribute("data-mode", mode);
      button.setAttribute("aria-label", "Colour theme: " + mode + ". Switch to " + next);
      button.setAttribute("title", "Colour theme: " + mode + " (click for " + next + ")");
    }

    var saved = storageGet(THEME_KEY);
    show(saved === "light" || saved === "dark" ? saved : "system");
    button.hidden = false;

    button.addEventListener("click", function () {
      var mode = THEMES[(THEMES.indexOf(button.getAttribute("data-mode")) + 1) % THEMES.length];
      if (mode === "system") {
        root.removeAttribute("data-theme");
        try { window.localStorage.removeItem(THEME_KEY); } catch (e) { /* nothing saved */ }
      } else {
        root.setAttribute("data-theme", mode);
        storageSet(THEME_KEY, mode);
      }
      show(mode);
    });
  }

  // --- Copy link ------------------------------------------------------------

  function initCopyLinks() {
    document.querySelectorAll("[data-copy-link]").forEach(function (button) {
      var label = button.querySelector("[data-copy-label]");
      button.addEventListener("click", function () {
        var url = button.getAttribute("data-copy-link");
        var done = function (text) {
          label.textContent = text;
          setTimeout(function () { label.textContent = "Copy link"; }, 2000);
        };
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(function () { done("Copied!"); }, function () { done("Couldn't copy"); });
        } else {
          done("Couldn't copy");
        }
      });
    });
  }

  // --- Project contents -----------------------------------------------------

  // Lists a project write-up's ## and ### headings beside it, each ### nested
  // under the ## before it, marking the one being read. Hidden unless there
  // are at least two.
  function initToc() {
    var toc = document.querySelector("[data-toc]");
    var source = document.querySelector("[data-toc-source]");
    if (!toc || !source) return;
    var headings = Array.prototype.slice.call(source.querySelectorAll("h2[id], h3[id]"));
    if (headings.length < 2) return;

    var list = toc.querySelector("[data-toc-list]");
    var parent = null;
    var links = headings.map(function (heading) {
      var item = document.createElement("li");
      var link = document.createElement("a");
      link.href = "#" + heading.id;
      link.textContent = heading.textContent;
      item.appendChild(link);
      if (heading.tagName === "H3" && parent) {
        var sub = parent.querySelector("ol");
        if (!sub) {
          sub = document.createElement("ol");
          parent.appendChild(sub);
        }
        sub.appendChild(item);
      } else {
        list.appendChild(item);
        if (heading.tagName === "H2") parent = item;
      }
      return link;
    });
    toc.hidden = false;

    // The current section is the last heading scrolled past the top third.
    function mark() {
      var current = 0;
      headings.forEach(function (heading, i) {
        if (heading.getBoundingClientRect().top < window.innerHeight / 3) current = i;
      });
      links.forEach(function (link, i) {
        if (i === current) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    }
    window.addEventListener("scroll", mark, { passive: true });
    mark();
  }

  // --- Image lightbox -------------------------------------------------------

  // Wraps each image in a project write-up in a button that shows it full size
  // in a <dialog>, captioned with its alt text. Images already inside a link
  // are left alone. Esc, the close button or a click outside the image closes it.
  function initLightbox() {
    var dialog = document.querySelector("[data-lightbox]");
    var source = document.querySelector("[data-toc-source]");
    if (!dialog || !source || typeof dialog.showModal !== "function") return;

    var big = dialog.querySelector("[data-lightbox-img]");
    var caption = dialog.querySelector("[data-lightbox-caption]");

    Array.prototype.slice.call(source.querySelectorAll("img")).forEach(function (img) {
      if (img.closest("a, button")) return;
      var button = document.createElement("button");
      button.type = "button";
      button.className = "lightbox-trigger";
      button.setAttribute("aria-label", "View full size" + (img.alt ? ": " + img.alt : ""));
      img.parentNode.insertBefore(button, img);
      button.appendChild(img);
      button.addEventListener("click", function () {
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        caption.textContent = img.alt;
        caption.hidden = !img.alt;
        dialog.showModal();
      });
    });

    dialog.querySelector("[data-lightbox-close]").addEventListener("click", function () {
      dialog.close();
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog || event.target.classList.contains("lightbox__figure")) dialog.close();
    });
    dialog.addEventListener("close", function () {
      big.removeAttribute("src");
    });
  }

  // --- Search ---------------------------------------------------------------

  // Every post is already on the page as a card carrying data-title, data-text,
  // data-tags, data-year and data-date; this shows and hides them. The state
  // lives in the URL (?q=, ?tag=, ?year=) so tag links and back/forward work.
  function initSearch() {
    var root = document.querySelector("[data-search]");
    if (!root) return;

    var input = root.querySelector("[data-search-input]");
    var results = root.querySelector("[data-search-results]");
    var cards = Array.prototype.slice.call(results.querySelectorAll("[data-post]"));
    var buttons = Array.prototype.slice.call(root.querySelectorAll("[data-filter]"));
    var summary = root.querySelector("[data-search-summary]");
    var empty = root.querySelector("[data-search-empty]");
    var sortButton = root.querySelector("[data-search-sort]");

    var params = new URLSearchParams(location.search);
    var state = {
      q: params.get("q") || "",
      tags: params.getAll("tag"),
      year: params.get("year") || "",
      oldestFirst: params.get("sort") === "oldest"
    };
    input.value = state.q;

    function matches(card) {
      var tags = (card.getAttribute("data-tags") || "").split("|");
      var words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      var text = card.getAttribute("data-text") + " " + tags.join(" ").toLowerCase();
      return state.tags.every(function (tag) { return tags.indexOf(tag) !== -1; }) &&
        (!state.year || card.getAttribute("data-year") === state.year) &&
        words.every(function (word) { return text.indexOf(word) !== -1; });
    }

    function writeUrl() {
      var next = new URLSearchParams();
      if (state.q) next.set("q", state.q);
      state.tags.forEach(function (tag) { next.append("tag", tag); });
      if (state.year) next.set("year", state.year);
      if (state.oldestFirst) next.set("sort", "oldest");
      var query = next.toString();
      history.replaceState(null, "", location.pathname + (query ? "?" + query : ""));
    }

    function render() {
      buttons.forEach(function (button) {
        var value = button.getAttribute("data-value");
        var on = button.getAttribute("data-filter") === "tag" ? state.tags.indexOf(value) !== -1 : state.year === value;
        button.setAttribute("aria-pressed", on ? "true" : "false");
      });

      var sorted = cards.slice().sort(function (a, b) {
        var diff = new Date(b.getAttribute("data-date")) - new Date(a.getAttribute("data-date"));
        return state.oldestFirst ? -diff : diff;
      });
      var shown = 0;
      sorted.forEach(function (card) {
        var visible = matches(card);
        card.hidden = !visible;
        if (visible) shown++;
        results.appendChild(card);
      });

      var text = shown + (shown === 1 ? " post" : " posts");
      if (state.tags.length) text += " tagged " + state.tags.join(" + ");
      if (state.year) text += " from " + state.year;
      if (state.q) text += " matching “" + state.q + "”";
      summary.textContent = text;
      empty.hidden = shown > 0;
      sortButton.textContent = state.oldestFirst ? "Oldest first" : "Newest first";
      writeUrl();
    }

    input.addEventListener("input", function () {
      state.q = input.value.trim();
      render();
    });
    root.querySelector("[data-search-form]").addEventListener("submit", function (event) {
      event.preventDefault();
    });

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var value = button.getAttribute("data-value");
        if (button.getAttribute("data-filter") === "tag") {
          var at = state.tags.indexOf(value);
          if (at === -1) state.tags.push(value); else state.tags.splice(at, 1);
        } else {
          state.year = state.year === value ? "" : value;
        }
        render();
      });
    });

    root.querySelector("[data-search-reset]").addEventListener("click", function () {
      state.q = "";
      state.tags = [];
      state.year = "";
      input.value = "";
      render();
    });

    sortButton.addEventListener("click", function () {
      state.oldestFirst = !state.oldestFirst;
      render();
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCookieNotice();
    initThemeToggle();
    initCopyLinks();
    initToc();
    initLightbox();
    initSearch();
  });
})();
