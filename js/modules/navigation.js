/**
 * modules/navigation.js — Menu mobile.
 *
 * Contrato de acessibilidade:
 *   - aria-expanded no botão reflete o estado real;
 *   - o painel fechado sai da ordem de tabulação (visibility:hidden no CSS);
 *   - Escape fecha e devolve o foco ao botão;
 *   - clique fora fecha;
 *   - ao voltar para desktop o estado é zerado.
 */

import { $, $$, on } from "../utils/dom.js";
import { lockScroll, unlockScroll } from "../utils/scroll-lock.js";

const DESKTOP_QUERY = "(min-width: 64rem)";

export function initNavigation() {
  const toggle = $(".nav-toggle");
  const panel = $("#site-nav");
  if (!toggle || !panel) return;

  const desktop = window.matchMedia(DESKTOP_QUERY);
  let isOpen = false;

  const setState = (open) => {
    const changed = open !== isOpen;
    isOpen = open;
    panel.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Fechar menu de navegação" : "Abrir menu de navegação"
    );
    // Trava contada: um diálogo pode estar segurando a mesma trava.
    // Só transiciona, para não desbalancear o contador.
    if (changed) {
      if (open) lockScroll();
      else unlockScroll();
    }
  };

  const close = ({ restoreFocus = false } = {}) => {
    if (!isOpen) return;
    setState(false);
    if (restoreFocus) toggle.focus();
  };

  setState(false);

  on(toggle, "click", () => setState(!isOpen));

  // Navegar para uma âncora fecha o painel.
  $$("a", panel).forEach((link) => {
    on(link, "click", () => close());
  });

  on(document, "keydown", (event) => {
    if (event.key === "Escape") close({ restoreFocus: true });
  });

  on(document, "click", (event) => {
    if (!isOpen) return;
    const target = event.target;
    if (panel.contains(target) || toggle.contains(target)) return;
    close();
  });

  // Ao cruzar para desktop o painel volta a ser uma barra: zera o estado
  // para não deixar o body travado nem o aria-expanded mentindo.
  const onBreakpoint = (event) => {
    if (event.matches) close();
  };

  if (typeof desktop.addEventListener === "function") {
    desktop.addEventListener("change", onBreakpoint);
  } else {
    desktop.addListener(onBreakpoint);
  }
}
