# LabMídia TechOps — Landing Page

Landing page institucional e comercial da **LabMídia TechOps** (Technology Operations).

Publicada em <https://labmidia.tec.br> via GitHub Pages, a partir da branch `main`
do repositório `WcMestre/wcmestre.github.io`.

---

## Stack

```
HTML5
CSS3
JavaScript Vanilla (ES Modules)
```

Sem framework, sem bundler, sem dependência de runtime. Nada de React, Vue,
Angular, Bootstrap, Tailwind ou jQuery. Não há passo de build: o que está no
repositório é exatamente o que o navegador recebe.

---

## Estrutura

```
/
├── index.html                  Página única — seções + 4 diálogos
├── favicon.ico                 16/32/48 — o erlenmeyer da marca sobre navy
├── robots.txt
├── sitemap.xml
├── CNAME                       labmidia.tec.br — NÃO REMOVER
│
├── css/
│   ├── base/                   Fundação — nesta ordem de cascata
│   │   ├── reset.css           Reset mínimo
│   │   ├── tokens.css          :root — TODAS as cores, espaços e tempos
│   │   ├── typography.css      Escala tipográfica e elementos de texto
│   │   └── accessibility.css   Foco, skip link, prefers-reduced-motion
│   ├── layout/
│   │   ├── grid.css            Container, seções, grades, split
│   │   ├── header.css          Header sticky e marca
│   │   └── footer.css
│   ├── components/             Widgets reutilizáveis
│   │   ├── navigation.css      Nav desktop + painel mobile
│   │   ├── button.css
│   │   ├── card.css
│   │   ├── chip.css            Pills, tags, selo "Exemplo ilustrativo"
│   │   ├── orbit.css           Diagrama do hero
│   │   ├── score-meter.css     Barras do Technology Efficiency Score
│   │   ├── stepper.css         TEO Framework
│   │   ├── flow.css            Cadeia ERP → API → … → BI
│   │   ├── diagram.css         Comparação + árvore matriz/unidades
│   │   ├── form.css
│   │   ├── modal.css           Diálogos das soluções
│   │   └── logo-marquee.css    Faixa rolante de logos de clientes
│   ├── sections/               Composição específica de cada seção
│   │   ├── hero.css
│   │   ├── solutions.css
│   │   ├── efficiency.css
│   │   ├── cta.css
│   │   └── contact.css
│   └── utilities/
│       ├── animations.css      Reveal, stagger, rede de segurança do boot
│       └── helpers.css         Ajustes pontuais (u-stack-*, u-center-x…)
│
├── js/
│   ├── main.js                 Entrada — só orquestra
│   ├── config.js               ⚠️ ÚNICO arquivo a editar para ir ao ar
│   ├── modules/                Um concern por arquivo
│   │   ├── navigation.js       Menu mobile + acessibilidade
│   │   ├── header-scroll.js    Header compacto ao rolar
│   │   ├── modal.js            Diálogos das soluções
│   │   ├── smooth-scroll.js    Foco de teclado ao pular para âncora
│   │   ├── scroll-spy.js       Link ativo na navegação
│   │   ├── reveal.js           Animação de entrada
│   │   ├── score-meter.js      Animação das barras do diagnóstico
│   │   ├── logo-marquee.js     Faixa de logos (clona a trilha para o laço)
│   │   ├── contact-links.js    Aplica config.js aos canais de contato
│   │   └── form.js             Validação e envio
│   └── utils/
│       ├── dom.js              $, $$, on, observeOnce
│       ├── motion.js           prefers-reduced-motion em JS
│       └── scroll-lock.js      Trava de rolagem com contagem de referência
│
├── assets/
│   ├── images/
│   │   └── og-cover.png        1200×630 — Open Graph / Twitter Card
│   ├── logos-clientes/         7 logos de clientes (PNG com alfa, recortadas)
│   ├── logo/
│   │   ├── labmidia-techops.png          Lockup completo (rodapé)
│   │   ├── labmidia-techops-compact.png  Lockup horizontal (header)
│   │   └── apple-touch-icon.png
│   └── icons/                  (vazio — os ícones são um sprite SVG inline)
│
└── img/                        Arte original da marca, fora do site
```

### Decisões de arquitetura que valem explicação

**1. Os CSS são carregados em `<link>` paralelos, não com `@import`.**
`@import` encadeia requisições em série — o navegador só descobre o segundo
arquivo depois de baixar o primeiro — e o Lighthouse penaliza isso como
*critical request chain*. Sobre HTTP/2, que é o que o GitHub Pages serve, N
arquivos pequenos do mesmo domínio são multiplexados na mesma conexão e custam
praticamente o mesmo que um arquivo único. **A ordem dos `<link>` no
`index.html` é a cascata** — não reordene sem verificar. `helpers.css` é a
última folha, de propósito.

**2. Os ícones são um sprite SVG inline no topo do `<body>`.**
Zero requisições, herdam `currentColor` e não dependem de fonte de ícones.
Por isso `assets/icons/` está vazia: existe pela estrutura pedida no briefing,
mas nada precisa ir para lá.

**3. Os detalhes das soluções são `<dialog>` nativos, não seções na rolagem.**
O elemento nativo entrega armadilha de foco, fechamento por `Escape`,
inertização do resto da página e devolução do foco ao gatilho — tudo o que uma
reimplementação em JavaScript costuma errar. `js/modules/modal.js` só decide
quando abrir e fechar.

A rolagem ficou com 10 seções; o material de aprofundamento vive nos diálogos:

| Diálogo | Aberto por | Conteúdo |
|---|---|---|
| `#diagnostico` | card Solução 01 | Technology Efficiency Score, Impacto × Esforço, entregáveis, **Inteligência Artificial** |
| `#sprint` | card Solução 02 | O que entra num sprint, ciclo TEO (Design/Execute/Optimize), **automações e integrações** |
| `#tech-office` | card Solução 03 | Comparação modelo tradicional × Tech Office, escopo |
| `#multiunidades` | link dentro de `#tech-office` | Árvore matriz → unidades |

IA foi para o diagnóstico porque *onde a IA tem retorno* é uma das perguntas
que o diagnóstico responde; integrações foram para o sprint porque são o
conteúdo típico de um ciclo de implantação.

**4. As logos de clientes são renderizadas em branco puro.**
`filter: brightness(0) invert(1)` zera o RGB e leva tudo ao branco, preservando
o canal alfa. Não é escolha estética: três das sete logos (Informa Solutions,
FORP e CS Energia Solar) têm luminância média em torno de 95/255 e ficam em
~3:1 contra o fundo escuro — sob a opacidade da faixa, sumiriam. Forçar branco
também dispensa pedir a versão monocromática clara a cada cliente novo. Por
isso o hover **não** revela a cor original: nessas três, revelar a cor seria
fazê-las desaparecer.

A altura de exibição é definida por logo, no `--logo-h` inline de cada `<li>`,
e não é a mesma para todas: normalizar pela altura faria a marca quadrada
(FORP, CS) parecer bem menor que o wordmark largo (Vittia), porque o olho
compara área, não altura.

**5. Duas versões do logo, por legibilidade.**
O header usa o lockup **compacto** (erlenmeyer + LABMÍDIA TECHOPS) a 36px; a
36px as linhas "Technology Operations" e "PROCESSES | AUTOMATION…" do lockup
completo viram borrão. O completo fica no rodapé, com 200px de largura.

> O lockup compacto foi **derivado** do arquivo original em `img/`, escalando a
> marca até a altura do bloco do wordmark. É a derivação conservadora padrão,
> mas se o designer da marca tiver uma versão horizontal oficial, substitua
> `assets/logo/labmidia-techops-compact.png` por ela.

---

## Rodar localmente

O JavaScript usa **ES Modules**, que exigem protocolo HTTP — abrir o
`index.html` com duplo clique (`file://`) faz o navegador bloquear os imports
por CORS e a página fica sem interatividade.

Use um servidor local. Com Python:

```bash
python -m http.server 8000
```

Depois abra <http://localhost:8000>.

Alternativas: extensão **Live Server** do VS Code, ou `npx serve` se tiver Node
instalado (só para desenvolvimento — o site em si não usa Node).

---

## ⚠️ Antes de publicar: preencher `js/config.js`

Este é o **único** arquivo que precisa ser editado para colocar os canais de
contato no ar. Nenhum outro módulo tem dado de contato embutido.

```javascript
export const CONFIG = {
  whatsapp: "5517900000000",              // só dígitos, com DDI e DDD
  whatsappMessage: "…",                   // mensagem pré-preenchida
  email: "contato@labmidia.tec.br",
  linkedin: "https://www.linkedin.com/company/…",
  form: {
    endpoint: "https://formspree.io/f/SEU_ID",
    accessKey: "",                        // só para Web3Forms
    redirectOnSuccess: "",
  },
  siteUrl: "https://labmidia.tec.br",     // documental — ver nota abaixo
};
```

> `siteUrl` **não é lida por nenhum módulo**. Canonical, Open Graph, JSON-LD e
> sitemap usam URL absoluta escrita à mão. Trocar de domínio exige editar, além
> dessa chave: o `<head>` do `index.html`, `sitemap.xml`, `robots.txt` e o
> arquivo `CNAME`.

### Comportamento com campos vazios

| Campo | Vazio | Preenchido |
|---|---|---|
| `whatsapp` | canal some da página | vira link `wa.me` com mensagem pronta |
| `email` | canal some da página | vira link `mailto:` |
| `linkedin` | canal some da página | vira link externo |
| `form.endpoint` | formulário usa `email` como fallback (abre o cliente de e-mail do visitante) | envia POST JSON de verdade |

Canal não configurado é **removido** da página — nunca aparece como link morto
ou texto "preencher aqui". Se **todos** os canais de uma lista somem, o bloco e
o seu título saem junto, para não sobrar cabeçalho órfão sobre lista vazia.
Se o site subir antes da configuração, o visitante vê uma página coerente com
menos canais, e o console mostra o que falta.

> **Nunca coloque segredo em `config.js`.** O arquivo é servido publicamente.
> IDs de Formspree e chaves de Web3Forms são públicos por design — isso é
> seguro. Qualquer credencial que precise ficar secreta exige backend próprio.

### Formulário: escolhendo o serviço

O GitHub Pages não tem backend. Opções, todas compatíveis com o código atual:

- **Formspree** — crie um form, cole a URL `https://formspree.io/f/SEU_ID` em `endpoint`.
- **Web3Forms** — `endpoint: "https://api.web3forms.com/submit"` e a chave em `accessKey`.
- **EmailJS** — exige o SDK deles; troque o bloco `fetch` em `js/modules/form.js`.
- **API própria** — qualquer endpoint que aceite `POST` com `Content-Type: application/json`.

O payload enviado é um JSON simples: `{nome, empresa, cargo, email, telefone,
funcionarios, unidades, desafio, contexto}` — campos vazios são omitidos.

---

## Publicar no GitHub Pages

O repositório `wcmestre.github.io` é um **user site**: serve na raiz do domínio,
não em subdiretório.

1. Confirme que está na `main` e que o `CNAME` continua no repositório:
   ```bash
   git status
   cat CNAME        # deve conter: labmidia.tec.br
   ```
2. Commit e push:
   ```bash
   git add .
   git commit -m "Descrição da mudança"
   git push origin main
   ```
3. No GitHub: **Settings → Pages**
   - *Source*: `Deploy from a branch`
   - *Branch*: `main` / `/ (root)`
4. Ainda em **Settings → Pages**, confira que *Custom domain* está como
   `labmidia.tec.br` e marque **Enforce HTTPS**.
5. No DNS do domínio, os registros devem apontar para o GitHub Pages:
   ```
   A     @    185.199.108.153
   A     @    185.199.109.153
   A     @    185.199.110.153
   A     @    185.199.111.153
   CNAME www  wcmestre.github.io.
   ```

O deploy leva de alguns segundos a poucos minutos após o push.

> Se algum dia o site for movido para um repositório de projeto
> (`usuario.github.io/repositorio/`), os caminhos relativos (`./css/…`) já
> funcionam. O que precisa mudar é o `canonical`, as URLs de Open Graph, o
> `sitemap.xml` e o `robots.txt`, que usam a URL absoluta.

---

## Onde alterar cada coisa

| O quê | Onde |
|---|---|
| WhatsApp, e-mail, LinkedIn, endpoint do formulário | `js/config.js` |
| Qualquer cor, espaçamento, raio, duração de animação | `css/base/tokens.css` |
| Textos, títulos, cards, opções do formulário | `index.html` |
| Conteúdo dos 4 diálogos | `index.html`, blocos `<dialog class="modal">` |
| Título, descrição, Open Graph, JSON-LD | `<head>` do `index.html` |
| Imagem de compartilhamento | `assets/images/og-cover.png` (1200×630) |
| Logo do header / do rodapé | `assets/logo/*.png` |
| Logos de clientes | `assets/logos-clientes/` + os `src`/`alt` na seção `#clientes` |
| Ícones | sprite `<svg>` no topo do `<body>` |
| Valores do Technology Efficiency Score | `index.html`, atributo `style="--value: NN"` |

### Sobre os números do diagnóstico

Os valores do **Technology Efficiency Score** e a lista **Impacto × Esforço**
(dentro do diálogo `#diagnostico`) são **simulados** e existem só para mostrar o
formato da entrega. Cada bloco carrega o selo `Exemplo ilustrativo` e o rodapé
do diálogo tem uma nota explícita. Se trocar os números, **mantenha os selos** —
a menos que passem a ser dados reais de um cliente com autorização de divulgação.

---

## Acessibilidade e performance

Implementado:

- HTML semântico, hierarquia de headings correta, um único `<h1>`
- Skip link, foco visível em tudo que é focável, navegação completa por teclado
- Menu mobile com `aria-expanded` real, fechamento por `Escape` com retorno de foco
- Diálogos `<dialog>` nativos: foco preso, `Escape`, retorno ao gatilho
- Todos os campos do formulário com `<label>`; erros anunciados via `aria-live`
  (as regiões nascem na árvore de acessibilidade, sem `display:none`)
- Botão de envio usa `aria-disabled`, não `disabled` — desabilitar o elemento
  focado jogaria o foco no `<body>` no meio do envio
- Diagramas com `role="img"` e `aria-label` descritivo
- `prefers-reduced-motion` respeitado em CSS **e** em JS
- Contraste: todos os pares de texto passam WCAG AA sobre o fundo escuro, e as
  bordas de controle (campo, botão outline) usam `--border-control`, que atinge
  os 3:1 exigidos pelo critério 1.4.11

Performance:

- Sem biblioteca externa, sem vídeo de fundo, sem imagem pesada acima da dobra
- O diagrama do hero é SVG + CSS, não imagem
- Animações apenas em `opacity`, `transform` e `stroke-dashoffset`
- `IntersectionObserver` em vez de listeners de scroll
- Módulos ES são deferidos por padrão — não bloqueiam a renderização

### Progressive enhancement

A página é totalmente legível sem JavaScript:

- Todo o conteúdo está no HTML, nada é montado por script
- Sem JS a classe `.no-js` mantém a navegação como lista estática visível e o
  header deixa de ser sticky (senão o menu aberto comeria a tela no celular)
- Sem JS os `<dialog>` voltam ao fluxo como seções normais, e os gatilhos —
  que são âncoras de verdade — funcionam como links comuns
- Sem JS os blocos com animação de entrada nascem visíveis e as barras do
  diagnóstico já vêm preenchidas
- Se os módulos falharem ao carregar, um temporizador no `<head>` **desfaz** a
  troca de classe e devolve o documento ao estado `.no-js` em 2,5s — o que
  reativa todos os fallbacks acima de uma vez

---

## Privacidade

Esta versão **não** instala Google Analytics, Meta Pixel, Hotjar ou qualquer
tracker, e não usa cookies. Nada é gravado em `localStorage` ou
`sessionStorage`. Por isso não há banner de consentimento — não há o que
consentir.

Se algum tracker for adicionado no futuro, será necessário implementar
consentimento adequado antes de carregá-lo.

---

## Pendências conhecidas

- [ ] Preencher `js/config.js` com WhatsApp, e-mail, LinkedIn e endpoint do formulário
- [ ] **Reexportar as logos de clientes em resolução maior.** Os arquivos
      atuais vieram num canvas de 144×144 px, então o desenho útil tem de 30 a
      91 px de altura — abaixo de 2× o tamanho de exibição, o que deixa a faixa
      levemente mole em tela retina. Peça o **desenho** (não o canvas) com pelo
      menos 300 px de altura, ou em SVG. A troca é drop-in.
- [ ] Marcar **Enforce HTTPS** em Settings → Pages
- [ ] Substituir `assets/logo/labmidia-techops-compact.png` pela versão
      horizontal oficial da marca, se o designer tiver uma
- [ ] Validar os textos com a área comercial
- [ ] Rodar Lighthouse depois do deploy e conferir as metas
      (Performance 90+, Accessibility / Best Practices / SEO 95+)
