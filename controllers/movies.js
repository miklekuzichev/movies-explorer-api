const Movie = require('../models/movie');
const { STATUS_CODES } = require('../utils/constants');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

//
// Функция получения фильмов
//
module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.status(STATUS_CODES.OK).send(movies))
    .catch(next);
};

//
// Функция добавления фильма
//
module.exports.createMovies = (req, res, next) => {
  const owner = req.user._id;
  return Movie.create({ owner, ...req.body })
    .then((movie) => res.status(STATUS_CODES.CREATED).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Введены некорректные данные при добавлении фильма'));
      }
      return next(err);
    });
};

//
// Функция удаления фильма
//
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
  .then((movie) => {
    if (!movie) {
      throw new NotFoundError('Фильм не найден');
    }
    if (movie.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Нет прав на удаление фильма');
    }
    Movie.deleteOne(movie)
      .then(() => res.send({ message: 'Фильм удален' }))
      .catch((err) => {
        if (err.name === 'DocumentNotFoundError') {
          return next(new NotFoundError('Передан несуществующий _id фильма'));
        } else if (err.name === 'CastError') {
          return next(new BadRequestError('Введены некорректные данные'));
        }
        return next(err);
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestError('Введены некорректные данные'));
      }
      return next(err);
    });
};
