const { validateMovie } = require('../validators/moviesValidators');
const { saveMovieToFile, readMovies } = require('../services/jsonFileHandlers');

class moviesController {
  async getMovies(req, res, next) {
    const { duration, genres } = req.query;
    try {
      const results = await readMovies(duration, genres);
      if (results instanceof Error) throw new Error(results);

      res.status(200).json(results);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  async addMovie(req, res) {
    try {
      const values = await validateMovie(req.body);
      if (values instanceof Error) throw values;

      const result = await saveMovieToFile(values);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).send(String(error));
    }
  }
}
module.exports = new moviesController();
