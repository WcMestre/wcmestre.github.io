/**
 * utils/motion.js — Preferência de movimento reduzido.
 *
 * Espelha em JavaScript a mesma media query que base/accessibility.css usa.
 * As duas metades precisam concordar: CSS neutraliza transições, este módulo
 * evita que os scripts sequer iniciem uma animação.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

const mediaQuery =
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(QUERY)
    : null;

/**
 * @returns {boolean} true se o visitante pediu menos movimento.
 */
export function prefersReducedMotion() {
  return Boolean(mediaQuery && mediaQuery.matches);
}

/**
 * Observa mudanças na preferência (o visitante pode alterar no sistema
 * operacional com a página aberta).
 *
 * @param {(reduced: boolean) => void} callback
 * @returns {() => void} função para cancelar a observação
 */
export function onMotionPreferenceChange(callback) {
  if (!mediaQuery) return () => {};

  const handler = (event) => callback(event.matches);

  // Safari < 14 só expõe a API antiga.
  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }

  mediaQuery.addListener(handler);
  return () => mediaQuery.removeListener(handler);
}
