// Handshake — lógica do quiz (perguntas vêm do perguntas.json)
const LETRAS = ["A", "B", "C", "D", "E", "F"];
const $ = (id) => document.getElementById(id);
const el = {
  progressoTexto: $("progresso-texto"), barra: document.querySelector(".progresso-barra i"),
  pergunta: $("pergunta"), alternativas: $("alternativas"), feedback: $("feedback"),
  proxima: $("proxima"), quiz: $("quiz"), resultado: $("resultado"), tituloFim: $("titulo-fim"),
  placar: $("placar"), ranking: $("ranking"), reiniciar: $("reiniciar"),
};
let fila = [], atual = 0, acertos = 0, respondeu = false, jogador = "";

function lerRanking() {
  try { const r = JSON.parse(sessionStorage.getItem("ranking")); return Array.isArray(r) ? r : []; }
  catch (e) { return []; }
}
function salvarRanking(r) {
  try { sessionStorage.setItem("ranking", JSON.stringify(r)); } catch (e) { /* sem storage */ }
}
function embaralhar(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}
function valida(q) {
  return q && typeof q.pergunta === "string" && Array.isArray(q.alternativas) && q.alternativas.length >= 2 &&
    Number.isInteger(q.resposta) && q.resposta >= 0 && q.resposta < q.alternativas.length &&
    typeof q.explicacao === "string" && typeof q.fonte === "string";
}
function limpar(no) { while (no.firstChild) no.removeChild(no.firstChild); }

function mostrarFeedback(classe, titulo, texto, fonte) {
  limpar(el.feedback);
  el.feedback.className = "feedback" + (classe ? " " + classe : "");
  if (titulo) { const t = document.createElement("strong"); t.textContent = titulo; el.feedback.appendChild(t); }
  const p = document.createElement("p");
  p.textContent = texto;
  if (fonte) {
    p.appendChild(document.createTextNode(" "));
    const a = document.createElement("a");
    a.href = fonte; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.textContent = "Ver fonte (abre em nova aba)";
    p.appendChild(a);
  }
  el.feedback.appendChild(p);
}

function mostrarPergunta() {
  const q = fila[atual];
  respondeu = false;
  el.progressoTexto.textContent = `Pergunta ${atual + 1} de ${fila.length} · ${jogador}`;
  el.barra.style.width = `${((atual + 1) / fila.length) * 100}%`;
  el.pergunta.textContent = q.pergunta;
  limpar(el.alternativas);
  q.alternativas.forEach((texto, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "alternativa";
    const letra = document.createElement("span"); letra.className = "letra"; letra.textContent = LETRAS[i];
    const t = document.createElement("span"); t.className = "texto"; t.textContent = texto;
    const m = document.createElement("span"); m.className = "estado";
    btn.append(letra, t, m);
    btn.addEventListener("click", () => responder(i));
    li.appendChild(btn); el.alternativas.appendChild(li);
  });
  mostrarFeedback("", "", "Escolha uma alternativa com o mouse ou com Tab e Enter.");
  el.proxima.disabled = true;
  el.proxima.textContent = atual === fila.length - 1 ? "Ver resultado" : "Próxima";
  el.pergunta.focus();
}

function responder(indice) {
  if (respondeu) return;
  respondeu = true;
  const q = fila[atual];
  const botoes = el.alternativas.querySelectorAll(".alternativa");
  botoes.forEach((b) => (b.disabled = true));
  botoes[q.resposta].classList.add("correta");
  botoes[q.resposta].querySelector(".estado").textContent = "✓ Correta";
  if (indice === q.resposta) {
    acertos++;
    mostrarFeedback("acerto", "Resposta correta ✓", q.explicacao, q.fonte);
  } else {
    botoes[indice].classList.add("errada");
    botoes[indice].querySelector(".estado").textContent = "✗ Sua resposta";
    mostrarFeedback("erro", `Incorreta ✗ — a certa era ${LETRAS[q.resposta]}`, q.explicacao, q.fonte);
  }
  el.proxima.disabled = false;
  el.proxima.focus();
}

function avancar() {
  if (!respondeu) return;
  if (atual < fila.length - 1) { atual++; mostrarPergunta(); } else { mostrarResultado(); }
}

function mostrarResultado() {
  const ranking = lerRanking();
  const entrada = { id: Date.now() + Math.random(), nome: jogador, pontos: acertos, total: fila.length };
  ranking.push(entrada);
  salvarRanking(ranking);
  const ordenado = ranking.slice().sort((a, b) => b.pontos - a.pontos || a.id - b.id);
  el.quiz.hidden = true; el.resultado.hidden = false;
  el.placar.textContent = `Pontuação: ${acertos}/${fila.length}`;
  limpar(el.ranking);
  const linha = (e, pos) => {
    const li = document.createElement("li");
    if (pos <= 3) li.classList.add("pos" + pos);
    if (e.id === entrada.id) li.classList.add("atual");
    li.textContent = `${pos}º — ${e.nome} — ${e.pontos}/${e.total}` + (e.id === entrada.id ? " ← esta partida" : "");
    el.ranking.appendChild(li);
  };
  ordenado.slice(0, 5).forEach((e, i) => linha(e, i + 1));
  const pos = ordenado.findIndex((e) => e.id === entrada.id) + 1;
  if (pos > 5) linha(entrada, pos);
  el.tituloFim.focus();
}

function reiniciar() {
  fila = embaralhar(fila); atual = 0; acertos = 0;
  el.resultado.hidden = true; el.quiz.hidden = false;
  mostrarPergunta();
}

// Reserva: só é carregada se o fetch falhar (abrir com duplo clique, file://).
function carregarReserva() {
  return new Promise((ok, falha) => {
    const s = document.createElement("script");
    s.src = "js/perguntas-reserva.js";
    s.onload = () => (Array.isArray(window.PERGUNTAS_RESERVA) ? ok(window.PERGUNTAS_RESERVA) : falha(new Error("reserva inválida")));
    s.onerror = () => falha(new Error("reserva ausente"));
    document.head.appendChild(s);
  });
}

async function carregarPerguntas() {
  try {
    const resp = await fetch("perguntas.json");
    if (!resp.ok) throw new Error(resp.status);
    return await resp.json();
  } catch (e) {
    console.info("fetch do perguntas.json indisponível; usando a reserva.");
    return carregarReserva();
  }
}

async function iniciar() {
  let nome = null;
  try { nome = sessionStorage.getItem("jogador"); } catch (e) { /* sem storage */ }
  if (!nome) { location.replace("../index.html"); return; }
  jogador = nome;
  try {
    fila = embaralhar((await carregarPerguntas()).filter(valida));
    if (!fila.length) throw new Error("vazio");
    mostrarPergunta();
  } catch (e) {
    el.progressoTexto.textContent = "Erro";
    el.pergunta.textContent = "Não foi possível carregar as perguntas.";
    mostrarFeedback("erro", "Erro ao carregar", "Confira se os arquivos perguntas.json e js/perguntas-reserva.js estão no site e atualize a página (Ctrl+F5).");
  }
}

el.proxima.addEventListener("click", avancar);
el.reiniciar.addEventListener("click", reiniciar);
iniciar();
