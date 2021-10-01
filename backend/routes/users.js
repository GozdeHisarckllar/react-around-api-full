const usersRouter = require('express').Router();
const {
  getAllUsers,
  findUser,
  updateProfile,
  updateAvatar,
  getUserInfo
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);

//usersRouter.get('/:userId', findUser);

//usersRouter.post('/', createUser);
usersRouter.get('/me', getUserInfo);

usersRouter.patch('/me', updateProfile);

usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
