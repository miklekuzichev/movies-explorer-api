const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ConflictError = require('../utils/errors/ConflictError');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const { STATUS_CODES } = require('../utils/constants');

//
// Контроллер создания юзера
//
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.status(STATUS_CODES.CREATED)
      .send(
        {
          data: {
            name, email,
          },
        },
      ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует!'));
      }
      return next(err);
    });
};

//
// Контроллер регистрации
//
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '74c996b93e60225322df59ea8742655c655b6a63562e9181812f2855aafaa2ede', { expiresIn: '7d' }); // 7 days
      res.send({ _id: token });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        return next(new UnauthorizedError('Необходима авторизация!'));
      }
      return next(err);
    });
};

//
// Контроллер получения информации о пользователе
//
module.exports.findUser = (req, res, next) => {
  console.log(req);
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь не найден'));
      } else if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

//
// Контроллер обновления информации юзера
//
module.exports.updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(STATUS_CODES.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};