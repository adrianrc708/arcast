const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },

    // --- CORRECCIÓN AQUÍ ---
    watchlist: [{
        item: { type: Schema.Types.ObjectId, refPath: 'kind' }, // Antes decía 'watchlist.kind' (ERROR)
        kind: { type: String, required: true, enum: ['Movie', 'TVShow'] }
    }]
});

module.exports = mongoose.model('User', UserSchema);