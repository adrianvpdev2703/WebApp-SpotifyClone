const Joi = require("joi");

const cancionSchema = Joi.object({
  nombre: Joi.string().required(),
  album: Joi.alternatives().try(Joi.number().integer(), Joi.string()).required(),
  imagen: Joi.string().optional().allow(""),
  archivo: Joi.string().optional().allow(""),
});

const cancionOptionalSchema = Joi.object({
  nombre: Joi.string().optional(),
  album: Joi.alternatives().try(Joi.number().integer(), Joi.string()).optional(),
  imagen: Joi.string().optional().allow(""),
  archivo: Joi.string().optional().allow(""),
});

const cancionSearchSchema = Joi.object({
  nombre: Joi.string().optional(),
  album: Joi.alternatives().try(Joi.number().integer(), Joi.string()).optional(),
});

module.exports = {
  cancionSchema,
  cancionOptionalSchema,
  cancionSearchSchema,
};
