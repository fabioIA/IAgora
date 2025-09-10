from flask import Blueprint, render_template, session, redirect, url_for
from models.RegisterController import carregar_pessoas

pages_bp = Blueprint("pages", __name__)

@pages_bp.route("/")
def index():
    pessoas = carregar_pessoas()
    return render_template("index.html", pessoas=pessoas)

@pages_bp.route("/instrucoes")
def instrucoes():
    if "user_id" not in session:
        return redirect(url_for("pages.index"))
    return render_template("instructions.html")


@pages_bp.route("/sobre")
def sobre():
    if "user_id" not in session:
        return redirect(url_for("pages.index"))
    return render_template("about.html")

@pages_bp.route("/questionario")
def questionario():
    if "user_id" not in session:
        return redirect(url_for("pages.index"))
    
    pergunta = session.get("pergunta")
    ia = session.get("ia")
    humano = session.get("humano")
    count = session.get("count") 

    return render_template(
        "questions.html",
        pergunta = pergunta,
        ia = ia,
        humano = humano,
        count = count
    )

@pages_bp.route("/resultado")
def resultado():
    if "user_id" not in session:
        return redirect(url_for("pages.index"))
    
    nome = session.get("nome") 

    return render_template(
        "result.html",
        nome = nome
    )
