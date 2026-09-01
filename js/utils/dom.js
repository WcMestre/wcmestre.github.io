/**
 * utils/dom.js — Atalhos de DOM.
 * Deliberadamente pequeno: o suficiente para não repetir querySelector,
 * longe de virar uma micro-biblioteca.
 */

/**
 * @param {string} selector
 * @param {ParentNode} [scope=document]
 * @returns {Element|null}
 */
export const $ = (selector, scope = document) => scope.querySelector(selector);

/**
 * @param {string} selector
 * @param {ParentNode} [scope=document]
 * @returns {Element[]}
 */
export const $$ = (selector, scope = document) =>
  Array.from(scope.querySelectorAll(selector));

/**
 * Adiciona um listener e devolve a função que o remove.
 * @param {EventTarget} target
 * @param {string} type
 * @param {EventListenerOrEventListenerObject} handler
 * @param {AddEventListenerOptions|boolean} [options]
 * @returns {() => void}
 */
export function on(target, type, handler, options) {
  target.addEventListener(type, handler, options);
  return () => target.removeEventListener(type, handler, options);
}

/**
 * Cria um IntersectionObserver que dispara uma vez por elemento e depois
 * para de observá-lo. Padrão de todas as animações de entrada do site.
 *
 * @param {(el: Element) => void} onEnter
 * @param {IntersectionObserverInit} [options]
 * @returns {{ observe: (el: Element) => void, disconnect: () => void }}
 */
export function observeOnce(onEnter, options = {}) {
  // Sem suporte a IntersectionObserver: aciona imediatamente. O conteúdo
  // aparece sem animação, que é o comportamento correto de degradação.
  if (typeof IntersectionObserver === "undefined") {
    return {
      observe: (el) => onEnter(el),
      disconnect: () => {},
    };
  }

  const observer = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      obs.unobserve(entry.target);
      onEnter(entry.target);
    }
  }, options);

  return {
    observe: (el) => observer.observe(el),
    disconnect: () => observer.disconnect(),
  };
}
