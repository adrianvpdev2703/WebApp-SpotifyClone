const Joi = require("joi");

const cancionSchema = Joi.object({
  nombre: Joi.string().required(),
  album: Joi.number().integer().required(),
  imagen: Joi.string().optional(),
  archivo: Joi.string().optional(),
});

const cancionOptionalSchema = Joi.object({
  nombre: Joi.string().optional(),
  album: Joi.number().integer().optional(),
  imagen: Joi.string().optional(),
  archivo: Joi.string().optional(),
});

const cancionSearchSchema = Joi.object({
  nombre: Joi.string().optional(),
  album: Joi.number().integer().optional(),
});

module.exports = {
  cancionSchema,
  cancionOptionalSchema,
  cancionSearchSchema,
};
