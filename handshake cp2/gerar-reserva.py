# Gera js/perguntas-reserva.js a partir do perguntas.json.
# Rode sempre que editar o perguntas.json:  python gerar-reserva.py
import json
with open("perguntas.json", encoding="utf-8") as f:
    dados = json.load(f)
with open("js/perguntas-reserva.js", "w", encoding="utf-8") as f:
    f.write("// Gerado por gerar-reserva.py a partir do perguntas.json — não edite à mão.\n")
    f.write("// Só é carregado se o fetch do perguntas.json falhar (ex.: abrir com duplo clique, file://).\n")
    f.write("window.PERGUNTAS_RESERVA = " + json.dumps(dados, ensure_ascii=False, indent=2) + ";\n")
print(len(dados), "perguntas na reserva")
