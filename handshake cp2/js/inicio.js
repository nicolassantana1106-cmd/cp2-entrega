// Página inicial: pede o nome e guarda na sessão antes de começar.
const form = document.getElementById("form-nome");
const input = document.getElementById("nome");
const erro = document.getElementById("erro-nome");

try { input.value = sessionStorage.getItem("jogador") || ""; } catch (e) { /* sem storage */ }

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const nome = input.value.trim().replace(/\s+/g, " ");
  if (nome.length < 2) {
    erro.textContent = "Digite um nome com pelo menos 2 caracteres.";
    input.setAttribute("aria-invalid", "true");
    input.focus();
    return;
  }
  try { sessionStorage.setItem("jogador", nome); } catch (e) { /* sem storage */ }
  location.href = "handshake cp2/jogo.html";
});
input.addEventListener("input", () => { erro.textContent = ""; input.removeAttribute("aria-invalid"); });
