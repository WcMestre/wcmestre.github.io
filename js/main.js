/**
 * main.js — Ponto de entrada.
 *
 * Só faz três coisas: cancelar a rede de segurança do boot, inicializar cada
 * módulo isoladamente e registrar falhas. Nenhuma lógica de página vive aqui.
 *
 * Cada init() é chamado dentro de um try/catch próprio: um módulo que quebre
 * (extensão de navegador, API ausente, HTML alterado) não pode derrubar os
 * outros — sobretudo o initReveal, de que depende a visibilidade do conteúdo.
 */

import { initNavigation } from "./modules/navigation.js";
import { initHeaderScroll } from "./modules/header-scroll.js";
import { initScrollSpy } from "./modules/scroll-spy.js";
import { initSmoothScroll } from "./modules/smooth-scroll.js";
import { initReveal } from "./modules/reveal.js";
import { initScoreMeters } from "./modules/score-meter.js";
import { initModals } from "./modules/modal.js";
import { initContactLinks } from "./modules/contact-links.js";
import { initForm } from "./modules/form.js";

/**
 * Ordem intencional: o que afeta o que o visitante vê primeiro vem primeiro.
 * @type {Array<[string, () => void]>}
 */
const MODULES = [
  ["reveal", initReveal],
  ["navigation", initNavigation],
  ["header-scroll", initHeaderScroll],
  // modal ANTES de smooth-scroll: os gatilhos são âncoras, e os dois módulos
  // escutam o mesmo clique. Quem registra primeiro roda primeiro — o modal
  // precisa cancelar o evento (ou fechar o diálogo) antes que o smooth-scroll
  // tente mover o foco para o alvo.
  ["modal", initModals],
  ["smooth-scroll", initSmoothScroll],
  ["scroll-spy", initScrollSpy],
  ["score-meter", initScoreMeters],
  ["contact-links", initContactLinks],
  ["form", initForm],
];

function boot() {
  // Desarma o temporizador de segurança declarado no <head> do index.html:
  // chegamos até aqui, então os módulos carregaram.
  if (window.__labmidiaBootTimer) {
    clearTimeout(window.__labmidiaBootTimer);
    window.__labmidiaBootTimer = null;
  }

  for (const [name, init] of MODULES) {
    try {
      init();
    } catch (error) {
      console.error(`[LabMídia TechOps] Módulo "${name}" falhou:`, error);
    }
  }

  document.documentElement.classList.add("js-ready");
}

// Scripts type="module" são adiados por padrão, mas a guarda mantém o módulo
// utilizável caso venha a ser carregado de outra forma.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
