const mongoose = require('mongoose');

const { ValidationError } = mongoose.Error;
const { HTTP_STATUS_CREATED } = require('http2').constants;
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const movieModel = require('../models/movies');

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  movieModel
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: req.user._id,
    })
    .then((movie) => {
      res.status(HTTP_STATUS_CREATED).send(movie);
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(new BadRequestError(error.message));
      } else {
        next(error);
      }
    });
};

const deleteMovieById = (req, res, next) => {
  const { movieId } = req.params;
  movieModel.findById(movieId)
    .orFail(new NotFoundError('Передан несуществующий ID фильма.'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) return next(new ForbiddenError('Эта карточка принадлежит другому пользователю.'));

      return movieModel.findByIdAndDelete(movie)
        .then(() => res.send({ message: movie }));
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Передан некорректный ID'));
        return;
      }
      next(error);
    });
};

const getAllMovies = (req, res, next) => {
  movieModel
    .find({})
    .then((movies) => res.send(movies))
    .catch((error) => next(error));
};

module.exports = { createMovie, deleteMovieById, getAllMovies };
