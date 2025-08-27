from flask import Blueprint, session, redirect, url_for, request, jsonify
import models.DataController as data

data_bp = Blueprint("data", __name__)

@data_bp.route("/data", methods=["POST"])
def salvar_data():
    payload = request.get_json(silent=True) or {}
    resposta_dada = payload.get("resposta_dada")
    opiniao = payload.get("opiniao")
    finalizar = payload.get("finalizar", False) 

    if isinstance(resposta_dada, str):
        resposta_dada = resposta_dada.strip()
    else:
        resposta_dada = "none"

    if resposta_dada != "none":
        # contador de perguntas respondida
        session["count"] = session.get("count", 0) + 1

        id_pessoa = session.get("user_id")
        id_pergunta = session.get("id_pergunta")
        ai_model = session.get("ai_model")
        ai_text = (session.get("ai_text") or "").strip()
        human_text = (session.get("human_text") or "").strip()

        def normalize(s: str) -> str:
            return " ".join((s or "").replace("\r", "").split())

        if normalize(resposta_dada) == normalize(ai_text):
            acertou = "n"  # escolheu IA
        elif normalize(resposta_dada) == normalize(human_text):
            acertou = "s"  # escolheu humano
        else:
            acertou = "n"  #se der erro

        ia_utilizada = ai_model

        data.cadastrar_data(id_pergunta, id_pessoa, ia_utilizada, opiniao, acertou)

    #decide para onde redirecinar
    if finalizar:
        return redirect(url_for("pages.resultado"))
    else:
        return redirect(url_for("carregar.carregar"))



@data_bp.route("/dados")
def dados():
    dados = data.carregar_data()
    id_usuario = session.get("user_id")
    
    return jsonify({
        "id_usuario": id_usuario,
        "dados": dados
    })
