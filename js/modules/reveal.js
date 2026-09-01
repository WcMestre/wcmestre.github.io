/**
 * modules/reveal.js — Animação de entrada dos blocos.
 *
 * O estado inicial (opacidade zero) só existe sob a classe .js, aplicada
 * antes da primeira pintura. Se este módulo falhar, o conteúdo fica
 * invisível — por isso o fallback abaixo revela tudo em qualquer caminho
 * de erro ou de não-suporte.
 */

import { $$, observeOnce } from "../utils/dom.js";
import { prefersReducedMotion } from "../utils/motion.js";

export function initReveal() {
  const items = $$(".reveal");
  if (!items.length) return;

  const revealAll = () => items.forEach((el) => el.classList.add("is-visible"));

  if (prefersReducedMotion()) {
    revealAll();
    return;
  }

  try {
    const observer = observeOnce(
      (el) => el.classList.add("is-visible"),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach((el) => observer.observe(el));
  } catch {
    revealAll();
  }
}
