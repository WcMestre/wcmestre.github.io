/**
 * modules/logo-marquee.js — Faixa rolante de logos de clientes.
 *
 * Regra de acessibilidade que dita o desenho deste módulo: conteúdo que se
 * move sozinho por mais de 5 segundos precisa de um mecanismo de pausa
 * (WCAG 2.2.2). O botão de pausa depende de JavaScript — logo, o movimento
 * também tem de depender. Sem JS, ou com movimento reduzido, a faixa
 * permanece uma grade estática e nada aqui roda.
 *
 * O clone da trilha é feito por script, e não escrito no HTML, para que trocar
 * as logos signifique editar uma lista só.
 */

import { $, $$, on } from "../utils/dom.js";
import { prefersReducedMotion } from "../utils/motion.js";

export function initLogoMarquee() {
  const marquee = $("[data-marquee]");
  if (!marquee) return;

  const track = $(".logo-marquee__track", marquee);
  const toggle = $("[data-marquee-toggle]");
  if (!track) return;

  // Sem animação: a faixa fica como o HTML a entrega, e o botão não aparece.
  if (prefersReducedMotion()) return;

  // Trilha duplicada para o laço fechar sem salto. Marcada como decorativa
  // para o leitor de tela não anunciar as mesmas logos duas vezes.
  const clone = track.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  $$("a, button, input", clone).forEach((el) => {
    el.setAttribute("tabindex", "-1");
  });
  marquee.append(clone);

  // A duração acompanha a quantidade de logos: mais logos, mais tempo, para a
  // velocidade aparente não mudar quando a lista crescer.
  const count = $$(".logo-marquee__item", track).length;
  marquee.style.setProperty("--marquee-duration", `${Math.max(24, count * 6)}s`);

  marquee.classList.add("is-animated");

  if (!toggle) return;

  toggle.hidden = false;

  const setPaused = (paused) => {
    marquee.classList.toggle("is-paused", paused);
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.textContent = paused ? "Retomar" : "Pausar";
  };

  setPaused(false);
  on(toggle, "click", () => setPaused(!marquee.classList.contains("is-paused")));
}
