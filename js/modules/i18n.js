/**
 * modules/i18n.js — Português, inglês e espanhol.
 *
 * O HTML é a fonte em português. Os dicionários (`i18n/en.json`, `i18n/es.json`)
 * mapeiam **o texto de origem** para a tradução — não há chaves simbólicas nem
 * atributos `data-i18n` espalhados pela marcação. Isso mantém o HTML limpo e
 * torna os JSONs legíveis por quem não programa, ao custo de exigir que a
 * string do dicionário seja idêntica à do HTML depois de normalizada.
 *
 * A normalização (`norm`) é a MESMA usada pelo extrator em `tools/validate.py`.
 * Se as duas divergirem, a chave não casa e o texto fica em português sem
 * nenhum erro visível — por isso o validador confere a cobertura.
 *
 * Escolha do idioma, nesta ordem:
 *   1. `?lang=` na URL          (o que o seletor grava, e o que se compartilha)
 *   2. `navigator.languages`    (idioma do navegador, como pedido)
 *   3. português
 *
 * A preferência vive na URL porque o projeto não usa localStorage, cookie nem
 * sessionStorage. Efeito colateral desejável: o link fica compartilhável.
 *
 * Sem JavaScript a página permanece em português — consequência assumida da
 * arquitetura de troca no cliente.
 */

import { $, $$, on } from "../utils/dom.js";

const PADRAO = "pt";
const IDIOMAS = ["pt", "en", "es"];
const CANONICO = "https://labmidia.tec.br/";

/** Locale completo para o atributo lang e para og:locale. */
const LOCALE = { pt: "pt-BR", en: "en", es: "es" };
const OG_LOCALE = { pt: "pt_BR", en: "en_US", es: "es_ES" };

/** Elementos cujo conteúdo nunca é texto de interface. */
const IGNORAR = new Set(["SCRIPT", "STYLE", "SVG", "NOSCRIPT"]);

/** Atributos traduzíveis presentes na marcação. */
const ATRIBUTOS = ["alt", "aria-label", "placeholder"];

/**
 * Colapsa espaços em branco e apara as pontas.
 * DEVE ser idêntica à normalização de tools/validate.py.
 * @param {string} t
 * @returns {string}
 */
const norm = (t) => t.replace(/\s+/g, " ").trim();

/** Guarda o texto original (português) para permitir voltar. */
const originaisTexto = new Map();
const originaisAttr = new Map();
let originaisHead = null;

/**
 * @returns {string} idioma resolvido, sempre um de IDIOMAS
 */
function resolverIdioma() {
  const daUrl = new URLSearchParams(location.search).get("lang");
  if (daUrl && IDIOMAS.includes(daUrl)) return daUrl;

  const doNavegador = navigator.languages || [navigator.language || ""];
  for (const tag of doNavegador) {
    const base = String(tag).toLowerCase().split("-")[0];
    if (IDIOMAS.includes(base)) return base;
  }
  return PADRAO;
}

/**
 * Percorre os nós de texto do corpo, pulando script/style/svg.
 * @param {(no: Text) => void} visitar
 */
function percorrerTextos(visitar) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(no) {
      if (!no.nodeValue || !norm(no.nodeValue)) return NodeFilter.FILTER_REJECT;
      let pai = no.parentElement;
      while (pai) {
        if (IGNORAR.has(pai.tagName) || pai.tagName === "svg") {
          return NodeFilter.FILTER_REJECT;
        }
        pai = pai.parentElement;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nos = [];
  while (walker.nextNode()) nos.push(walker.currentNode);
  nos.forEach(visitar);
}

/** Captura o estado em português uma única vez, antes da primeira troca. */
function guardarOriginais() {
  if (originaisHead) return;

  percorrerTextos((no) => originaisTexto.set(no, no.nodeValue));

  for (const el of $$("[alt], [aria-label], [placeholder]")) {
    for (const attr of ATRIBUTOS) {
      if (el.hasAttribute(attr)) {
        originaisAttr.set(`${attr}`, originaisAttr.get(attr) || new Map());
        originaisAttr.get(attr).set(el, el.getAttribute(attr));
      }
    }
  }

  originaisHead = {
    title: document.title,
    metas: new Map(
      $$(
        'meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[property="og:image:alt"], meta[name="twitter:title"], meta[name="twitter:description"]'
      ).map((m) => [m, m.getAttribute("content")])
    ),
  };
}

/**
 * Aplica um dicionário. Passar `null` restaura o português.
 * @param {Record<string,string>|null} dic
 */
function aplicar(dic) {
  const traduz = (valor) => {
    const chave = norm(valor);
    if (!dic) return null;
    return Object.prototype.hasOwnProperty.call(dic, chave) ? dic[chave] : null;
  };

  // Texto. Preserva os espaços das pontas para não colar palavras vizinhas
  // quando o nó fica ao lado de um <strong> ou de um link.
  for (const [no, original] of originaisTexto) {
    if (!no.isConnected) continue;
    const alvo = traduz(original);
    if (alvo === null) {
      no.nodeValue = original;
      continue;
    }
    const inicio = original.match(/^\s*/)[0];
    const fim = original.match(/\s*$/)[0];
    no.nodeValue = inicio + alvo + fim;
  }

  // Atributos
  for (const [attr, mapa] of originaisAttr) {
    for (const [el, original] of mapa) {
      if (!el.isConnected) continue;
      const alvo = traduz(original);
      el.setAttribute(attr, alvo === null ? original : alvo);
    }
  }

  // <head>
  const t = traduz(originaisHead.title);
  document.title = t === null ? originaisHead.title : t;
  for (const [meta, original] of originaisHead.metas) {
    const alvo = traduz(original);
    meta.setAttribute("content", alvo === null ? original : alvo);
  }
}

/**
 * Sincroniza os metadados que dependem do idioma: o atributo lang (leitores de
 * tela usam para escolher a pronúncia), og:locale e a URL canônica.
 * @param {string} idioma
 */
function marcarIdioma(idioma) {
  document.documentElement.lang = LOCALE[idioma];

  const ogLocale = $('meta[property="og:locale"]');
  if (ogLocale) ogLocale.setAttribute("content", OG_LOCALE[idioma]);

  const canonical = $('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute(
      "href",
      idioma === PADRAO ? CANONICO : `${CANONICO}?lang=${idioma}`
    );
  }

  for (const botao of $$("[data-lang]")) {
    botao.setAttribute("aria-pressed", String(botao.dataset.lang === idioma));
  }
}

/**
 * @param {string} idioma
 * @returns {Promise<Record<string,string>|null>}
 */
async function carregarDicionario(idioma) {
  if (idioma === PADRAO) return null;
  const resposta = await fetch(`./i18n/${idioma}.json`, { cache: "force-cache" });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  return resposta.json();
}

export function initI18n() {
  const seletor = $(".lang-switch");
  guardarOriginais();

  let atual = PADRAO;

  const trocar = async (idioma, atualizarUrl) => {
    if (!IDIOMAS.includes(idioma) || idioma === atual) return;
    try {
      const dic = await carregarDicionario(idioma);
      aplicar(dic);
      marcarIdioma(idioma);
      atual = idioma;

      if (atualizarUrl) {
        const url = new URL(location.href);
        if (idioma === PADRAO) url.searchParams.delete("lang");
        else url.searchParams.set("lang", idioma);
        history.replaceState(null, "", url);
      }
    } catch (erro) {
      // Falha ao buscar o dicionário deixa a página em português, que é um
      // estado íntegro. Nada de página meio traduzida.
      console.error(`[LabMídia TechOps] Falha ao carregar o idioma "${idioma}":`, erro);
    }
  };

  if (seletor) {
    seletor.hidden = false;
    for (const botao of $$("[data-lang]", seletor)) {
      on(botao, "click", () => trocar(botao.dataset.lang, true));
    }
  }

  marcarIdioma(PADRAO);

  const detectado = resolverIdioma();
  if (detectado !== PADRAO) {
    // Não reescreve a URL na detecção automática: quem chegou sem `?lang=`
    // deve continuar podendo compartilhar a URL limpa.
    trocar(detectado, false);
  }
}
