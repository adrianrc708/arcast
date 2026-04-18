# 🎬 FilmLog - Puesta en Marcha

Guía rápida para ejecutar el proyecto. Se requieren **Node.js** y **Python** instalados.

## 1. Backend (Terminal 1)

Entra a la carpeta, instala dependencias y configura el entorno:

```bash
cd backend
npm install
```
Crea un archivo .env (puedes copiar .env.example).

Define tus variables: MONGO_URI (Atlas), TMDB_API_KEY y JWT_SECRET.

Una vez configurado, ejecuta estos comandos en orden:

```bash
node seed.js    # 1. Carga las películas y series a la BD
node server.js  # 2. Inicia el servidor (Puerto 5000)
```

## 2. Frontend (Terminal 2)

Abre una nueva terminal, entra a la carpeta y prepara el entorno virtual:

```bash
cd frontend
python -m venv venv
.\venv\Scripts\activate   # En Windows
# source venv/bin/activate  # En Mac/Linux
```

Instala las librerías y ejecuta la aplicación:
```bash
pip install Flask requests
python app.py
```