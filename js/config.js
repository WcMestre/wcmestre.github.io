/**
 * config.js — Ponto único de configuração do site.
 *
 * É o ÚNICO arquivo que precisa ser editado para colocar a landing page no ar
 * com os dados reais. Nenhum outro módulo tem dado de contato embutido.
 *
 * ATENÇÃO: este arquivo é servido publicamente. Nunca coloque aqui chave
 * privada, token, senha ou segredo de API. Endpoints de formulário como
 * Formspree e Web3Forms usam identificadores públicos, feitos para ficar
 * visíveis no front-end — isso é seguro. Qualquer credencial que precise
 * ficar secreta exige backend próprio.
 */

export const CONFIG = {
  /**
   * WhatsApp — apenas dígitos, com código do país e DDD, sem símbolos.
   * Exemplo: "5517900000000"
   * Vazio => o canal de WhatsApp é ocultado da página.
   */
  whatsapp: "",

  /** Mensagem que já vem preenchida ao abrir a conversa no WhatsApp. */
  whatsappMessage:
    "Olá! Cheguei pelo site da LabMídia TechOps e gostaria de conversar sobre a operação da minha empresa.",

  /**
   * E-mail comercial.
   * Vazio => o canal de e-mail é ocultado e o fallback do formulário
   * (envio por mailto) fica indisponível.
   */
  email: "",

  /** URL completa da página da empresa no LinkedIn. Vazio => canal oculto. */
  linkedin: "",

  /**
   * Formulário de contato.
   *
   * O GitHub Pages não tem backend. Enquanto `endpoint` estiver vazio, o
   * formulário usa o e-mail de CONFIG.email como fallback (abre o cliente de
   * e-mail do visitante com os dados preenchidos).
   *
   * Para envio real, cole aqui a URL do serviço escolhido:
   *   Formspree   https://formspree.io/f/SEU_ID
   *   Web3Forms   https://api.web3forms.com/submit   (+ accessKey abaixo)
   *   API própria https://sua-api.com/leads
   */
  form: {
    endpoint: "",

    /**
     * Chave pública do Web3Forms, se for esse o serviço. Enviada junto do
     * payload como `access_key`. É pública por design.
     */
    accessKey: "",

    /** Para onde levar o visitante depois do envio. Vazio => mensagem inline. */
    redirectOnSuccess: "",
  },

  /** Usado em canonical, Open Graph e no sitemap. Sem barra no final. */
  siteUrl: "https://labmidia.tec.br",
};

/**
 * Lista os campos ainda não preenchidos. Usado no console em ambiente de
 * desenvolvimento para lembrar o que falta antes de publicar.
 * @returns {string[]}
 */
export function missingConfigKeys() {
  const missing = [];
  if (!CONFIG.whatsapp) missing.push("whatsapp");
  if (!CONFIG.email) missing.push("email");
  if (!CONFIG.linkedin) missing.push("linkedin");
  if (!CONFIG.form.endpoint) missing.push("form.endpoint");
  return missing;
}
