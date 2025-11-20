const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const Movie = require('./models/movie.model');
const TVShow = require('./models/tvshow.model');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMG_URL = 'https://image.tmdb.org/t/p/w500';

const PLATFORMS = ['Netflix', 'Disney+', 'HBO Max', 'Amazon Prime', 'Apple TV'];
// Géneros: Acción, Comedia, Terror, Drama, Ciencia Ficción, Animación
const GENRES_TO_FETCH = [28, 35, 27, 18, 878, 16];

const getRandomPlatform = () => PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];

// --- BÚSQUEDA INTELIGENTE DE VIDEO ---
const findTrailer = (videos) => {
    if (!videos || !videos.results || videos.results.length === 0) return null;
    // 1. Trailer en YouTube
    let video = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    // 2. Teaser en YouTube
    if (!video) video = videos.results.find(v => v.type === 'Teaser' && v.site === 'YouTube');
    // 3. Cualquier video en YouTube
    if (!video) video = videos.results.find(v => v.site === 'YouTube');
    return video ? video.key : null;
};

async function importMoviesByGenre(genreId) {
    try {
        console.log(`🎬 Importando género ${genreId}...`);
        // Pedimos solo 1 página para no saturar, pero suficiente para llenar filas
        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'es-ES',
                with_genres: genreId,
                sort_by: 'popularity.desc',
                page: 1
            }
        });

        for (const basicData of response.data.results) {
            const existing = await Movie.findOne({ tmdbId: basicData.id });
            if (!existing) {
                const detailRes = await axios.get(`${TMDB_BASE_URL}/movie/${basicData.id}`, {
                    params: {
                        api_key: TMDB_API_KEY,
                        language: 'es-ES',
                        append_to_response: 'videos',
                        include_video_language: 'es,en,null' // <--- TRUCO CLAVE
                    }
                });
                const fullData = detailRes.data;

                const movie = new Movie({
                    title: fullData.title,
                    overview: fullData.overview,
                    posterUrl: fullData.poster_path ? `${TMDB_IMG_URL}${fullData.poster_path}` : null,
                    tmdbId: fullData.id,
                    releaseDate: fullData.release_date,
                    voteAverage: fullData.vote_average,
                    genres: fullData.genres.map(g => g.name),
                    trailerKey: findTrailer(fullData.videos),
                    platform: getRandomPlatform()
                });
                await movie.save();
                process.stdout.write('.');
            }
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

async function importPopularTVShows() {
    try {
        console.log('\n📺 Importando Series Populares...');
        const response = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
            params: { api_key: TMDB_API_KEY, language: 'es-ES' }
        });

        for (const basicData of response.data.results) {
            const existing = await TVShow.findOne({ tmdbId: basicData.id });
            if (!existing) {
                const detailRes = await axios.get(`${TMDB_BASE_URL}/tv/${basicData.id}`, {
                    params: {
                        api_key: TMDB_API_KEY,
                        language: 'es-ES',
                        append_to_response: 'videos',
                        include_video_language: 'es,en,null' // <--- TRUCO CLAVE
                    }
                });
                const fullData = detailRes.data;

                const show = new TVShow({
                    name: fullData.name,
                    overview: fullData.overview,
                    posterUrl: fullData.poster_path ? `${TMDB_IMG_URL}${fullData.poster_path}` : null,
                    tmdbId: fullData.id,
                    firstAirDate: fullData.first_air_date,
                    voteAverage: fullData.vote_average,
                    genres: fullData.genres.map(g => g.name),
                    trailerKey: findTrailer(fullData.videos)
                });
                await show.save();
                process.stdout.write('.');
            }
        }
    } catch (err) {
        console.error('Error Series:', err.message);
    }
}

async function runSeed() {
    console.log('🚀 Iniciando Seeding Mejorado...');
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB.');

        for (const genreId of GENRES_TO_FETCH) {
            await importMoviesByGenre(genreId);
        }
        await importPopularTVShows();

        console.log('\n¡Todo listo! Base de datos actualizada.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

runSeed();