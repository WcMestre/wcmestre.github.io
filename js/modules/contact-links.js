/**
 * modules/contact-links.js — Preenche os canais de contato a partir de config.js.
 *
 * Regra de produto: canal não configurado é REMOVIDO da página, nunca exibido
 * como link morto ou texto "preencher aqui". Se o site for publicado antes de
 * config.js ser preenchido, o visitante vê uma página coerente — só com menos
 * canais — e o desenvolvedor recebe um aviso no console.
 *
 * Marcação esperada:
 *   <a data-channel="whatsapp" href="#contato">WhatsApp</a>
 *   <a data-channel="email"    href="#contato">E-mail</a>
 *   <a data-channel="linkedin" href="#contato">LinkedIn</a>
 */

import { $$ } from "../utils/dom.js";
import { CONFIG, missingConfigKeys } from "../config.js";

/**
 * Monta a URL do WhatsApp. Remove tudo que não for dígito, então tanto
 * "5517900000000" quanto "+55 (17) 90000-0000" funcionam.
 * @param {string} raw
 * @param {string} message
 * @returns {string}
 */
function whatsappUrl(raw, message) {
  const digits = String(raw).replace(/\D/g, "");
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${query}`;
}

/** @param {Element} el */
function removeChannel(el) {
  const container = el.closest("[data-channel-item]") || el.closest("li") || el;
  container.remove();
}

export function initContactLinks() {
  const resolvers = {
    whatsapp: () =>
      CONFIG.whatsapp
        ? whatsappUrl(CONFIG.whatsapp, CONFIG.whatsappMessage)
        : null,
    email: () => (CONFIG.email ? `mailto:${CONFIG.email}` : null),
    linkedin: () => CONFIG.linkedin || null,
  };

  for (const el of $$("[data-channel]")) {
    const kind = el.dataset.channel;
    const resolve = resolvers[kind];

    if (!resolve) continue;

    const href = resolve();

    if (!href) {
      removeChannel(el);
      continue;
    }

    el.setAttribute("href", href);

    // Canais externos abrem em nova aba; mailto e tel, não.
    if (href.startsWith("http")) {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    }

    // Se o HTML marcou onde escrever o valor legível, escreve.
    const label = el.querySelector("[data-channel-value]");
    if (label && kind === "email") label.textContent = CONFIG.email;
  }

  const missing = missingConfigKeys();
  if (missing.length) {
    console.warn(
      `[LabMídia TechOps] Configuração pendente em js/config.js: ${missing.join(
        ", "
      )}. Os canais correspondentes foram omitidos da página.`
    );
  }
}
