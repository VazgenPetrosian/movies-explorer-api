const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { ValidationError } = mongoose.Error;
const { HTTP_STATUS_CREATED } = require('http2').constants;
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const userModel = require('../models/users');
const { SECRET } = require('../utils/config');

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name, email, password: hash,
    }))
    .then(() => res.status(HTTP_STATUS_CREATED).send({
      name, email,
    }))
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(new BadRequestError(error.message));
      } else if (error.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован.'));
      } else {
        next(error);
      }
    });
};

const getInfoAboutMe = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((userData) => res.send(userData))
    .catch((error) => next(error));
};

const updateUserById = (req, res, next) => {
  const { name, email } = req.body;

  userModel.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((updatedUserData) => res.send({ data: updatedUserData }))
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(new BadRequestError(error.message));
      } else {
        next(error);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const jwtToken = jwt.sign({ _id: user._id }, SECRET, { expiresIn: '7d' });
      res.send({ jwtToken });
    })
    .catch((error) => next(error));
};

module.exports = {
  createUser,
  getInfoAboutMe,
  updateUserById,
  loginUser,
};
