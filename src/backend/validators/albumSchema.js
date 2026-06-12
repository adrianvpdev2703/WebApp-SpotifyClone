const Joi = require("joi");

// Reglas estrictas (POST y PUT)
const albumSchema = Joi.object({
  nombre: Joi.string().min(1).required(),
  artista: Joi.number().integer().required(),
  imagen: Joi.string().optional(),
});

// Reglas opcionales (PATCH)
const albumOptionalSchema = Joi.object({
  nombre: Joi.string().min(1).optional(),
  artista: Joi.number().integer().optional(),
  imagen: Joi.string().optional(),
});

// Para busquedas (SEARCH)
const albumSearchSchema = Joi.object({
  nombre: Joi.string().optional(),
  artista: Joi.number().integer().optional(),
});

module.exports = { albumSchema, albumOptionalSchema, albumSearchSchema };
