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
├── index.html                  Página única — todas as seções
├── favicon.svg                 Ícone principal (navegadores modernos)
├── favicon.ico                 Fallback 16/32/48
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
│   │   └── form.css
│   ├── sections/               Composição específica de cada seção
│   │   ├── hero.css
│   │   ├── solutions.css
│   │   ├── efficiency.css
│   │   ├── cta.css
│   │   └── contact.css
│   └── utilities/
│       └── animations.css      Reveal, stagger, rede de segurança do boot
│
├── js/
│   ├── main.js                 Entrada — só orquestra
│   ├── config.js               ⚠️ ÚNICO arquivo a editar para ir ao ar
│   ├── modules/                Um concern por arquivo
│   │   ├── navigation.js       Menu mobile + acessibilidade
│   │   ├── header-scroll.js    Header compacto ao rolar
│   │   ├── scroll-spy.js       Link ativo na navegação
│   │   ├── smooth-scroll.js    Foco de teclado ao pular para âncora
│   │   ├── reveal.js           Animação de entrada
│   │   ├── score-meter.js      Animação das barras do diagnóstico
│   │   ├── contact-links.js    Aplica config.js aos canais de contato
│   │   └── form.js             Validação e envio
│   └── utils/
│       ├── dom.js              $, $$, on, observeOnce
│       └── motion.js           prefers-reduced-motion em JS
│
└── assets/
    ├── images/
    │   └── og-cover.png        1200×630 — Open Graph / Twitter Card
    ├── logo/
    │   └── apple-touch-icon.png
    └── icons/                  (vazio — os ícones são um sprite SVG inline)
```

### Duas decisões de arquitetura que valem explicação

**1. Os CSS são carregados em `<link>` paralelos, não com `@import`.**
`@import` encadeia requisições em série — o navegador só descobre o segundo
arquivo depois de baixar o primeiro — e o Lighthouse penaliza isso como
*critical request chain*. Sobre HTTP/2, que é o que o GitHub Pages serve, N
arquivos pequenos do mesmo domínio são multiplexados na mesma conexão e custam
praticamente o mesmo que um arquivo único. Assim dá para ter estrutura real sem
pagar em performance. **A ordem dos `<link>` no `index.html` é a cascata** —
não reordene sem verificar.

**2. Os ícones são um sprite SVG inline no topo do `<body>`.**
Zero requisições, herdam `currentColor` e não dependem de fonte de ícones.
Por isso `assets/icons/` está vazia: existe pela estrutura pedida no briefing,
mas nada precisa ir para lá.

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

Este é o **único** arquivo que precisa ser editado. Nenhum outro módulo tem
dado de contato embutido.

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
  siteUrl: "https://labmidia.tec.br",
};
```

### Comportamento com campos vazios

| Campo | Vazio | Preenchido |
|---|---|---|
| `whatsapp` | canal some da página | vira link `wa.me` com mensagem pronta |
| `email` | canal some da página | vira link `mailto:` |
| `linkedin` | canal some da página | vira link externo |
| `form.endpoint` | formulário usa `email` como fallback (abre o cliente de e-mail do visitante) | envia POST JSON de verdade |

Canal não configurado é **removido** da página — nunca aparece como link morto
ou texto "preencher aqui". Se o site subir antes da configuração, o visitante vê
uma página coerente com menos canais, e o console mostra o que falta.

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
   git commit -m "Nova landing page LabMídia TechOps"
   git push origin main
   ```
3. No GitHub: **Settings → Pages**
   - *Source*: `Deploy from a branch`
   - *Branch*: `main` / `/ (root)`
4. Ainda em **Settings → Pages**, confira que *Custom domain* está como
   `labmidia.tec.br` e marque **Enforce HTTPS** assim que o certificado for
   emitido (leva alguns minutos na primeira vez).
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
| Título, descrição, Open Graph, JSON-LD | `<head>` do `index.html` |
| Imagem de compartilhamento | `assets/images/og-cover.png` (1200×630) |
| Ícones | sprite `<svg>` no topo do `<body>` |
| Valores do Technology Efficiency Score | `index.html`, atributo `style="--value: NN"` |

### Sobre os números do diagnóstico

Os valores da seção **Technology Efficiency Score** e a lista **Impacto ×
Esforço** são **simulados** e existem só para mostrar o formato da entrega.
Cada bloco carrega o selo `Exemplo ilustrativo` e a seção tem uma nota
explícita ao final. Se trocar os números, **mantenha os selos** — a menos que
passem a ser dados reais de um cliente com autorização de divulgação.

---

## Acessibilidade e performance

Implementado:

- HTML semântico, hierarquia de headings correta, um único `<h1>`
- Skip link, foco visível em tudo que é focável, navegação completa por teclado
- Menu mobile com `aria-expanded` real, fechamento por `Escape` com retorno de foco
- Todos os campos do formulário com `<label>`; erros anunciados via `aria-live`
- Diagramas com `role="img"` e `aria-label` descritivo
- `prefers-reduced-motion` respeitado em CSS **e** em JS
- Contraste: todos os pares de texto passam WCAG AA sobre o fundo escuro
  (o CTA primário é ciano com texto escuro justamente porque azul com texto
  branco ficaria em 4.4:1 e reprovaria)

Performance:

- Sem biblioteca externa, sem vídeo de fundo, sem imagem pesada acima da dobra
- O diagrama do hero é SVG + CSS, não imagem
- Animações apenas em `opacity`, `translate` e `stroke-dashoffset`
- `IntersectionObserver` em vez de listeners de scroll
- Módulos ES são deferidos por padrão — não bloqueiam a renderização

### Progressive enhancement

A página é totalmente legível sem JavaScript:

- Todo o conteúdo está no HTML, nada é montado por script
- Sem JS a classe `.no-js` mantém a navegação como lista estática visível
- Sem JS os blocos com animação de entrada nascem visíveis
- Se os módulos falharem ao carregar, um temporizador no `<head>` devolve a
  visibilidade de tudo em 2,5s (`.js-boot-failed`)

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
- [ ] Substituir a marca provisória (`.brand__mark` no `index.html` e `favicon.svg`)
      pela identidade definitiva da LabMídia TechOps, se houver
- [ ] Validar os textos com a área comercial
- [ ] Rodar Lighthouse depois do primeiro deploy e conferir as metas
      (Performance 90+, Accessibility / Best Practices / SEO 95+)
