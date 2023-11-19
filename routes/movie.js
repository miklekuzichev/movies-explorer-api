const movieRouter = require('express').Router();

const {
  getMovieById,
} = require('../controllers/users');

const {
  movieIdValidate,
  validateCreateMovie,
} = require('../middlewares/validation');

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', validateCreateMovie, createMovies);
movieRouter.delete('/movies/:movieId', movieIdValidate, getMovieById);


module.exports = movieRouter;
