/**
 * modules/form.js — Validação e envio do formulário de contato.
 *
 * Caminhos de envio, nesta ordem:
 *   1. CONFIG.form.endpoint preenchido  -> POST JSON (Formspree, Web3Forms, API própria)
 *   2. só CONFIG.email preenchido       -> abre o cliente de e-mail com os dados
 *   3. nada configurado                 -> mensagem honesta + erro no console
 *
 * Nada é gravado em localStorage, sessionStorage ou cookie.
 */

import { $, $$, on } from "../utils/dom.js";
import { CONFIG } from "../config.js";

const MESSAGES = {
  required: "Preencha este campo.",
  email: "Informe um e-mail válido.",
  select: "Selecione uma opção.",
  invalidForm: "Revise os campos destacados antes de enviar.",
  sending: "Enviando…",
  success:
    "Recebemos seu contato. Retornaremos em breve para agendar a conversa.",
  networkError:
    "Não foi possível enviar agora. Tente novamente em instantes ou fale conosco por outro canal.",
  notConfigured:
    "O envio automático ainda não está disponível neste site. Tente novamente mais tarde.",
};

/**
 * O texto do fallback por e-mail precisa citar o endereço: se o visitante não
 * tiver cliente de e-mail registrado, nada abre — e sem o endereço na tela ele
 * fica sem para onde escrever.
 * @returns {string}
 */
function mailtoMessage() {
  return `Abrimos seu programa de e-mail com a mensagem pronta — basta enviar. Se nada abriu, escreva para ${CONFIG.email}.`;
}

// Aceita a grande maioria dos endereços reais sem rejeitar casos válidos
// incomuns. A validação definitiva é sempre do servidor.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * @param {HTMLFormElement} form
 * @returns {HTMLElement[]}
 */
const controlsOf = (form) => $$("[data-validate]", form);

/**
 * @param {HTMLElement} control
 * @param {string} message
 */
function setError(control, message) {
  const errorEl = document.getElementById(`${control.id}-error`);
  control.setAttribute("aria-invalid", "true");
  if (errorEl) errorEl.textContent = message;
}

/** @param {HTMLElement} control */
function clearError(control) {
  const errorEl = document.getElementById(`${control.id}-error`);
  control.removeAttribute("aria-invalid");
  if (errorEl) errorEl.textContent = "";
}

/**
 * @param {HTMLElement} control
 * @returns {string} mensagem de erro, ou "" se válido
 */
function validateControl(control) {
  const value = String(control.value || "").trim();
  const rules = (control.dataset.validate || "").split(/\s+/).filter(Boolean);

  if (rules.includes("required") && !value) {
    return control.tagName === "SELECT" ? MESSAGES.select : MESSAGES.required;
  }

  if (rules.includes("email") && value && !EMAIL_PATTERN.test(value)) {
    return MESSAGES.email;
  }

  return "";
}

/**
 * @param {HTMLFormElement} form
 * @returns {HTMLElement|null} o primeiro controle inválido, ou null
 */
function validateForm(form) {
  let firstInvalid = null;

  for (const control of controlsOf(form)) {
    const message = validateControl(control);
    if (message) {
      setError(control, message);
      if (!firstInvalid) firstInvalid = control;
    } else {
      clearError(control);
    }
  }

  return firstInvalid;
}

/**
 * @param {HTMLFormElement} form
 * @returns {Record<string, string>}
 */
function collectPayload(form) {
  const data = new FormData(form);
  /** @type {Record<string, string>} */
  const payload = {};

  for (const [key, value] of data.entries()) {
    if (key.startsWith("_")) continue; // honeypot e campos internos
    const text = String(value).trim();
    if (text) payload[key] = text;
  }

  return payload;
}

/**
 * @param {Record<string, string>} payload
 * @param {HTMLFormElement} form
 * @returns {string} URL mailto: com assunto e corpo prontos
 */
function buildMailto(payload, form) {
  const labelOf = (name) => {
    const control = form.elements.namedItem(name);
    if (!control || !control.id) return name;
    const label = $(`label[for="${control.id}"]`, form);
    return label
      ? label.textContent.replace(/\s*\((opcional|se aplicável)\)\s*/i, "").trim()
      : name;
  };

  const body = Object.entries(payload)
    .map(([key, value]) => `${labelOf(key)}: ${value}`)
    .join("\r\n");

  const subject = `Contato pelo site — ${
    payload.empresa || payload.nome || "novo lead"
  }`;

  return `mailto:${CONFIG.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

/**
 * @param {HTMLElement} statusEl
 * @param {string} message
 * @param {"ok"|"error"|"pending"} [tone="pending"]
 */
function setStatus(statusEl, message, tone = "pending") {
  statusEl.textContent = message;
  statusEl.classList.toggle("form__status--ok", tone === "ok");
  statusEl.classList.toggle("form__status--error", tone === "error");
}

export function initForm() {
  const form = $("#form-contato");
  if (!form) return;

  const statusEl = $("#form-status");
  const submitButton = $('button[type="submit"]', form);
  if (!statusEl || !submitButton) return;

  // Validação nativa desligada para controlar as mensagens em português;
  // os type= dos campos continuam valendo para o teclado do celular.
  form.setAttribute("novalidate", "");

  // Enquanto o campo está em erro, corrigir limpa a mensagem na hora.
  for (const control of controlsOf(form)) {
    on(control, "input", () => {
      if (control.getAttribute("aria-invalid") === "true") {
        if (!validateControl(control)) clearError(control);
      }
    });
    on(control, "blur", () => {
      const message = validateControl(control);
      if (message) setError(control, message);
    });
  }

  /**
   * aria-disabled em vez de disabled: desabilitar o elemento que está com o
   * foco joga o foco para o <body>, e quem navega por teclado perde a posição
   * no meio do envio. Com aria-disabled o botão continua focável e a guarda
   * abaixo impede o envio duplicado.
   */
  let sending = false;
  const setBusy = (busy) => {
    sending = busy;
    submitButton.setAttribute("aria-disabled", String(busy));
    submitButton.setAttribute("aria-busy", String(busy));
  };

  on(form, "submit", async (event) => {
    event.preventDefault();
    if (sending) return;

    // Honeypot: preenchido só por robô. Responde como sucesso e não envia.
    const trap = form.elements.namedItem("_gotcha");
    if (trap && String(trap.value).trim()) {
      setStatus(statusEl, MESSAGES.success, "ok");
      form.reset();
      return;
    }

    const firstInvalid = validateForm(form);
    if (firstInvalid) {
      setStatus(statusEl, MESSAGES.invalidForm, "error");
      firstInvalid.focus();
      return;
    }

    const payload = collectPayload(form);
    const { accessKey, redirectOnSuccess } = CONFIG.form;

    // O Web3Forms rejeita qualquer POST sem `access_key`. Endpoint preenchido
    // e chave vazia é meio-caminho: sem esta guarda o visitante receberia um
    // erro de rede em vez de cair no fallback por e-mail, que funciona.
    const web3formsSemChave =
      CONFIG.form.endpoint.includes("api.web3forms.com") && !accessKey;

    if (web3formsSemChave) {
      console.error(
        "[LabMídia TechOps] Endpoint do Web3Forms configurado sem accessKey em js/config.js. Envio desativado; usando o fallback por e-mail."
      );
    }

    const endpoint = web3formsSemChave ? "" : CONFIG.form.endpoint;

    // --- Caminho 3: nada configurado ------------------------------------
    if (!endpoint && !CONFIG.email) {
      setStatus(statusEl, MESSAGES.notConfigured, "error");
      console.error(
        "[LabMídia TechOps] Formulário sem destino. Preencha CONFIG.form.endpoint ou CONFIG.email em js/config.js."
      );
      return;
    }

    // --- Caminho 2: fallback por e-mail ---------------------------------
    if (!endpoint) {
      setStatus(statusEl, mailtoMessage(), "ok");
      window.location.href = buildMailto(payload, form);
      return;
    }

    // --- Caminho 1: envio real ------------------------------------------
    setBusy(true);
    setStatus(statusEl, MESSAGES.sending, "pending");

    if (accessKey) {
      payload.access_key = accessKey;
      // O Web3Forms usa `subject` como assunto do e-mail que envia. Sem ele,
      // toda notificação chega com o mesmo título e a caixa de entrada não
      // diferencia um lead do outro.
      payload.subject = `Site — ${payload.empresa || payload.nome || "novo contato"}`;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      form.reset();
      controlsOf(form).forEach(clearError);

      if (redirectOnSuccess) {
        window.location.href = redirectOnSuccess;
        return;
      }

      setStatus(statusEl, MESSAGES.success, "ok");
    } catch (error) {
      setStatus(statusEl, MESSAGES.networkError, "error");
      console.error("[LabMídia TechOps] Falha no envio do formulário:", error);
    } finally {
      setBusy(false);
    }
  });
}
