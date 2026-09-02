/**
 * modules/logo-marquee.js — Faixa rolante de logos de clientes.
 *
 * O movimento depende deste módulo porque o laço contínuo exige uma segunda
 * trilha idêntica, clonada aqui. Sem JavaScript, ou com movimento reduzido, a
 * faixa permanece a grade estática que o HTML entrega.
 *
 * O clone é feito por script, e não escrito no HTML, para que trocar as logos
 * signifique editar uma lista só.
 *
 * NOTA DE ACESSIBILIDADE: havia um botão de pausa, removido a pedido do
 * cliente em 2026-09-02. Ele era o que atendia o WCAG 2.2.2 — conteúdo que se
 * move sozinho por mais de 5s precisa de mecanismo de pausa. O que restou é a
 * pausa no ponteiro e o respeito a prefers-reduced-motion, que desliga a
 * animação por completo. Não recoloque o botão sem falar com o cliente.
 */

import { $, $$ } from "../utils/dom.js";
import { prefersReducedMotion } from "../utils/motion.js";

export function initLogoMarquee() {
  const marquee = $("[data-marquee]");
  if (!marquee) return;

  const track = $(".logo-marquee__track", marquee);
  if (!track) return;

  // Sem animação: a faixa fica como o HTML a entrega.
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
}
