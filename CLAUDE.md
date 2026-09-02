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
- **Sem tracker e sem cookie.** Nada de Analytics, Pixel, Hotjar. Nada em
  `localStorage` ou `sessionStorage`. Se um dia entrar tracker, entra junto o
  consentimento.
- **Tom executivo e concreto.** Fala-se em resultado ("eliminamos digitação
  duplicada"), não em tecnologia ("implementamos integração via APIs").
  Proibido: "soluções disruptivas", "revolucionar", "transformação 360",
  "tecnologia de ponta".

---

## Arquitetura — o que quebra se você mexer sem pensar

**25 arquivos CSS, carregados em 25 `<link>` paralelos.** Não use `@import`:
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
deles. Se voltar a `translate`, 25 cards perdem o hover silenciosamente.

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

9 seções na rolagem, 4 diálogos:

```
Hero → Problema → Proposta → Soluções → Para quem
     → Metodologia → Diferenciais → CTA → Contato
```

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

## Revisões de texto posteriores ao briefing

O cliente revisa a copy **sessão a sessão**, apontando um trecho por vez. As
mudanças abaixo são decisão dele, tomada depois do briefing e **substituem** o
texto original. Não as trate como regressão nem as "restaure" ao comparar a
página com o briefing.

| Data | Onde | Antes (briefing) | Agora |
|---|---|---|---|
| 2026-09-02 | CTA primário do hero | "Conversar sobre minha operação" (§15) | "Fale com um de nossos especialistas" |

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
      e-mail e LinkedIn são removidos da página e o bloco "Canais diretos" some
      inteiro — comportamento correto por design, mas é conteúdo comercial
      fora do ar. O formulário está sem destino.
- [ ] **Enforce HTTPS** desmarcado em Settings → Pages: `http://labmidia.tec.br/`
      responde 200 direto em vez de redirecionar.
- [ ] **`address` no JSON-LD** — foi adicionado com apenas cidade/estado/país,
      porque sem ele a marcação `LocalBusiness` fica inelegível no Rich
      Results. O briefing dizia para não adicionar endereço; a cidade já
      aparece duas vezes na página, então nada novo é afirmado. Aguarda o aval
      do cliente; se ele recusar, remover o bloco `address`.
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
