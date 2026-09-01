/**
 * modules/scroll-spy.js — Marca na navegação a seção que está sendo lida.
 *
 * Puramente informativo: a classe .is-active e aria-current desenham o
 * estado, mas os links continuam funcionando sem este módulo.
 */

import { $$, on } from "../utils/dom.js";

export function initScrollSpy() {
  if (typeof IntersectionObserver === "undefined") return;

  const links = $$('.nav__link[href^="#"]');
  if (!links.length) return;

  /** @type {Map<string, Element>} id da seção -> link */
  const linkById = new Map();
  /** @type {Element[]} seções em ordem de documento */
  const sections = [];

  for (const link of links) {
    const id = decodeURIComponent(link.getAttribute("href").slice(1));
    if (!id) continue;
    const section = document.getElementById(id);
    if (!section) continue;
    linkById.set(id, link);
    sections.push(section);
  }

  if (!sections.length) return;

  /** @type {Set<string>} */
  const visible = new Set();

  const setActive = (id) => {
    for (const [key, link] of linkById) {
      const active = key === id;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  };

  const update = () => {
    if (!visible.size) return;
    // Entre as seções visíveis, a que estiver mais acima no documento manda.
    const current = sections.find((section) => visible.has(section.id));
    if (current) setActive(current.id);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      update();
    },
    {
      // Banda de leitura: ignora o que está sob o header e o terço final da
      // tela, para o destaque acompanhar o que o visitante está de fato lendo.
      rootMargin: "-88px 0px -55% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));

  // Ao voltar ao topo nenhuma seção está na banda de leitura — limpa tudo.
  on(
    window,
    "scroll",
    () => {
      if (window.scrollY < 80) setActive(null);
    },
    { passive: true }
  );
}
