# Contexto do projeto — LabMídia TechOps

Landing page institucional da **LabMídia TechOps**, empresa de Technology
Operations. Página única, estática, publicada em <https://labmidia.tec.br>.

O `README.md` documenta **como operar** o site (rodar, configurar, publicar).
Este arquivo registra **o que não pode ser quebrado** e o que ainda está aberto.
Leia os dois antes de mexer.

---

## Restrições inegociáveis

Vieram do briefing do cliente, não são preferência de implementação:

- **HTML5 + CSS3 + JavaScript Vanilla.** Nada de React, Vue, Angular,
  Bootstrap, Tailwind, jQuery, framework CSS ou JS. Sem bundler, sem passo de
  build, sem Node como dependência de runtime. O que está no repositório é
  exatamente o que o navegador recebe.
- **GitHub Pages.** Site 100% estático, sem backend. Caminhos de asset são
  relativos (`./css/…`) para funcionar também em subdiretório.
- **Não inventar dados da empresa.** Proibido criar número de clientes,
  projetos, faturamento, ROI, depoimentos, logos de clientes, cases,
  certificações, parceiros, quantidade de profissionais, percentuais de
  economia ou qualquer estatística. Também não inventar telefone, e-mail ou
  LinkedIn — esses vêm de `js/config.js`.
- **Números simulados exigem selo.** O Technology Efficiency Score e a lista
  Impacto × Esforço (no diálogo `#diagnostico`) são fictícios e carregam
  `Exemplo ilustrativo`, mais uma nota no rodapé do diálogo. **Não remova os
  selos** enquanto os números não forem reais e autorizados.
- **Logos de clientes: só as reais.** A seção `#clientes` traz sete logos
  fornecidas pelo cliente em 2026-09-02 — Sicoob Frutal, O Boticário, Informa
  Solutions, FORP, Flora Néctar, CS Energia Solar e Vittia. Se um dia faltar
  arquivo, **não invente uma marca de aparência plausível** para preencher: ou
  entra a logo verdadeira, ou o espaço fica vazio. Logo fabricada afirma uma
  relação comercial que não existe, e o site está no ar.
- **Sem tracker e sem cookie.** Nada de Analytics, Pixel, Hotjar. Nada em
  `localStorage` ou `sessionStorage`. Se um dia entrar tracker, entra junto o
  consentimento.
- **Tom executivo e concreto.** Fala-se em resultado ("eliminamos digitação
  duplicada"), não em tecnologia ("implementamos integração via APIs").
  Proibido: "soluções disruptivas", "revolucionar", "transformação 360",
  "tecnologia de ponta".
- **Primeira pessoa do plural, sempre.** "Funcionamos como o braço
  estratégico", não "A LabMídia TechOps funciona como…". O nome da empresa não
  se repete no corpo do texto — ele já está no logo, no título e no rodapé.
  Vale também para o leitor: é "na sua operação", nunca "no cliente" ou "na
  empresa". Regra dada pelo cliente em 2026-09-02.

---

## Arquitetura — o que quebra se você mexer sem pensar

**27 arquivos CSS, carregados em 27 `<link>` paralelos.** Não use `@import`:
encadeia requisições em série e o Lighthouse penaliza como *critical request
chain*. **A ordem dos `<link>` no `index.html` é a cascata** — `helpers.css` é
a última de propósito. Reordenar sem verificar quebra sobrescritas.

**`css/base/tokens.css` é a única fonte de cor, espaço, raio e duração.**
Nenhum outro arquivo declara valor literal de cor. Dois tokens têm justificativa
de contraste registrada em comentário e não devem ser afrouxados:

- `--border-control` (3.29:1) — borda de campo e de botão outline. WCAG 1.4.11
  exige 3:1; `--border-strong` dá 1.68:1 e serve só para fio divisório.
- `--accent` é ciano com texto escuro no CTA (10.9:1). Azul `--brand` com texto
  branco dá 4.4:1 e **reprova** AA. Não troque o fundo do `.btn--primary`.

**`.reveal` usa `transform`, não `translate`.** A propriedade individual tem
especificidade que sequestra o hover dos cards e sobrescreve as `transition`
deles. Se voltar a `translate`, os cards perdem o hover silenciosamente.

**Âncoras: só `scroll-padding-top` no `<html>`.** `scroll-padding` e
`scroll-margin` são independentes por especificação e **somam** — juntos
empurravam a seção 168px abaixo do topo.

**Progressive enhancement é real, não decorativo.** Tudo funciona sem
JavaScript:

- `.no-js` no `<html>` mantém navegação estática, diálogos no fluxo e barras do
  diagnóstico preenchidas. **Abaixo de 64rem** o header também deixa de ser
  sticky — a regra vive dentro do media query em `css/components/navigation.css`,
  porque só ali o menu empilhado inflaria o header para ~450px. Em desktop sem
  JS o header segue sticky, e está certo: a navegação continua horizontal.
- O script inline do `<head>` troca `.no-js` por `.js` antes da primeira
  pintura e arma um temporizador de 2,5s que **desfaz a troca** se os módulos
  não carregarem. Por isso não é preciso escrever uma regra `.js-boot-failed`
  nova a cada componente — mas por isso mesmo, **todo estado inicial escondido
  precisa estar sob `.js`**, nunca solto.

**Diálogos são `<dialog>` nativo.** Foco preso, `Escape`, inertização e retorno
do foco vêm do navegador. `js/modules/modal.js` só decide quando abrir e fechar.
Os gatilhos são `<a href="#id" data-modal-open>` — âncoras de verdade, para
funcionarem sem JS. **`modal` roda antes de `smooth-scroll` em `js/main.js`**:
os dois escutam o mesmo clique e a ordem importa.

**`js/utils/scroll-lock.js` tem contagem de referência.** Menu mobile e diálogo
travam a mesma rolagem; sem o contador, fechar um destrava com o outro aberto.

---

## Estado atual

10 seções na rolagem, 4 diálogos:

```
Hero → Problema → Proposta → Soluções → Para quem → Clientes
     → Metodologia → Diferenciais → CTA → Contato
```

A faixa de logos (`#clientes`) só se move sob a classe `.is-animated`, que
`js/modules/logo-marquee.js` aplica depois de clonar a trilha — o laço contínuo
precisa de uma segunda trilha idêntica. Sem JS não há clone, e a faixa fica
como a grade estática que o HTML entrega.

> **Dívida de acessibilidade conhecida.** A faixa tinha um botão de pausa,
> removido a pedido do cliente em 2026-09-02. Ele era o que atendia o
> **WCAG 2.2.2**: conteúdo que se move sozinho por mais de 5s precisa de um
> mecanismo de pausa, e hover não serve para quem navega por teclado. Restaram
> a pausa no ponteiro/foco e o `prefers-reduced-motion`, que desliga a animação
> por completo. Lighthouse não testa esse critério, então o número não cai —
> a lacuna é real mesmo assim. **Não recoloque o botão sem falar com o cliente.**

| Diálogo | Aberto por | Conteúdo |
|---|---|---|
| `#diagnostico` | card Solução 01 | Efficiency Score, Impacto × Esforço, entregáveis, IA |
| `#sprint` | card Solução 02 | Iniciativas, ciclo TEO, automações e integrações |
| `#tech-office` | card Solução 03 | Comparação tradicional × Tech Office, escopo |
| `#multiunidades` | link dentro de `#tech-office` | Árvore matriz → unidades |

Os ids `#ia` e `#integracoes` **não existem mais** — o conteúdo foi para dentro
dos diálogos. Nenhum link interno apontava para eles.

`vendor/`, `assets/css/`, `assets/js/` e `assets/webfonts/` são restos do
template antigo. Não são referenciados pelo site novo; ficam no repositório a
pedido do cliente. `img/` guarda a arte original da marca, fora do site.

---

## Três idiomas — e a armadilha que vem junto

Português (o HTML), inglês e espanhol. A troca é feita **no cliente**, sobre a
mesma URL, por `js/modules/i18n.js`. Escolha do cliente em 2026-09-02, ciente
de que o Google indexa apenas o português e de que sem JavaScript a página fica
em português.

**Os dicionários são indexados pelo texto de origem**, não por chaves
simbólicas: `i18n/en.json` e `i18n/es.json` mapeiam a frase em português para a
tradução. Não existe `data-i18n` na marcação.

> ⚠️ **Toda vez que você mudar uma palavra do `index.html`, a chave dos dois
> dicionários deixa de casar — e o texto fica em português nos outros idiomas,
> sem nenhum erro visível.** Rode `python tools/validate.py`: ele reextrai as
> strings e reprova se faltar tradução ou se sobrar chave órfã. É a única coisa
> que impede a página de degradar em silêncio a cada revisão de copy.

A função `norm()` (colapsa espaços, apara as pontas) existe duas vezes: em
`js/modules/i18n.js` e em `tools/validate.py`. **Elas têm de permanecer
idênticas.** Se divergirem, o validador aprova e o runtime erra a chave.

Ordem de detecção: `?lang=` na URL → `navigator.languages` → português. A
preferência vive na URL porque o projeto não usa cookie nem storage — e de
quebra o link fica compartilhável. O seletor nasce com `hidden` e só aparece
sob JavaScript: controle morto é pior que controle nenhum.

Marcas, siglas e nomes de produto **não** se traduzem: LabMídia TechOps,
Technology Office, Technology Operations, Technology Efficiency Score, TEO
Framework, Fractional CTO, as etapas Discover/Measure/Design/Execute/Optimize,
os nomes dos clientes e os tokens técnicos (API, CRM, ERP, BI, RPA, n8n…).

---

## Revisões de texto posteriores ao briefing

O cliente revisa a copy **sessão a sessão**, apontando um trecho por vez. As
mudanças abaixo são decisão dele, tomada depois do briefing e **substituem** o
texto original. Não as trate como regressão nem as "restaure" ao comparar a
página com o briefing.

| Data | Onde | Antes (briefing) | Agora |
|---|---|---|---|
| 2026-09-02 | CTA do hero e dos 3 rodapés de diálogo | "Conversar sobre minha operação" (§15) | "Falar com um especialista" — unificado com o CTA do header (§14) |
| 2026-09-02 | Lead da Proposta de valor | "A LabMídia TechOps funciona como um braço estratégico… dentro do cliente" (§18) | "Funcionamos como o braço estratégico… na sua operação" |
| 2026-09-02 | CTA final (`cta-band`) | Dois botões (§28) | Só o primário; "Solicitar diagnóstico" removido |
| 2026-09-02 | Localidade | "São José do Rio Preto e região" no aside de contato e no rodapé (§33) | Removida da página |
| 2026-09-02 | Título da seção Contato | "Conte como sua operação funciona hoje." + parágrafo de apoio | "Como sua operação funciona hoje?" — sem parágrafo |
| 2026-09-02 | Faixa de clientes | Botão "Pausar" + rótulo em cinza | Sem botão; rótulo "Clientes" com a classe `.eyebrow`, igual às demais seções |
| 2026-09-02 | Aside da seção Contato | "Atendimento" + "Como funciona" ao lado do formulário | Removidos; formulário centralizado, canais diretos em linha abaixo dele |
| 2026-09-02 | CTA final (`cta-band`) | "Conversar com a LabMídia TechOps" (§28) | "Começar uma conversa" — sem o nome da empresa |
| 2026-09-02 | H2 da Proposta de valor | "…para o empresário administrar" (§18) | "…para você administrar" — segunda pessoa, coerente com o lead |

Ao aplicar um pedido destes, verifique se o mesmo texto se repete em outro
lugar — vários CTAs compartilham rótulo — e **pergunte** antes de propagar,
em vez de mudar tudo por conta própria.

---

## Verificar antes de commitar

```bash
python tools/validate.py          # tags, ids, ARIA, headings, modais, tokens CSS
python -m http.server 8000        # ES Modules exigem HTTP; file:// não funciona
```

O validador cobre a classe de erro que passa despercebida numa revisão visual:
referência ARIA órfã, id duplicado, salto de heading, `data-modal-open` sem
diálogo, token CSS inexistente. Não substitui Lighthouse.

Para conferir produção, **`curl` nesta máquina precisa de `--ssl-no-revoke`** —
sem a flag, HTTPS externo retorna `HTTP 000` por política de revogação local, e
é fácil concluir errado que o site caiu.

O CDN do GitHub Pages serve a versão anterior por 40s a 2min após o push. Não
diagnostique "deploy quebrado" antes de sondar algumas vezes.

---

## Em aberto

Dependem do cliente, não de código:

- [ ] **`js/config.js` está vazio.** Em produção, agora, os canais WhatsApp,
      e-mail e LinkedIn são removidos da página — comportamento correto por
      design, mas é conteúdo comercial fora do ar. Falta: número do WhatsApp,
      e-mail comercial, URL do LinkedIn e a Access Key do **Web3Forms**
      (serviço escolhido em 2026-09-02; ver as instruções no próprio
      `config.js`).
- [ ] **Enforce HTTPS** desmarcado em Settings → Pages: `http://labmidia.tec.br/`
      responde 200 direto em vez de redirecionar.
- [x] ~~`address` no JSON-LD~~ — **resolvido em 2026-09-02.** Removido. Ele
      tinha sido adicionado para a marcação `LocalBusiness` ser elegível no
      Rich Results, sob o argumento de que a cidade já aparecia duas vezes na
      página e portanto nada novo era afirmado. Quando o cliente mandou tirar a
      localidade da página, o argumento caiu — e o briefing (§36) já dizia para
      não adicionar endereço. `areaServed` continua, porque está literal no
      briefing. Consequência aceita: o `ProfessionalService` não fica elegível
      a rich result de negócio local.
- [ ] **As logos de clientes estão abaixo da resolução ideal.** Os arquivos
      vieram num canvas de 144×144 px, então o desenho útil tem entre 30 e 91
      px de altura — menos de 2× o tamanho de exibição. O cliente vai
      reexportar os PNG maiores (decisão de 2026-09-02): **o desenho**, não o
      canvas, a pelo menos 300 px de altura. A troca é drop-in — mesmos nomes
      de arquivo, mesmo `--logo-h`, nada de HTML ou CSS muda.
- [ ] **Logo compacto do header é derivado.** `labmidia-techops-compact.png`
      foi montado a partir do original escalando a marca até a altura do
      wordmark. Se o designer entregar uma versão horizontal oficial, basta
      substituir o PNG.

Mantidos **deliberadamente**, contra a recomendação da revisão, por estarem
literais no briefing (§15 e §27) — não "corrija" sem falar com o cliente:

- o pilar **"Technology Management"** no hero, que destoa da assinatura
  "Technology Operations" e não é retomado em nenhum outro lugar;
- o nó **"Automation"** em inglês no diagrama de integrações, entre nós em
  português ("IA", e "Automação" no hero).
