const Joi = require("joi");

const artistaxgeneroSchema = Joi.object({
  genero: Joi.number().integer().required(),
  artista: Joi.number().integer().required(),
});

const artistaxgeneroOptionalSchema = Joi.object({
  genero: Joi.number().integer().optional(),
  artista: Joi.number().integer().optional(),
});

module.exports = {
  artistaxgeneroSchema,
  artistaxgeneroOptionalSchema,
};
