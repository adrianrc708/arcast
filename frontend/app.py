from flask import Flask, render_template, request, redirect, url_for, flash
import requests
import os

app = Flask(__name__)
# Necesario para usar 'flash' (mensajes de error)
app.secret_key = 'supersecreto'

# URLs del backend
BACKEND_API_URL = os.environ.get('BACKEND_API_URL', 'http://127.0.0.1:5000/api')


@app.route('/')
def index():
    """Ruta principal: mostrar lista de películas desde la API"""
    movies = []
    try:
        # 1. Llamar a la API de películas del backend (Node.js)
        response = requests.get(f"{BACKEND_API_URL}/movies")
        if response.status_code == 200:
            movies = response.json()
        else:
            flash("Error al cargar películas del backend.", "error")

    except requests.exceptions.ConnectionError:
        flash("Error: No se pudo conectar al backend (Node.js).", "error")

    return render_template('index.html', movies=movies)


@app.route('/movie/<movie_id>', methods=['GET'])
def movie_detail(movie_id):
    """Detalle de película y sus reseñas"""

    # 1. Obtener datos de la película
    try:
        movie_response = requests.get(f"{BACKEND_API_URL}/movies/{movie_id}")
        if movie_response.status_code != 200:
            return "Película no encontrada", 404
        movie = movie_response.json()
    except requests.exceptions.ConnectionError:
        return "Error conectando al backend", 500

    # 2. Obtener reseñas de esa película
    reviews = []
    try:
        reviews_response = requests.get(f"{BACKEND_API_URL}/reviews/{movie_id}")
        if reviews_response.status_code == 200:
            reviews = reviews_response.json()
    except requests.exceptions.ConnectionError:
        print("Error: No se pudo conectar al backend por las reseñas.")

    return render_template('movie.html', movie=movie, movie_id=movie_id, reviews=reviews)


@app.route('/movie/<movie_id>/add_review', methods=['POST'])
def add_review(movie_id):
    """Procesar formulario para crear reseña (via API)"""

    # Necesitamos el título de la película para la reseña
    movie_title = request.form.get('movieTitle')

    data = {
        "movieId": movie_id,
        "movieTitle": movie_title,  # Título obtenido del formulario (oculto)
        "username": request.form.get('username'),
        "rating": int(request.form.get('rating')),
        "text": request.form.get('text')
    }

    try:
        requests.post(f"{BACKEND_API_URL}/reviews", json=data)
    except requests.exceptions.ConnectionError:
        print("Error: No se pudo enviar la reseña al backend.")

    return redirect(url_for('movie_detail', movie_id=movie_id))


@app.route('/add_movie', methods=['POST'])
def add_movie():
    """Procesar formulario para crear una NUEVA película (via API)"""
    title = request.form.get('title')
    if title:
        try:
            requests.post(f"{BACKEND_API_URL}/movies", json={"title": title})
        except requests.exceptions.ConnectionError:
            flash("Error conectando al backend.", "error")

    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True, port=8000)