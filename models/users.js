const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnautorizedError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Vazgen',
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, 'Обязательное поле'],
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: 'Неправильный email',
      },
    },
    password: {
      type: String,
      required: [true, 'Обязательное поле'],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) { return Promise.reject(new UnauthorizedError('Неправильная почта или пароль')); }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) { return Promise.reject(new UnauthorizedError('Неправильные почта или пароль')); }
      return user;
    });
  });
};

module.exports = mongoose.model('userModel', userSchema);
