const Joi = require('joi');
const { getMovieGenres } = require('../services/jsonFileHandlers');

const validateMovie = async (payload) => {
  try {
    return await addMovieSchema.validateAsync(payload, {
      abortEarly: false,
    });
  } catch (error) {
    return error;
  }
};

const isInGenres = async (value) => {
  const genres = await getMovieGenres();

  if (genres.indexOf(value) === -1) {
    throw new Error(`${value} is not in predefined genre list`);
  }

  return value;
};

const addMovieSchema = Joi.object({
  title: Joi.string().min(1).max(255).trim().required(),
  year: Joi.number().required(),
  runtime: Joi.number().min(1).required(),
  genres: Joi.array()
    .items(Joi.string().external(isInGenres))
    .single()
    .min(0)
    .max(3)
    .unique()
    .required(),
  director: Joi.string().min(1).max(255).trim().required(),
  actors: Joi.string().trim().optional(),
  plot: Joi.string().trim().optional(),
  posterUrl: Joi.string().optional(),
});

module.exports = { validateMovie };
