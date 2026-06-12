const Joi = require("joi");

const generoSchema = Joi.object({
  nombre: Joi.string().min(1).required(),
  imagen: Joi.string().optional(),
});

const generoOptionalSchema = Joi.object({
  nombre: Joi.string().min(1).optional(),
  imagen: Joi.string().optional(),
});

const generoSearchSchema = Joi.object({
  nombre: Joi.string().optional(),
});

module.exports = {
  generoSchema,
  generoOptionalSchema,
  generoSearchSchema,
};
