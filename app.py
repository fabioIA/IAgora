from flask import Flask
from routes.RegisterService import cadastro_bp
from routes.pages import pages_bp
from routes.LoadService import carregar_bp
from routes.DataService import data_bp

app = Flask(__name__)
app.secret_key = "23102025" 

# Registrar Blueprints
app.register_blueprint(cadastro_bp)
app.register_blueprint(pages_bp)
app.register_blueprint(carregar_bp)
app.register_blueprint(data_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

