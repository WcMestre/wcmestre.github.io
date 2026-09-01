/**
 * utils/scroll-lock.js — Trava de rolagem do fundo, com contagem de referência.
 *
 * Menu mobile e diálogos travam a mesma página. Se cada um escrevesse
 * document.body.style.overflow direto, fechar um deles destravaria a rolagem
 * enquanto o outro ainda estivesse aberto. O contador abaixo garante que a
 * trava só é liberada quando o último interessado a devolve.
 */

let holders = 0;
let previousOverflow = "";

/** Trava a rolagem do body. Idempotente por chamador. */
export function lockScroll() {
  if (holders === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  holders += 1;
}

/** Devolve uma trava obtida com lockScroll(). */
export function unlockScroll() {
  if (holders === 0) return;
  holders -= 1;
  if (holders === 0) {
    document.body.style.overflow = previousOverflow;
  }
}
