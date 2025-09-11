import json, os
from datetime import datetime
from zoneinfo import ZoneInfo

ARQUIVO = "pessoas.json"

def carregar_pessoas():
    if os.path.exists(ARQUIVO):
        with open(ARQUIVO, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

def salvar_pessoas(pessoas):
    with open(ARQUIVO, "w", encoding="utf-8") as f:
        json.dump(pessoas, f, ensure_ascii=False, indent=4)

def cadastrar_pessoa(nome, idade, genero, formacao, ocupacao):
    pessoas = carregar_pessoas()
    
    novo_id = 1 if not pessoas else max(p["id"] for p in pessoas) + 1
    nova_pessoa = {
        "id": novo_id,
        "name": nome,
        "age": idade,
        "gender": genero,
        "formation": formacao,
        "ocupation": ocupacao,
        "created_at": datetime.now(ZoneInfo("America/Sao_Paulo")).strftime("%d/%m/%Y %H:%M:%S")
    }
    pessoas.append(nova_pessoa)
    salvar_pessoas(pessoas)
    return novo_id  
