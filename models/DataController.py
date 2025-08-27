import json, os

ARQUIVO = "data.json"

def carregar_data():
    if os.path.exists(ARQUIVO):
        with open(ARQUIVO, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

def salvar_data(lista):
    with open(ARQUIVO, "w", encoding="utf-8") as f:
        json.dump(lista, f, ensure_ascii=False, indent=4)

def cadastrar_data(id_pergunta, id_pessoa, ia_utilizada, opiniao, acertou):
    dados = carregar_data()
    nova_data = {
        "id_pergunta": id_pergunta,
        "id_pessoa": id_pessoa,
        "ia_utilizada": ia_utilizada,
        "opiniao": opiniao,
        "acertou": acertou,
    }
    dados.append(nova_data)
    salvar_data(dados)
