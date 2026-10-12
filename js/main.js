/* =========================================================
   STUDIO TUTS — scripts
   ========================================================= */

/* ------ CONFIGURAÇÃO: número do WhatsApp ------
   Formato: 55 + DDD + número (somente dígitos)    */
const WHATSAPP_NUMERO = "5519991545577";
const WHATSAPP_MSG_PADRAO = "Olá! Vim pelo site e gostaria de mais informações.";

document.addEventListener("DOMContentLoaded", () => {
  /* Links do WhatsApp (todo elemento com data-whatsapp) */
  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    const msg = el.dataset.msg || WHATSAPP_MSG_PADRAO;
    el.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`;
  });

  /* Ano no rodapé */
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* Menu: fundo escuro ao rolar */
  const header = document.querySelector(".header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Menu mobile */
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("menuToggle");
  const fecharMenu = () => {
    nav.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
  };
  toggle.addEventListener("click", () => {
    const aberto = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", aberto);
    toggle.setAttribute("aria-expanded", String(aberto));
    toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    if (aberto) header.classList.add("is-scrolled");
    else onScroll();
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", fecharMenu));

  /* Item do menu ativo conforme a seção visível */
  const links = [...document.querySelectorAll(".nav__link")];
  const secoes = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
  const marcarAtivo = () => {
    const pos = window.scrollY + window.innerHeight * 0.4;
    let atual = secoes[0];
    secoes.forEach((s) => { if (s.offsetTop <= pos) atual = s; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      atual = secoes[secoes.length - 1];
    }
    links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${atual.id}`));
  };
  marcarAtivo();
  window.addEventListener("scroll", marcarAtivo, { passive: true });

  /* =========================================================
     GALERIA do portfólio (abre a foto grande)
     ========================================================= */
  const itens = [...document.querySelectorAll(".projeto")];
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImagem");
  const lbLegenda = document.getElementById("lbLegenda");
  let atual = 0;

  const mostrar = (i) => {
    atual = (i + itens.length) % itens.length;
    const item = itens[atual];
    lbImg.src = item.dataset.full || item.getAttribute("href");
    lbImg.alt = item.dataset.caption || "";
    lbLegenda.textContent = item.dataset.caption || "";
  };
  const abrir = (i) => {
    mostrar(i);
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    document.getElementById("lbFechar").focus();
  };
  const fechar = () => {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { lb.hidden = true; }, 250);
    itens[atual].focus();
  };

  itens.forEach((item, i) => item.addEventListener("click", (e) => { e.preventDefault(); abrir(i); }));
  document.getElementById("lbFechar").addEventListener("click", fechar);
  document.getElementById("lbAnterior").addEventListener("click", () => mostrar(atual - 1));
  document.getElementById("lbProximo").addEventListener("click", () => mostrar(atual + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) fechar(); });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharMenu();
    if (lb.hidden) return;
    if (e.key === "Escape") fechar();
    if (e.key === "ArrowLeft") mostrar(atual - 1);
    if (e.key === "ArrowRight") mostrar(atual + 1);
  });

  /* Arrastar para o lado no celular troca a foto */
  let toqueX = null;
  lb.addEventListener("touchstart", (e) => { toqueX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (toqueX === null) return;
    const dx = e.changedTouches[0].clientX - toqueX;
    if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
    toqueX = null;
  });
});
