const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');

router.post('/addMovie', moviesController.addMovie);
router.get('/getMovies', moviesController.getMovies);

module.exports = router;
