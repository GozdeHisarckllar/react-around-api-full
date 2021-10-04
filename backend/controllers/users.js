const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const NotFoundError = require('../errors/NotFoundError');
// const UnauthorizedError = require('../errors/UnauthorizedError');
const User = require('../models/user');
// const UnauthorizedError = require('../errors/UnauthorizedError');
/* Optionally, if your project has controllers for editing a profile
and an avatar, the user can't edit someone else's profile and change
someone else's avatar. */

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'b06e69b88dbbe0fdfe76f90af191777318f414fb532337e5ec723dd8ec19ef99', // NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret' ||| const { NODE_ENV, JWT_SECRET } = process.env;
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });// Set-Cookie header
    })
    .catch(next);
};
/* data:
email: "gozde@example1.com"
_id: "61577a5a67c0c800131eaa24" */
/* {
    "data": {
        "email": "example@test.com",
        "_id": "6157709e160758f9a4364e10"
    }
} */
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new Error('Something went wrong. Authorization required');//
      }
      res.status(200).send({
        data:
        {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch(next);
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));// server error
};

module.exports.findUser = (req, res) => { // del
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User ID not found' });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create(
      {
        ...req.body,
        password: hash,
      },
    ))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.code === 11000) { // duplicate error
        res.status(400).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  /* const isuser = User.findOne({ email: req.user.email });
  if (isuser._id === req.user._id) { return; } */
  /* const isuser = User.findOne({ _id: req.user._id });
  if (isuser.email === req.user.email) { return; } */
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User ID not found' });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const er = new Error('error next');
        er.statusCode = 400;
        next(er);
        /* res.status(400).send({ message: err.message }); */
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User ID not found' });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};
