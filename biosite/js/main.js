/* ==========================================================
   BIOSITE STUDIO TUTS — Funcionalidades
   Lê as configurações de config.js e aplica na página.
   ========================================================== */

(function () {
  "use strict";

  var cfg = window.BIOSITE_CONFIG || {};

  /* ---------- Links ---------- */
  var whatsappUrl = "https://wa.me/" + String(cfg.whatsappNumber || "").replace(/\D/g, "") +
    (cfg.whatsappMessage ? "?text=" + encodeURIComponent(cfg.whatsappMessage) : "");

  var links = {
    instagram: cfg.instagram,
    youtube: cfg.youtube,
    whatsapp: whatsappUrl,
    portfolio: cfg.portfolio,
  };

  document.querySelectorAll("[data-link]").forEach(function (el) {
    var url = links[el.getAttribute("data-link")];
    if (url) el.href = url;
  });

  /* ---------- Logotipo ---------- */
  var logo = document.querySelector('[data-config="logo"]');
  if (logo && cfg.logo && logo.getAttribute("src") !== cfg.logo) logo.src = cfg.logo;

  /* ---------- Vídeo ---------- */
  var video = document.getElementById("banner-video");
  if (!video || !cfg.video || !cfg.video.src) return;

  // Garante reprodução silenciosa e inline (requisito para autoplay em mobile)
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.controls = false;

  if (cfg.video.poster) video.poster = cfg.video.poster;
  video.src = cfg.video.src;

  function tryPlay() {
    var p = video.play();
    if (p && typeof p.catch === "function") p.catch(function () { /* aguarda permissão */ });
  }

  // Se o navegador bloquear o autoplay, tenta novamente na primeira interação
  function onFirstInteraction() {
    tryPlay();
    ["touchstart", "pointerdown", "keydown", "scroll"].forEach(function (evt) {
      window.removeEventListener(evt, onFirstInteraction);
    });
  }
  ["touchstart", "pointerdown", "keydown", "scroll"].forEach(function (evt) {
    window.addEventListener(evt, onFirstInteraction, { passive: true });
  });

  video.addEventListener("canplay", tryPlay, { once: true });
  tryPlay();

  // Economiza bateria/dados: pausa quando o vídeo sai da tela ou a aba fica oculta
  var visible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !document.hidden) tryPlay(); else video.pause();
    }, { threshold: 0.15 }).observe(video);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) video.pause(); else if (visible) tryPlay();
  });
})();
