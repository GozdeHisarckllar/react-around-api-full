const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const app = express();

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

mongoose.connect('mongodb://localhost:27017/aroundb');

const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

const { PORT = 3001 } = process.env;

/* app.use((req, res, next) => {
  req.user = {
    _id: '612fccd38e2b7c098bdb86d5',
  };

  next();
}); */
app.post('/signup', createUser);
app.post('/signin', login);

// app.use(auth);//works as well
app.use('/cards', auth, cardsRouter);
app.use('/users', auth, usersRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});/// delete

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error has occurred on the server' /* 'Oops, something went wrong with the server! Please try again later.' */
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});

/* To ensure that if there is still some process running in the background
 when shutting down the server with ctrl+C, it is terminated. Otherwise, it
 can cause an 'error ELIFECYCLE'. */
process.on('SIGINT', () => {
  process.exit();
});

/* "message": "E11000 duplicate key error collection: aroundb.users index:
email_1 dup key: { email: \"gdgd@dgdg.com\" }" */

/* {
    "email": "example@test.com",
    "password": "abcdefg"
} */
/* if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  }); FOR JEST https request testing
} */
