/**
 * modules/header-scroll.js — Estado compacto do header após sair do topo.
 *
 * Usa IntersectionObserver sobre uma sentinela de 1px no topo do documento
 * em vez de um listener de scroll: não roda a cada frame de rolagem e não
 * força cálculo de layout.
 */

import { $ } from "../utils/dom.js";

export function initHeaderScroll() {
  const header = $(".site-header");
  const sentinel = $(".scroll-sentinel");
  if (!header || !sentinel) return;

  if (typeof IntersectionObserver === "undefined") return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle("is-scrolled", !entry.isIntersecting);
    },
    { threshold: 0 }
  );

  observer.observe(sentinel);
}
