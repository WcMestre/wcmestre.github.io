#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Validação estrutural da landing page. Sem dependências — só a stdlib.

    python tools/validate.py

Verifica, no index.html e nos CSS:

  1. tags abertas e nunca fechadas
  2. ids duplicados
  3. aria-controls / aria-labelledby / aria-describedby apontando para id real
  4. âncoras href="#x" com destino existente
  5. label[for] com campo correspondente
  6. <use href="#i-x"> com <symbol> correspondente
  7. <img> sem alt
  8. hierarquia de headings (um único h1, sem salto de nível)
  9. gatilhos data-modal-open com <dialog> correspondente
 10. var(--token) usado mas nunca definido
 11. chaves desbalanceadas nos CSS
 12. cobertura dos dicionarios de i18n/ contra o texto do index.html

Não substitui um validador de HTML completo nem o Lighthouse: pega a classe de
erro que quebra acessibilidade e que passa despercebida numa revisão visual.
"""
import glob
import json
import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML = os.path.join(ROOT, "index.html")

# Elementos sem tag de fechamento, incluindo os de SVG usados no sprite.
VOID = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
    "path", "circle", "rect", "ellipse", "line", "polygon", "polyline",
    "use", "stop",
}

# Custom properties definidas inline no HTML ou por JavaScript, não no CSS.
RUNTIME_TOKENS = {
    "--value",  # score-meter, inline no HTML
    "--delay",  # animations / orbit, inline e por JS
    "--x",      # orbit, inline no HTML
    "--y",      # orbit, inline no HTML
    "--marquee-duration",  # logo-marquee.js, calculado pelo nº de logos
}

problems = []


class Collector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.ids = []
        self.refs = []
        self.labels = []
        self.uses = []
        self.imgs = []
        self.headings = []
        self.modal_triggers = []
        self._heading = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        line = self.getpos()[0]

        if tag not in VOID:
            self.stack.append((tag, line))

        if "id" in a:
            self.ids.append((a["id"], line))

        for key in ("aria-controls", "aria-labelledby", "aria-describedby"):
            if key in a:
                for token in a[key].split():
                    self.refs.append((key, token, line))

        if tag == "label" and "for" in a:
            self.labels.append((a["for"], line))

        if tag == "a" and a.get("href", "").startswith("#") and a["href"] != "#":
            self.refs.append(("href", a["href"][1:], line))
            if "data-modal-open" in a:
                self.modal_triggers.append((a["href"][1:], line))

        if tag == "use" and "href" in a:
            self.uses.append((a["href"].lstrip("#"), line))

        if tag == "img":
            self.imgs.append((a.get("src", "?"), "alt" in a, line))

        if re.fullmatch(r"h[1-6]", tag):
            self._heading = (int(tag[1]), line, [])

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        line = self.getpos()[0]

        if not self.stack:
            problems.append(f"L{line}: </{tag}> sem abertura correspondente")
            return

        if self.stack[-1][0] == tag:
            self.stack.pop()
        else:
            for i in range(len(self.stack) - 1, -1, -1):
                if self.stack[i][0] == tag:
                    unclosed = [t for t, _ in self.stack[i + 1 :]]
                    problems.append(
                        f"L{line}: </{tag}> fecha, mas ficaram abertos: {unclosed}"
                    )
                    del self.stack[i:]
                    break
            else:
                problems.append(f"L{line}: </{tag}> sem abertura correspondente")

        if re.fullmatch(r"h[1-6]", tag) and self._heading:
            level, hline, parts = self._heading
            self.headings.append((level, "".join(parts).strip()[:60], hline))
            self._heading = None

    def handle_data(self, data):
        if self._heading:
            self._heading[2].append(data)


# --------------------------------------------------------------------------
# i18n
# --------------------------------------------------------------------------

# Elementos cujo conteudo nunca e texto de interface.
I18N_IGNORAR = {
    "script", "style", "svg", "symbol", "path", "circle", "rect",
    "ellipse", "line", "polygon", "polyline", "use",
}
I18N_ATTRS = ("alt", "aria-label", "placeholder")
I18N_METAS = {
    ("name", "description"),
    ("property", "og:title"),
    ("property", "og:description"),
    ("property", "og:image:alt"),
    ("name", "twitter:title"),
    ("name", "twitter:description"),
}


def norm(t):
    """Colapsa espacos e apara as pontas.

    DEVE ser identica a `norm` de js/modules/i18n.js. Se as duas divergirem,
    a chave nao casa em runtime e o texto fica em portugues sem erro visivel.
    """
    return re.sub(r"\s+", " ", t).strip()


class I18nExtractor(HTMLParser):
    """Reproduz o que o runtime considera traduzivel."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip = 0
        self.in_title = False
        self.strings = []

    def _add(self, texto):
        t = norm(texto)
        if not t or t in self.strings:
            return
        if re.fullmatch(r"[\d\W]+", t):  # "01", "—", "×" etc
            return
        self.strings.append(t)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in I18N_IGNORAR:
            self.skip += 1
        if tag == "title":
            self.in_title = True
        for key in I18N_ATTRS:
            if key in a and not a[key].startswith("#"):
                self._add(a[key])
        if tag == "meta":
            for attr, valor in I18N_METAS:
                if a.get(attr) == valor:
                    self._add(a.get("content", ""))

    def handle_endtag(self, tag):
        if tag in I18N_IGNORAR:
            self.skip = max(0, self.skip - 1)
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.skip and not self.in_title:
            return
        self._add(data)


def checar_i18n(source):
    """Compara o texto do index.html com cada dicionario em i18n/."""
    dicts = sorted(glob.glob(os.path.join(ROOT, "i18n", "*.json")))
    dicts = [p for p in dicts if not os.path.basename(p).startswith("_")]
    if not dicts:
        return 0

    ex = I18nExtractor()
    ex.feed(source)
    fonte = ex.strings

    for path in dicts:
        idioma = os.path.splitext(os.path.basename(path))[0]
        with open(path, encoding="utf-8") as fh:
            try:
                d = json.load(fh)
            except json.JSONDecodeError as erro:
                problems.append(f"i18n/{idioma}.json: JSON invalido — {erro}")
                continue

        for s in fonte:
            if s not in d:
                problems.append(
                    f"i18n/{idioma}.json: sem traducao para {s[:70]!r}"
                )
            elif not str(d[s]).strip():
                problems.append(f"i18n/{idioma}.json: traducao vazia para {s[:70]!r}")

        for k in d:
            if k not in fonte:
                problems.append(
                    f"i18n/{idioma}.json: chave orfa (nao existe no HTML) {k[:70]!r}"
                )

    return len(fonte)


def main():
    with open(HTML, encoding="utf-8") as fh:
        source = fh.read()

    parser = Collector()
    parser.feed(source)

    # 1. tags não fechadas
    for tag, line in parser.stack:
        problems.append(f"L{line}: <{tag}> nunca foi fechada")

    # 2. ids duplicados
    seen = {}
    for value, line in parser.ids:
        if value in seen:
            problems.append(f"L{line}: id duplicado '{value}' (já em L{seen[value]})")
        seen[value] = line
    id_set = set(seen)

    # 3 e 4. referências ARIA e âncoras
    for attr, value, line in parser.refs:
        if value not in id_set:
            problems.append(f"L{line}: {attr}='{value}' aponta para id inexistente")

    # 5. label[for]
    for value, line in parser.labels:
        if value not in id_set:
            problems.append(f"L{line}: <label for='{value}'> sem campo correspondente")

    # 6. <use href>
    symbols = set(re.findall(r'<symbol[^>]*\bid="([^"]+)"', source))
    for value, line in parser.uses:
        if value not in symbols:
            problems.append(f"L{line}: <use href='#{value}'> sem <symbol>")

    # 7. img sem alt
    for src, has_alt, line in parser.imgs:
        if not has_alt:
            problems.append(f"L{line}: <img src='{src}'> sem atributo alt")

    # 8. hierarquia de headings
    h1s = [h for h in parser.headings if h[0] == 1]
    if len(h1s) != 1:
        problems.append(f"Esperado exatamente 1 <h1>, encontrados {len(h1s)}")
    prev = 0
    for level, text, line in parser.headings:
        if prev and level > prev + 1:
            problems.append(f"L{line}: salto de h{prev} para h{level} — '{text}'")
        prev = level

    # 9. gatilhos de modal
    dialogs = set(re.findall(r'<dialog[^>]*\bid="([^"]+)"', source))
    for value, line in parser.modal_triggers:
        if value not in dialogs:
            problems.append(f"L{line}: data-modal-open '#{value}' sem <dialog>")

    # 10 e 11. CSS
    css_files = sorted(
        glob.glob(os.path.join(ROOT, "css", "**", "*.css"), recursive=True)
    )
    defined = set()
    for path in css_files:
        with open(path, encoding="utf-8") as fh:
            defined |= set(re.findall(r"(--[a-z0-9-]+)\s*:", fh.read()))
    defined |= set(re.findall(r'style="[^"]*?(--[a-z0-9-]+)\s*:', source))

    for path in css_files:
        rel = os.path.relpath(path, ROOT)
        with open(path, encoding="utf-8") as fh:
            raw = fh.read()
        for i, line in enumerate(raw.splitlines(), 1):
            for name in re.findall(r"var\(\s*(--[a-z0-9-]+)", line):
                if name not in defined and name not in RUNTIME_TOKENS:
                    problems.append(f"{rel}:{i}: var({name}) nunca definido")
        body = re.sub(r"/\*.*?\*/", "", raw, flags=re.S)
        if body.count("{") != body.count("}"):
            problems.append(
                f"{rel}: chaves desbalanceadas "
                f"({body.count('{')} abrem, {body.count('}')} fecham)"
            )

    n_i18n = checar_i18n(source)

    print(
        f"  {len(parser.ids)} ids · {len(parser.headings)} headings · "
        f"{len(dialogs)} dialogs · {len(css_files)} arquivos CSS · "
        f"{len(defined)} tokens · {n_i18n} strings i18n"
    )
    print()

    if problems:
        print(f"{len(problems)} PROBLEMA(S):")
        for p in problems:
            print("  x " + p)
        return 1

    print("Nenhum problema encontrado.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
