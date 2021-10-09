const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validateURL = require('../utils/validateUrl');
const {
  getAllUsers,
  updateProfile,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

usersRouter.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getAllUsers);

usersRouter.get('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getUserInfo);

usersRouter.patch('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().max(30),
    about: Joi.string().required().max(30),
  }),
}), updateProfile);

usersRouter.patch('/me/avatar', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  }),
}), updateAvatar);

module.exports = usersRouter;
