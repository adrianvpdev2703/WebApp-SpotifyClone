const Joi = require("joi");

const artistaSchema = Joi.object({
  nombre: Joi.string().min(1).required(),
  imagen: Joi.string().optional(),
});

const artistaOptionalSchema = Joi.object({
  nombre: Joi.string().min(1).optional(),
  imagen: Joi.string().optional(),
});

const artistaSearchSchema = Joi.object({
  nombre: Joi.string().optional(),
});

module.exports = {
  artistaSchema,
  artistaOptionalSchema,
  artistaSearchSchema,
};
