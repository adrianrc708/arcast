const Review = require('../models/review.model');

// GET /api/reviews -> listar todas 
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ date: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/reviews/:movieId -> listar por película 
exports.getReviewsByMovie = async (req, res) => {
    try {
        const reviews = await Review.find({ movieId: req.params.movieId }).sort({ date: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/reviews -> crear reseña 
exports.createReview = async (req, res) => {
    const review = new Review({
        movieId: req.body.movieId,
        movieTitle: req.body.movieTitle,
        username: req.body.username,
        text: req.body.text,
        rating: req.body.rating
    });
    try {
        const newReview = await review.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT /api/reviews/:id -> editar reseña 
exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Reseña no encontrada' });

        review.text = req.body.text || review.text;
        review.rating = req.body.rating || review.rating;

        const updatedReview = await review.save();
        res.json(updatedReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE /api/reviews/:id -> eliminar reseña 
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Reseña no encontrada' });

        await review.remove();
        res.json({ message: 'Reseña eliminada' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};