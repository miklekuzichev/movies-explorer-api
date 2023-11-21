const { celebrate, Joi } = require('celebrate');


module.exports.validateId = celebrate({
    params: Joi.object().keys({
      _id: Joi.string().hex().length(24),
    }),
  });

module.exports.userDataValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports.validateCreateMovie = celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(1).max(100),
      director: Joi.string().required().min(1).max(100),
      duration: Joi.number().required(),
      year: Joi.string().required().min(2).max(4),
      description: Joi.string().required().min(1).max(5000),
      image: Joi.string().required(),
      trailerLink: Joi.string().required(),
      thumbnail: Joi.string().required(),
      owner: Joi.string().required(),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required().min(1).max(100),
      nameEN: Joi.string().required().min(1).max(100),
    }),
  });

  module.exports.validateDeleteMovie = celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required().alphanum().length(24)
        .hex(),
    }),
  });

module.exports.signinValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(30),
  }),
});

module.exports.signupValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
