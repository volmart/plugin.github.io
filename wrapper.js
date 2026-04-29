// ============================================================
//  Z01 Wrapper Plugin for Lampa
//  Host on GitHub Pages, add the raw URL to Lampa → Settings → Plugins
// ============================================================

(function () {
  'use strict';

  // ============================================================
  //  CONFIG — edit what you need
  // ============================================================
  var CONFIG = {

    // Text shown BELOW the button icon on the movie card
    buttonSubtitle: 'MV',

    // SVG icon shown on the movie card button
    // The original is a blue Z logo — paste your own <svg>...</svg> here
    // or leave '' to keep the default
    buttonIcon: '<svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 960c-92.8 0-160-200-160-448S419.2 64 512 64s160 200 160 448-67.2 448-160 448z m0-32c65.6 0 128-185.6 128-416S577.6 96 512 96s-128 185.6-128 416 62.4 416 128 416z" fill="#050D42"></path><path d="M124.8 736c-48-80 92.8-238.4 307.2-363.2S852.8 208 899.2 288 806.4 526.4 592 651.2 171.2 816 124.8 736z m27.2-16c33.6 57.6 225.6 17.6 424-97.6S905.6 361.6 872 304 646.4 286.4 448 401.6 118.4 662.4 152 720z" fill="#050D42"></path><path d="M899.2 736c-46.4 80-254.4 38.4-467.2-84.8S76.8 368 124.8 288s254.4-38.4 467.2 84.8S947.2 656 899.2 736z m-27.2-16c33.6-57.6-97.6-203.2-296-318.4S184 246.4 152 304 249.6 507.2 448 622.4s392 155.2 424 97.6z" fill="#050D42"></path><path d="M512 592c-44.8 0-80-35.2-80-80s35.2-80 80-80 80 35.2 80 80-35.2 80-80 80zM272 312c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48zM416 880c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z m448-432c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z" fill="#2F4BFF"></path></g></svg>',
    /*
    buttonIcon example (white star on dark circle):
    '<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="64" cy="64" r="56" fill="#1a1a2e" stroke="#fff" stroke-width="8"/>' +
    '<path d="M64 20l10.9 33.5H110L81.5 73.5l10.9 33.5L64 87l-28.4 20 10.9-33.5L18 53.5h34.1z" fill="#fff"/>' +
    '</svg>',
    */

    // Right-click context menu item label
    contextMenuLabel: {
      en: 'Watch online',
      ru: 'Смотреть онлайн',
      uk: 'Дивитися онлайн',
      zh: '在线观看',
    },

    // Settings sidebar card (only visible when Lampa language = Russian)
    settingsName: 'MV',
    settingsIcon: '<svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 960c-92.8 0-160-200-160-448S419.2 64 512 64s160 200 160 448-67.2 448-160 448z m0-32c65.6 0 128-185.6 128-416S577.6 96 512 96s-128 185.6-128 416 62.4 416 128 416z" fill="#050D42"></path><path d="M124.8 736c-48-80 92.8-238.4 307.2-363.2S852.8 208 899.2 288 806.4 526.4 592 651.2 171.2 816 124.8 736z m27.2-16c33.6 57.6 225.6 17.6 424-97.6S905.6 361.6 872 304 646.4 286.4 448 401.6 118.4 662.4 152 720z" fill="#050D42"></path><path d="M899.2 736c-46.4 80-254.4 38.4-467.2-84.8S76.8 368 124.8 288s254.4-38.4 467.2 84.8S947.2 656 899.2 736z m-27.2-16c33.6-57.6-97.6-203.2-296-318.4S184 246.4 152 304 249.6 507.2 448 622.4s392 155.2 424 97.6z" fill="#050D42"></path><path d="M512 592c-44.8 0-80-35.2-80-80s35.2-80 80-80 80 35.2 80 80-35.2 80-80 80zM272 312c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48zM416 880c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z m448-432c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z" fill="#2F4BFF"></path></g></svg>',
  };
  // ============================================================
  //  END CONFIG
  // ============================================================

  var ORIGIN = 'http://z01.online/online.js';
  function log(msg) { console.log('[z01-wrapper]', msg); }

  // --- Patch 1: Lampa.Lang.translate intercept ----------------
  function wrapTranslate() {
    try {
      var orig = Lampa.Lang.translate.bind(Lampa.Lang);
      Lampa.Lang.translate = function (key) {
        if (key === 'lampac_watch') {
          var lang = '';
          try { lang = Lampa.Storage.field('language') || ''; } catch(e) {}
          if (!lang) try { lang = (navigator.language||'').slice(0,2); } catch(e) {}
          return CONFIG.contextMenuLabel[lang] || CONFIG.contextMenuLabel.en;
        }
        return orig(key);
      };
      log('Lang.translate wrapped');
    } catch (e) { log('Lang.translate wrap failed: ' + e.message); }
  }

  // --- Patch 2: SettingsApi.addComponent intercept ------------
  function wrapSettingsApi() {
    try {
      var orig = Lampa.SettingsApi.addComponent;
      Lampa.SettingsApi.addComponent = function (opts) {
        if (opts && opts.component === 'z01_premium') {
          if (CONFIG.settingsName) opts.name = CONFIG.settingsName;
          if (CONFIG.settingsIcon) opts.icon = CONFIG.settingsIcon;
          log('Settings component patched: ' + opts.name);
        }
        return orig.call(Lampa.SettingsApi, opts);
      };
      log('SettingsApi.addComponent wrapped');
    } catch (e) { log('SettingsApi wrap failed: ' + e.message); }
  }

  // --- Patch 3: MutationObserver — subtitle + icon on .lampac--button
  //     Both the icon SVG and data-subtitle are set at template-build time
  //     inside online.js, so DOM mutation is the only reliable way to
  //     change them after the button renders.
  function watchButton() {
    var svgTemplate = null;
    if (CONFIG.buttonIcon) {
      try {
        var tmp = document.createElement('div');
        tmp.innerHTML = CONFIG.buttonIcon;
        svgTemplate = tmp.querySelector('svg');
        if (!svgTemplate) log('buttonIcon has no <svg> — icon replacement skipped');
      } catch(e) { log('buttonIcon parse failed: ' + e.message); }
    }

    function patchBtn(btn) {
      if (btn.dataset.z01patched) return;
      btn.dataset.z01patched = '1';

      // Update subtitle text
      if (CONFIG.buttonSubtitle) {
        btn.dataset.subtitle = CONFIG.buttonSubtitle;
        log('Subtitle set: ' + CONFIG.buttonSubtitle);
      }

      // Replace icon SVG
      if (svgTemplate) {
        var existingSvg = btn.querySelector('svg');
        if (existingSvg) {
          existingSvg.parentNode.replaceChild(svgTemplate.cloneNode(true), existingSvg);
          log('Icon replaced');
        }
      }
    }

    // Patch buttons already in DOM
    document.querySelectorAll('.lampac--button').forEach(patchBtn);

    // Watch for future renders
    try {
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          m.addedNodes.forEach(function (node) {
            if (!node || node.nodeType !== 1) return;
            if (node.classList && node.classList.contains('lampac--button')) {
              patchBtn(node);
            } else if (node.querySelectorAll) {
              node.querySelectorAll('.lampac--button').forEach(patchBtn);
            }
          });
        });
      });
      observer.observe(document.body || document.documentElement,
        { childList: true, subtree: true });
      log('MutationObserver active');
    } catch(e) { log('MutationObserver failed: ' + e.message); }
  }

  // --- Patch 4: post-load — onContextMenu wrap + watchButton --
  function postLoadPatch() {
    try {
      var mp = Lampa.Manifest && Lampa.Manifest.plugins;
      if (mp && typeof mp.onContextMenu === 'function') {
        var origFn = mp.onContextMenu;
        mp.onContextMenu = function (object) {
          var result = origFn.call(this, object) || {};
          var lang = '';
          try { lang = Lampa.Storage.field('language') || ''; } catch(e) {}
          if (!lang) try { lang = (navigator.language||'').slice(0,2); } catch(e) {}
          result.name = CONFIG.contextMenuLabel[lang] || CONFIG.contextMenuLabel.en;
          return result;
        };
        log('onContextMenu wrapped');
      }
    } catch (e) { log('onContextMenu wrap failed: ' + e.message); }

    watchButton();
    log('Post-load patches done');
  }

  // --- Entry --------------------------------------------------
  function waitFor(check, cb) {
    if (check()) { cb(); return; }
    var t = setInterval(function () { if (check()) { clearInterval(t); cb(); } }, 50);
  }

  waitFor(
    function () {
      return typeof Lampa !== 'undefined'
          && Lampa.Manifest && Lampa.Lang
          && typeof Lampa.Lang.translate === 'function'
          && Lampa.SettingsApi
          && typeof Lampa.SettingsApi.addComponent === 'function';
    },
    function () {
      log('Lampa ready — installing patches');
      wrapTranslate();
      wrapSettingsApi();

      var s = document.createElement('script');
      s.src = ORIGIN;
      s.onload = function () { log('Origin loaded'); postLoadPatch(); };
      s.onerror = function () { log('ERROR loading ' + ORIGIN); };
      document.head.appendChild(s);
    }
  );

})();