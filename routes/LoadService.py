import random
from flask import Blueprint, session, redirect, url_for
import models.LoadController as p

carregar_bp = Blueprint("carregar", __name__)

@carregar_bp.route("/carregar")
def carregar():
    perguntas = p.carregar_perguntas()

    if not p.carregar_shuffle_perguntas():
        shuffle_perguntas()
    shufflePerguntas = p.carregar_shuffle_perguntas()

    if not p.carregar_shuffle_ias():
        shuffle_ias(perguntas)
    shuffleIas = p.carregar_shuffle_ias()

    if not p.carregar_shuffle_humanos():
        shuffle_humanos(perguntas)
    shuffleHumanos = p.carregar_shuffle_humanos()

    # próximo id
    id = shufflePerguntas[0]["id-pergunta"]
    p.remover_obj("pergunta", id)

    # texto da pergunta
    data_pergunta = next(e["question"] for e in perguntas if e["id"] == id)

    # pegar 1 resposta de IA + guardar modelo
    ia_element = next(e for e in shuffleIas if e["id-pergunta"] == id)
    escolhas_ia = [
        ("chatgpt", ia_element["chatgpt"]),
        ("gemini", ia_element["gemini"]),
        ("deepseek", ia_element["deepseek"]),
    ]
    ia_model, ia_text = random.choice(escolhas_ia)
    p.remover_obj("ia", id)

    # pegar 1 resposta de humano
    humano_element = next(e for e in shuffleHumanos if e["id-pergunta"] == id)
    human_text = random.choice([humano_element["human-1"], humano_element["human-2"], humano_element["human-3"]])
    p.remover_obj("humano", id)

    # embaralhar visual 
    data_ia, data_humano = ia_text, human_text
    if random.randint(1, 2) == 1:
        data_ia, data_humano = human_text, ia_text

    session["pergunta"] = data_pergunta
    session["ia"] = data_ia
    session["humano"] = data_humano
    session["id_pergunta"] = id
    session["ai_model"] = ia_model
    session["ai_text"] = ia_text
    session["human_text"] = human_text

    if "count" not in session:
        session["count"] = 1

    return redirect(url_for("pages.questionario"))

def shuffle_perguntas():
    lista = []
    for i in range(1, 51):
        lista.append({"id-pergunta": i})
    random.shuffle(lista)
    p.gravar_perguntas(lista)

def shuffle_ias(data):
    lista = []
    for i in data:
        lista.append(
        {
            "id-pergunta": i["id"], 
            "chatgpt": i["chatgpt"], 
            "gemini": i["gemini"], 
            "deepseek": i["deepseek"]
        })
    random.shuffle(lista)
    p.gravar_ias(lista)

def shuffle_humanos(data):
    lista = []
    for i in data:
        lista.append(
        {
            "id-pergunta": i["id"], 
            "human-1": i["human-1"], 
            "human-2": i["human-2"], 
            "human-3": i["human-3"]
        })
    random.shuffle(lista)
    p.gravar_humanos(lista)
