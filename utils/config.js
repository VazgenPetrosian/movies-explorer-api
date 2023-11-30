const SECRET = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret-key';

const PORT = 4000;

const MONGODB = process.env.NODE_ENV === 'production' ? process.env.MONGOURL : 'mongodb://127.0.0.1:27017/bitfilmsdb';

module.exports = {
  SECRET, PORT, MONGODB,
};
