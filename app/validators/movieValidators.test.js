const { validateMovie } = require('./moviesValidators');

it('should throw error when invalid movie format is passed', async () => {
  const invalidMovie = {
    title: 'Hotel Rwanda',
    year: 'hello',
    runtime: 121,
    genres: ['Dramda', 'Hiastory', 'War'],
    director: 'Terry George',
    actors: 'Xolani Mali, Don Cheadle, Desmond Dube, Hakeem Kae-Kazim',
    plot: 'Paul Rusesabagina was a hotel manager who housed over a thousand Tutsi refugees during their struggle against the Hutu militia in Rwanda.',
    posterUrl:
      'https://images-na.ssl-images-amazon.com/images/M/MV5BMTI2MzQyNTc1M15BMl5BanBnXkFtZTYwMjExNjc3._V1_SX300.jpg',
  };

  const result = await validateMovie(invalidMovie);
  await expect(result).toBeInstanceOf(Error);
});

it('should return object when valid movie format is passed', async () => {
  const validMovie = {
    title: 'Hotel Rwanda',
    year: 2004,
    runtime: 121,
    genres: ['Drama', 'History', 'War'],
    director: 'Terry George',
    actors: 'Xolani Mali, Don Cheadle, Desmond Dube, Hakeem Kae-Kazim',
    plot: 'Paul Rusesabagina was a hotel manager who housed over a thousand Tutsi refugees during their struggle against the Hutu militia in Rwanda.',
    posterUrl:
      'https://images-na.ssl-images-amazon.com/images/M/MV5BMTI2MzQyNTc1M15BMl5BanBnXkFtZTYwMjExNjc3._V1_SX300.jpg',
  };

  const result = await validateMovie(validMovie);

  await expect(result).toMatchObject(validMovie);
});

it('Should return error when passing genres other than predefined', async () => {
  const movieWithInvalidGenre = {
    title: 'Hotel Rwanda',
    year: 2004,
    runtime: 121,
    genres: ['Dra', 'History', 'War'],
    director: 'Terry George',
    actors: 'Xolani Mali, Don Cheadle, Desmond Dube, Hakeem Kae-Kazim',
    plot: 'Paul Rusesabagina was a hotel manager who housed over a thousand Tutsi refugees during their struggle against the Hutu militia in Rwanda.',
    posterUrl:
      'https://images-na.ssl-images-amazon.com/images/M/MV5BMTI2MzQyNTc1M15BMl5BanBnXkFtZTYwMjExNjc3._V1_SX300.jpg',
  };

  const result = await validateMovie(movieWithInvalidGenre);

  expect(result).toBeInstanceOf(Error);
});
