# Gera js/perguntas-embutidas.js a partir do perguntas.json.
# Rode sempre que editar o perguntas.json:  python gerar-embutido.py
import json
with open("perguntas.json", encoding="utf-8") as f:
    dados = json.load(f)
with open("js/perguntas-embutidas.js", "w", encoding="utf-8") as f:
    f.write("// Gerado por gerar-embutido.py — não edite à mão.\n")
    f.write("// Reserva para quando o site é aberto sem servidor (file://).\n")
    f.write("window.PERGUNTAS_EMBUTIDAS = " + json.dumps(dados, ensure_ascii=False, indent=2) + ";\n")
print(len(dados), "perguntas embutidas")
