const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviews.controller');

// API Endpoints 
router.get('/', controller.getAllReviews);
router.get('/:movieId', controller.getReviewsByMovie);
router.post('/', controller.createReview);
router.put('/:id', controller.updateReview);
router.delete('/:id', controller.deleteReview);

module.exports = router;