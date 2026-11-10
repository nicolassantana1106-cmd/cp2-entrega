# Handshake

Quiz de tecnologia sobre **redes e internet** (HTTP, HTTPS, DNS, IP, URL, métodos e códigos de status).

**Site publicado:** _cole aqui o link HTTPS (GitHub Pages)_

## Integrantes

| Nome | RM |
|------|----|
| _Nome 1_ | _RM_ |
| _Nome 2_ | _RM_ |
| _Nome 3_ | _RM_ |

## Como jogar

1. Na página inicial, digite seu nome e clique em **Jogar**.
2. Responda uma pergunta por vez (mouse, ou **Tab** e **Enter** no teclado).
3. Após cada resposta aparece se acertou, a explicação e o link da fonte.
4. No fim você vê a pontuação, o ranking da sessão e o botão **Jogar novamente**.

## Como rodar localmente

O jogo carrega o `perguntas.json` com `fetch`. Funciona de qualquer jeito:

- no GitHub Pages, no **Live Server** do VS Code ou com `python -m http.server` (carrega direto do JSON);
- com duplo clique no `index.html` da raiz do repositório: o navegador bloqueia o `fetch`, então o jogo usa `handshake cp2/js/perguntas-reserva.js`, uma cópia gerada do JSON.

**Ao editar `handshake cp2/perguntas.json`, rode `python gerar-reserva.py` dentro da pasta `handshake cp2`** para atualizar a reserva.

## Estrutura

| Arquivo | Função |
|---------|--------|
| `../index.html` / `js/inicio.js` | Página inicial na raiz e campo de nome |
| `jogo.html` / `js/jogo.js` | Perguntas, feedback, pontuação, ranking e replay |
| `css/style.css` | Identidade visual (paleta escura, Space Grotesk + Inter) |
| `perguntas.json` | Banco de 10 perguntas (fonte dos dados) |
| `js/perguntas-reserva.js` | Cópia gerada do JSON, usada só se o `fetch` falhar |
| `gerar-reserva.py` | Atualiza a reserva a partir do JSON |

## Ranking

Salvo em `sessionStorage` (chave `ranking`): persiste entre partidas na mesma aba e some ao fechá-la. Para conferir: DevTools (F12) → Application → Session Storage.

## Acessibilidade

- Tudo funciona só com teclado, com foco visível.
- Acerto e erro nunca dependem só de cor: há texto ("Resposta correta ✓", "Incorreta ✗ — a certa era B"), ícone e borda diferente.
- Contraste de texto acima de 4,5:1 e sem rolagem horizontal em celular.

## Formato do `perguntas.json`

```json
{
  "pergunta": "Texto da pergunta",
  "alternativas": ["A", "B", "C", "D"],
  "resposta": 0,
  "explicacao": "Por que essa é a resposta correta.",
  "fonte": "https://link-da-fonte"
}
```

`resposta` é o índice (começando em 0) da alternativa correta.

## Publicação e entrega

1. No GitHub: **Settings → Pages → Deploy from a branch → `main` / root**. O HTTPS já vem ativo.
2. Marque a entrega em **Releases → Create a new release**, criando a tag `cp2-entrega` (ou pelo terminal: `git tag cp2-entrega && git push origin cp2-entrega`).
