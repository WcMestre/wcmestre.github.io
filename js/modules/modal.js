/**
 * modules/modal.js — Diálogos de detalhe das soluções.
 *
 * O elemento <dialog> nativo já entrega armadilha de foco, fechamento por
 * Escape, inertização do resto da página e devolução do foco ao gatilho.
 * Este módulo cuida apenas do que falta: interceptar os gatilhos, fechar ao
 * clicar no backdrop, animar a saída e encadear um diálogo no outro.
 *
 * Marcação esperada:
 *   <a href="#diagnostico" data-modal-open>Conhecer o diagnóstico</a>
 *   <dialog class="modal" id="diagnostico"> … <button data-modal-close> … </dialog>
 *
 * Os gatilhos são âncoras de verdade: sem JavaScript o navegador simplesmente
 * pula para o conteúdo, que o CSS devolve ao fluxo sob .no-js.
 */

import { $$, on } from "../utils/dom.js";
import { lockScroll, unlockScroll } from "../utils/scroll-lock.js";
import { prefersReducedMotion } from "../utils/motion.js";

/** Guarda para o caso de o animationend não disparar (aba oculta, etc.). */
const CLOSE_TIMEOUT_MS = 400;

/** @param {HTMLDialogElement} dialog */
function open(dialog) {
  if (dialog.open) return;
  dialog.classList.remove("is-closing");
  dialog.showModal();
  lockScroll();
}

/** @param {HTMLDialogElement} dialog */
function close(dialog) {
  if (!dialog.open || dialog.classList.contains("is-closing")) return;

  const finish = () => {
    dialog.classList.remove("is-closing");
    // close() devolve o foco ao elemento que abriu o diálogo.
    dialog.close();
  };

  if (prefersReducedMotion()) {
    finish();
    return;
  }

  dialog.classList.add("is-closing");
  let done = false;
  const once = () => {
    if (done) return;
    done = true;
    finish();
  };
  dialog.addEventListener("animationend", once, { once: true });
  window.setTimeout(once, CLOSE_TIMEOUT_MS);
}

export function initModals() {
  const dialogs = $$("dialog.modal");
  if (!dialogs.length) return;

  // Sem suporte a <dialog>: não intercepta nada. Os gatilhos continuam sendo
  // âncoras e o CSS abaixo devolve os diálogos ao fluxo.
  if (typeof HTMLDialogElement === "undefined" || !dialogs[0].showModal) {
    document.documentElement.classList.add("no-dialog");
    return;
  }

  for (const dialog of dialogs) {
    // Clique no backdrop: o alvo é o próprio <dialog>, não o painel interno.
    on(dialog, "click", (event) => {
      if (event.target === dialog) close(dialog);
    });

    // Escape dispara "cancel" antes de fechar; deixa a animação rodar.
    on(dialog, "cancel", (event) => {
      event.preventDefault();
      close(dialog);
    });

    on(dialog, "close", () => {
      unlockScroll();
      dialog.classList.remove("is-closing");
    });

    $$("[data-modal-close]", dialog).forEach((button) =>
      on(button, "click", () => {
        // Âncora que sai do diálogo (ex.: "Solicitar diagnóstico" → #contato):
        // fecha na hora, sem animação, para que a navegação nativa e o foco do
        // destino não briguem com a saída em curso.
        const href = button.getAttribute("href") || "";
        if (button.tagName === "A" && href.startsWith("#")) {
          dialog.close();
          return;
        }
        close(dialog);
      })
    );
  }

  for (const trigger of $$("[data-modal-open]")) {
    const href = trigger.getAttribute("href") || "";
    const id = trigger.dataset.modalOpen || href.replace(/^#/, "");
    const dialog = document.getElementById(id);
    if (!dialog || dialog.tagName !== "DIALOG") continue;

    on(trigger, "click", (event) => {
      event.preventDefault();

      // Gatilho dentro de um diálogo: fecha o atual antes de abrir o próximo,
      // para nunca empilhar dois modais.
      const current = trigger.closest("dialog.modal");
      if (current && current !== dialog) {
        current.addEventListener("close", () => open(dialog), { once: true });
        close(current);
        return;
      }

      open(dialog);
    });
  }
}
