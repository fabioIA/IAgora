import json, os

ARQUIVO = "perguntas.json"
SHUFFLE_IAS = "shuffleIas.json"
SHUFFLE_HUMANOS = "shuffleHumanos.json"
SHUFFLE_PERGUNTAS = "shufflePerguntas.json"

def carregar_perguntas():
    if os.path.exists(ARQUIVO):
        with open(ARQUIVO, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

def carregar_shuffle_ias():
    if os.path.exists(SHUFFLE_IAS):
        with open(SHUFFLE_IAS, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

def carregar_shuffle_perguntas():
    if os.path.exists(SHUFFLE_PERGUNTAS):
        with open(SHUFFLE_PERGUNTAS, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

def carregar_shuffle_humanos():
    if os.path.exists(SHUFFLE_HUMANOS):
        with open(SHUFFLE_HUMANOS, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

def gravar_humanos(list):
    with open(SHUFFLE_HUMANOS, "w", encoding="utf-8") as f:
        json.dump(list, f, ensure_ascii=False, indent=4)

def gravar_ias(list):
    with open(SHUFFLE_IAS, "w", encoding="utf-8") as f:
        json.dump(list, f, ensure_ascii=False, indent=4)

def gravar_perguntas(list):
    with open(SHUFFLE_PERGUNTAS, "w", encoding="utf-8") as f:
        json.dump(list, f, ensure_ascii=False, indent=4)

def remover_obj(key, valor):
    if(key == "humano"):
        arquivo_ = SHUFFLE_HUMANOS

    elif(key == "ia"):
        arquivo_ = SHUFFLE_IAS

    else:
        arquivo_ = SHUFFLE_PERGUNTAS

    if not os.path.exists(arquivo_):
        return False  

    with open(arquivo_, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            data = []

    # Remove todos os objetos que tenham o valor
    nova_lista = [obj for obj in data if obj.get("id-pergunta") != valor]

    with open(arquivo_, "w", encoding="utf-8") as f:
        json.dump(nova_lista, f, ensure_ascii=False, indent=4)

    return True