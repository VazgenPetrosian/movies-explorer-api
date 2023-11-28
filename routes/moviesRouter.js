const moviesRouter = require('express').Router();
const { validateNewMovie, validateMovieId } = require('../utils/validationConfig');
const {
  getAllMovies,
  deleteMovieById,
  createMovie,
} = require('../controllers/movies');

moviesRouter.get('/', getAllMovies);
moviesRouter.post('/', validateNewMovie, createMovie);
moviesRouter.delete('/:movieId', validateMovieId, deleteMovieById);

module.exports = moviesRouter;
