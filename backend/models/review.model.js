const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definición del modelo Review 
const ReviewSchema = new Schema({
    movieId: { type: String, required: true },
    movieTitle: { type: String, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: { type: Date, default: Date.now } // Campo de fecha 
});

module.exports = mongoose.model('Review', ReviewSchema);