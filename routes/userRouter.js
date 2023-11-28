const userRouter = require('express').Router();
const { validateUserUpdate } = require('../utils/validationConfig');
const {
  updateUserById,
  getInfoAboutMe,
} = require('../controllers/user');

userRouter.get('/me', getInfoAboutMe);
userRouter.patch('/me', validateUserUpdate, updateUserById);

module.exports = userRouter;
