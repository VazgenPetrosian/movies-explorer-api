require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const rateLimiter = require('./middlewares/rateLimiter');
const router = require('./routes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, MONGODB } = require('./utils/config');

const app = express();
app.use(cors());

mongoose.connect(MONGODB);

app.use(express.json());
app.use(rateLimiter);
app.use(helmet());

app.use(requestLogger); // подключаем логгер запросов

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(errorMiddleware);

app.listen(PORT);
