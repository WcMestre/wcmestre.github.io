/**
 * modules/contact-links.js — Preenche os canais de contato a partir de config.js.
 *
 * Regra de produto: canal não configurado é REMOVIDO da página, nunca exibido
 * como link morto ou texto "preencher aqui". Se o site for publicado antes de
 * config.js ser preenchido, o visitante vê uma página coerente — só com menos
 * canais — e o desenvolvedor recebe um aviso no console.
 *
 * Coerência inclui não deixar cabeçalho órfão: quando TODOS os canais de uma
 * lista somem, o bloco (ou o título + a lista) sai junto.
 *
 * Marcação esperada:
 *   <li data-channel-item><a data-channel="whatsapp" href="#contato">WhatsApp</a></li>
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

/**
 * Remove o item do canal e devolve a lista que o continha, para que o
 * chamador possa decidir depois se a lista ficou vazia.
 * @param {Element} el
 * @returns {Element|null}
 */
function removeChannel(el) {
  const item = el.closest("[data-channel-item]") || el.closest("li") || el;
  const list = item.parentElement;
  item.remove();
  return list;
}

/**
 * Tira da página listas de canais que ficaram sem nenhum item.
 * Só recebe listas que de fato tinham [data-channel-item] — a lista de
 * navegação do rodapé usa a mesma classe .footer__list e nunca é tocada.
 * @param {Set<Element>} lists
 */
function pruneEmptyLists(lists) {
  for (const list of lists) {
    if (!list || !list.isConnected) continue;
    if (list.querySelector("li")) continue;

    // No aside de contato o bloco só contém título + lista: sai inteiro.
    const block = list.closest(".contact__block");
    if (block) {
      block.remove();
      continue;
    }

    // No rodapé, remove o título imediatamente anterior e a lista.
    const column = list.parentElement;
    const heading = list.previousElementSibling;
    if (heading && /^H[1-6]$/.test(heading.tagName)) heading.remove();
    list.remove();

    // Se a coluna ficou sem conteúdo nenhum, ela sai também — senão o grid do
    // rodapé abre uma coluna vazia. A checagem é por conteúdo remanescente, e
    // não incondicional, para que a coluna sobreviva caso volte a ter texto.
    if (column && !column.querySelector("h1,h2,h3,h4,h5,h6,p,ul,ol,a,img")) {
      column.remove();
    }
  }
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

  /** @type {Set<Element>} listas que perderam ao menos um item */
  const touched = new Set();

  for (const el of $$("[data-channel]")) {
    const kind = el.dataset.channel;
    const resolve = resolvers[kind];
    if (!resolve) continue;

    const href = resolve();

    if (!href) {
      const list = removeChannel(el);
      if (list) touched.add(list);
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

  pruneEmptyLists(touched);

  const missing = missingConfigKeys();
  if (missing.length) {
    console.warn(
      `[LabMídia TechOps] Configuração pendente em js/config.js: ${missing.join(
        ", "
      )}. Os canais correspondentes foram omitidos da página.`
    );
  }
}
