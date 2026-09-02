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
   * O GitHub Pages não tem backend. Enquanto o envio não estiver configurado,
   * o formulário usa CONFIG.email como fallback: abre o cliente de e-mail do
   * visitante com os dados já preenchidos.
   *
   * SERVIÇO ATIVO: Web3Forms, configurado em 2026-09-02.
   *
   * O destino dos e-mails NÃO fica aqui: está amarrado ao endereço com que a
   * Access Key foi gerada em web3forms.com. Para trocar quem recebe os leads,
   * gere uma chave nova lá e substitua `accessKey` — mexer em CONFIG.email
   * não muda nada nesse caminho.
   *
   * Outras opções, caso mude de ideia:
   *   Formspree   endpoint: "https://formspree.io/f/SEU_ID"   (sem accessKey)
   *   API própria endpoint: "https://sua-api.com/leads"       (aceita POST JSON)
   */
  form: {
    endpoint: "https://api.web3forms.com/submit",

    /**
     * Chave pública do Web3Forms. Vai no payload como `access_key` e é
     * pública por design — pode ficar no repositório sem risco.
     *
     * Com `endpoint` do Web3Forms preenchido e esta chave vazia, o envio é
     * bloqueado de propósito: o serviço rejeitaria o POST e o visitante veria
     * um erro de rede em vez do fallback por e-mail. Ver js/modules/form.js.
     */
    accessKey: "2279d22e-6020-450e-b3fa-48605ca3a822",

    /** Para onde levar o visitante depois do envio. Vazio => mensagem inline. */
    redirectOnSuccess: "",
  },

  /**
   * Domínio de referência, apenas documental. NENHUM módulo lê esta chave:
   * canonical, Open Graph, JSON-LD e sitemap usam URL absoluta escrita à mão.
   * Trocar de domínio exige editar, além daqui: o <head> de index.html,
   * sitemap.xml, robots.txt e o arquivo CNAME.
   */
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
