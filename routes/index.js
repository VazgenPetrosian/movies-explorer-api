const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  createUser,
  loginUser,
} = require('../controllers/user');
const { validateLogin, validateRegistration } = require('../utils/validationConfig');
const NotFoundError = require('../errors/NotFoundError');

router.use('/api/users', auth, require('./userRouter'));
router.use('/api/movies', auth, require('./moviesRouter'));

router.use('/api/signin', validateLogin, loginUser);
router.use('/api/signup', validateRegistration, createUser);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Указанного пути нет'));
});

module.exports = router;
