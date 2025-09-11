from flask import Blueprint, request, redirect, url_for, session
from models.RegisterController import cadastrar_pessoa

cadastro_bp = Blueprint("cadastro", __name__)

@cadastro_bp.route("/cadastrar", methods=["POST"])
def cadastrar():
    nome = request.form["name"] + " " + request.form["lastname"] 
    idade = request.form["age"]
    genero = request.form["gender"]
    formacao = request.form["formation"]
    ocupacao = request.form["ocupation"]

    novo_id = cadastrar_pessoa(nome, idade, genero, formacao, ocupacao)
    session["user_id"] = novo_id
    session["count"] = 1   
    session["nome"] = request.form["name"]

    return redirect(url_for("pages.instrucoes"))
