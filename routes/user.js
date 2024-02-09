const userRouter = require('express').Router();

const {
  findUser,
  updateUserProfile,
} = require('../controllers/users');

const {
  validateId,
  userDataValidate,
} = require('../middlewares/validation');

userRouter.get('/users/me', validateId, findUser); // возвращаем информацию о текущем пользователе
userRouter.patch('/users/me', userDataValidate, updateUserProfile);


module.exports = userRouter;


