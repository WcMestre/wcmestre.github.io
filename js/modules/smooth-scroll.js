/**
 * modules/smooth-scroll.js — Foco após pular para uma âncora.
 *
 * O deslocamento suave é feito por CSS (`scroll-behavior: smooth` +
 * `scroll-padding-top`), que já respeita prefers-reduced-motion. O que o CSS
 * não faz é mover o foco do teclado: sem isso, quem navega por Tab continua
 * de onde estava, e não da seção para onde acabou de ir.
 *
 * Por isso este módulo NÃO chama preventDefault — a navegação nativa e o
 * histórico continuam intactos.
 */

import { $$, on } from "../utils/dom.js";

export function initSmoothScroll() {
  for (const link of $$('a[href^="#"]')) {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") continue;

    on(link, "click", (event) => {
      // Gatilho de modal: modules/modal.js já cancelou o evento e cuidou do
      // foco. Mover o foco aqui roubaria a posição de dentro do diálogo.
      if (event.defaultPrevented) return;

      const id = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(id);
      if (!target) return;

      // Diálogo fechado não é destino de rolagem.
      if (target.tagName === "DIALOG" && !target.open) return;

      // Elementos como <section> não são focáveis por padrão. tabindex="-1"
      // permite foco programático sem entrar na ordem de tabulação.
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }

      // preventScroll evita que o foco cancele a rolagem suave em andamento.
      target.focus({ preventScroll: true });
    });
  }
}
