import json, os
from datetime import datetime
from zoneinfo import ZoneInfo

def carregar_data(ARQUIVO):
    if os.path.exists(ARQUIVO):
        with open(ARQUIVO, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

def salvar_data(lista, ARQUIVO):
    with open(ARQUIVO, "w", encoding="utf-8") as f:
        json.dump(lista, f, ensure_ascii=False, indent=4)

def cadastrar_data(id_pergunta, id_pessoa, ia_utilizada, opiniao, acertou):
    dados = carregar_data(f"datas/id-{id_pessoa}.json")
    nova_data = {
        "id_pergunta": id_pergunta,
        "id_pessoa": id_pessoa,
        "ia_utilizada": ia_utilizada,
        "opiniao": opiniao,
        "acertou": acertou,
        "created_at": datetime.now(ZoneInfo("America/Sao_Paulo")).strftime("%d/%m/%Y %H:%M:%S")
    }
    dados.append(nova_data)
    salvar_data(dados, f"datas/id-{id_pessoa}.json")
