// ============================================================
//  Z01 Wrapper Plugin for Lampa
//  Host this file on GitHub Pages and add its URL to Lampa plugins
// ============================================================

(function () {
  'use strict';

  // ============================================================
  //  EDIT YOUR CONFIG HERE
  // ============================================================
  var CONFIG = {

    // Name shown in the plugin list (Lampa Settings → Plugins)
    pluginListName: 'MV',

    // Label shown in the right-click context menu on a movie card
    // (default key 'lampac_watch' translates to "Watch online" / "Смотреть онлайн")
    contextMenuLabel: {
      en: 'Watch online',
      ru: 'Смотреть онлайн',
      uk: 'Дивитися онлайн',
    },

    // Settings sidebar card (only visible when Lampa language = Russian)
    settings: {
      name: 'MV',
      icon: '<svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 960c-92.8 0-160-200-160-448S419.2 64 512 64s160 200 160 448-67.2 448-160 448z m0-32c65.6 0 128-185.6 128-416S577.6 96 512 96s-128 185.6-128 416 62.4 416 128 416z" fill="#050D42"></path><path d="M124.8 736c-48-80 92.8-238.4 307.2-363.2S852.8 208 899.2 288 806.4 526.4 592 651.2 171.2 816 124.8 736z m27.2-16c33.6 57.6 225.6 17.6 424-97.6S905.6 361.6 872 304 646.4 286.4 448 401.6 118.4 662.4 152 720z" fill="#050D42"></path><path d="M899.2 736c-46.4 80-254.4 38.4-467.2-84.8S76.8 368 124.8 288s254.4-38.4 467.2 84.8S947.2 656 899.2 736z m-27.2-16c33.6-57.6-97.6-203.2-296-318.4S184 246.4 152 304 249.6 507.2 448 622.4s392 155.2 424 97.6z" fill="#050D42"></path><path d="M512 592c-44.8 0-80-35.2-80-80s35.2-80 80-80 80 35.2 80 80-35.2 80-80 80zM272 312c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48zM416 880c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z m448-432c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z" fill="#2F4BFF"></path></g></svg>',
    },

    // Icon for the plugin list entry — inline SVG string, or leave as '' for default
    // Example: '<svg width="36" height="36" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">...</svg>'
    manifestIcon: '<svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 960c-92.8 0-160-200-160-448S419.2 64 512 64s160 200 160 448-67.2 448-160 448z m0-32c65.6 0 128-185.6 128-416S577.6 96 512 96s-128 185.6-128 416 62.4 416 128 416z" fill="#050D42"></path><path d="M124.8 736c-48-80 92.8-238.4 307.2-363.2S852.8 208 899.2 288 806.4 526.4 592 651.2 171.2 816 124.8 736z m27.2-16c33.6 57.6 225.6 17.6 424-97.6S905.6 361.6 872 304 646.4 286.4 448 401.6 118.4 662.4 152 720z" fill="#050D42"></path><path d="M899.2 736c-46.4 80-254.4 38.4-467.2-84.8S76.8 368 124.8 288s254.4-38.4 467.2 84.8S947.2 656 899.2 736z m-27.2-16c33.6-57.6-97.6-203.2-296-318.4S184 246.4 152 304 249.6 507.2 448 622.4s392 155.2 424 97.6z" fill="#050D42"></path><path d="M512 592c-44.8 0-80-35.2-80-80s35.2-80 80-80 80 35.2 80 80-35.2 80-80 80zM272 312c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48zM416 880c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z m448-432c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z" fill="#2F4BFF"></path></g></svg>',

  };
  // ============================================================
  //  END CONFIG
  // ============================================================

  var ORIGIN = 'http://z01.online/online.js';

  function log(msg) { console.log('[z01-wrapper]', msg); }

  // Always load the origin script — called at the end no matter what
  function loadOrigin() {
    var s = document.createElement('script');
    s.src = ORIGIN;
    s.onload  = function () { log('Origin loaded OK'); };
    s.onerror = function () { log('ERROR: could not load ' + ORIGIN); };
    document.head.appendChild(s);
  }

  // Trap Lampa.Manifest.plugins setter with Object.defineProperty
  function trapManifest() {
    try {
      var _val = Lampa.Manifest.plugins || null;
      Object.defineProperty(Lampa.Manifest, 'plugins', {
        configurable: true,
        enumerable: true,
        set: function (v) {
          if (v && typeof v === 'object') {
            if (CONFIG.pluginListName) v.name = CONFIG.pluginListName;
            if (CONFIG.manifestIcon)  v.icon = CONFIG.manifestIcon;
          }
          _val = v;
          log('Manifest.plugins set → name=' + (v && v.name));
        },
        get: function () { return _val; }
      });
      log('Manifest trap installed');
    } catch (e) {
      log('Manifest trap failed (' + e.message + ') — will patch post-load');
    }
  }

  // Patch the lang key driving the context menu label
  function patchLang() {
    try {
      Lampa.Lang.add({ lampac_watch: CONFIG.contextMenuLabel });
      log('Lang patched');
    } catch (e) {
      log('Lang patch failed: ' + e.message);
    }
  }

  // Intercept SettingsApi.addComponent
  function trapSettings() {
    try {
      var orig = Lampa.SettingsApi.addComponent;
      Lampa.SettingsApi.addComponent = function (opts) {
        if (opts && opts.component === 'z01_premium') {
          if (CONFIG.settingsName) opts.name = CONFIG.settingsName;
          if (CONFIG.settingsIcon) opts.icon = CONFIG.settingsIcon;
          log('Settings component patched → ' + opts.name);
        }
        return orig.call(Lampa.SettingsApi, opts);
      };
      log('SettingsApi trap installed');
    } catch (e) {
      log('SettingsApi trap failed: ' + e.message);
    }
  }

  // Fallback: patch manifest fields directly after online.js loads
  function postLoadPatch() {
    try {
      var mp = Lampa.Manifest && Lampa.Manifest.plugins;
      if (mp) {
        if (CONFIG.pluginListName) mp.name = CONFIG.pluginListName;
        if (CONFIG.manifestIcon)  mp.icon = CONFIG.manifestIcon;
        log('Post-load manifest patch applied');
      }
    } catch (e) {
      log('Post-load patch failed: ' + e.message);
    }
    try {
      Lampa.Lang.add({ lampac_watch: CONFIG.contextMenuLabel });
    } catch (e) {}
  }

  function waitFor(check, cb) {
    if (check()) { cb(); return; }
    var t = setInterval(function () { if (check()) { clearInterval(t); cb(); } }, 50);
  }

  waitFor(
    function () {
      return typeof Lampa !== 'undefined'
          && Lampa.Manifest
          && Lampa.Lang
          && Lampa.SettingsApi;
    },
    function () {
      log('Lampa ready — installing traps');
      trapManifest();
      patchLang();
      trapSettings();

      // Load origin, then run fallback patch in case traps missed anything
      var s = document.createElement('script');
      s.src = ORIGIN;
      s.onload = function () {
        log('Origin loaded OK');
        postLoadPatch();
      };
      s.onerror = function () { log('ERROR: could not load ' + ORIGIN); };
      document.head.appendChild(s);
    }
  );

})();
