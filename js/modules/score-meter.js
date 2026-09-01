/**
 * modules/score-meter.js — Anima as barras do Technology Efficiency Score.
 *
 * Os números são texto no HTML e já estão corretos antes de qualquer script
 * rodar; este módulo só cuida do preenchimento visual da barra, que é
 * decorativa (aria-hidden). Todos os valores são ilustrativos.
 */

import { $$, observeOnce } from "../utils/dom.js";
import { prefersReducedMotion } from "../utils/motion.js";

const STAGGER_MS = 80;

export function initScoreMeters() {
  const groups = $$(".meters");
  if (!groups.length) return;

  const show = (group) => group.classList.add("is-visible");

  // O escalonamento é dado em CSS custom property para que a animação
  // continue sendo do CSS — o JS só decide quando ela começa.
  for (const group of groups) {
    $$(".meter", group).forEach((meter, index) => {
      meter.style.setProperty("--delay", `${index * STAGGER_MS}ms`);
    });
  }

  if (prefersReducedMotion()) {
    groups.forEach(show);
    return;
  }

  try {
    const observer = observeOnce(show, { threshold: 0.25 });
    groups.forEach((group) => observer.observe(group));
  } catch {
    groups.forEach(show);
  }
}
