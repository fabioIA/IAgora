Plain Text
# Use uma imagem base Python
FROM python:3.9-slim-buster
# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app
# Copie o arquivo de dependências e instale-as
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Copie o restante do código da aplicação
COPY .
# Exponha a porta que sua aplicação irá escutar
ENV PORT 8080
EXPOSE 8080
# Comando para iniciar a aplicação usando Gunicorn (ou outro servidor WSGI)
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app