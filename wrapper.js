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

  // --- 1. Trap Lampa.Manifest.plugins via property setter ----
  //     Fires at the exact moment online.js writes the manifest,
  //     so Lampa always reads our patched version.
  function trapManifest() {
    if (!window.Lampa || !Lampa.Manifest) {
      log('Lampa.Manifest not ready, retrying…');
      return false;
    }
    var _stored = Lampa.Manifest.plugins || null;
    Object.defineProperty(Lampa.Manifest, 'plugins', {
      configurable: true,
      enumerable: true,
      set: function (val) {
        if (val && typeof val === 'object') {
          if (CONFIG.pluginListName)  val.name = CONFIG.pluginListName;
          if (CONFIG.manifestIcon)    val.icon = CONFIG.manifestIcon;
        }
        _stored = val;
        log('Manifest.plugins trapped → name: ' + (val && val.name));
      },
      get: function () { return _stored; }
    });
    return true;
  }

  // --- 2. Override the lang key used in the context menu label --
  function patchLangKey() {
    if (!Lampa.Lang || typeof Lampa.Lang.add !== 'function') return;
    Lampa.Lang.add({ lampac_watch: CONFIG.contextMenuLabel });
    log('Lang key patched');
  }

  // --- 3. Intercept SettingsApi.addComponent for the settings icon/name
  function trapSettingsApi() {
    if (!Lampa.SettingsApi || typeof Lampa.SettingsApi.addComponent !== 'function') return;
    var orig = Lampa.SettingsApi.addComponent.bind(Lampa.SettingsApi);
    Lampa.SettingsApi.addComponent = function (opts) {
      if (opts && opts.component === 'z01_premium') {
        if (CONFIG.settings.name)  opts.name = CONFIG.settings.name;
        if (CONFIG.settings.icon)  opts.icon = CONFIG.settings.icon;
        log('SettingsApi.addComponent patched → ' + opts.name);
      }
      return orig(opts);
    };
  }

  // --- 4. Load the original script dynamically ---------------
  function loadOrigin() {
    var s = document.createElement('script');
    s.src = ORIGIN;
    s.onload  = function () { log('Origin loaded — all patches active'); };
    s.onerror = function () { log('ERROR: could not load ' + ORIGIN); };
    document.head.appendChild(s);
  }

  // --- Entry: wait for Lampa core, then set all traps, then load
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
      patchLangKey();
      trapSettingsApi();
      loadOrigin();
    }
  );

})();