const movieRouter = require('express').Router();

const {
  getMovies,
  createMovies,
  deleteMovie,
} = require('../controllers/movies');

const {
  validateDeleteMovie,
  validateCreateMovie,
} = require('../middlewares/validation');

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', validateCreateMovie, createMovies);
movieRouter.delete('/movies/:movieId', validateDeleteMovie, deleteMovie);


module.exports = movieRouter;
