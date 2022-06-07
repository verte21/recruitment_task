const fsPromises = require('fs').promises;

const { getMovies } = require('../controllers/moviesController');
const {
  getMovieGenres,
  readMovies,
  saveMovieToFile,
} = require('./jsonFileHandlers');
const { arrayContainElement } = require('../utils/helpers');

test('Should return array of predefined movie genres', async () => {
  const properGenres = [
    'Comedy',
    'Fantasy',
    'Crime',
    'Drama',
    'Music',
    'Adventure',
    'History',
    'Thriller',
    'Animation',
    'Family',
    'Mystery',
    'Biography',
    'Action',
    'Film-Noir',
    'Romance',
    'Sci-Fi',
    'War',
    'Western',
    'Horror',
    'Musical',
    'Sport',
  ];

  const genresFromFile = await getMovieGenres();

  await expect(genresFromFile).toMatchObject(properGenres);
});

test('Should return random movie', async () => {
  const result = await readMovies();

  await expect(result).toBeInstanceOf(Object);
  await expect(result).toHaveProperty('id');
  await expect(result).toHaveProperty('title');
  await expect(result).toHaveProperty('year');
  await expect(result).toHaveProperty('runtime');
  await expect(result).toHaveProperty('director');
});

test('Should return random movie with proper runtime', async () => {
  const testRuntime = 90;
  const result = await readMovies(testRuntime);
  const RUNTIME_RESERVE = 10;

  await expect(result).toBeInstanceOf(Object);
  await expect(result).toHaveProperty('id');
  await expect(result).toHaveProperty('title');
  await expect(result).toHaveProperty('year');
  await expect(result).toHaveProperty('runtime');
  await expect(result).toHaveProperty('director');

  await expect(Number(result.runtime)).toBeGreaterThanOrEqual(
    testRuntime - RUNTIME_RESERVE
  );
  await expect(Number(result.runtime)).toBeLessThanOrEqual(
    testRuntime + RUNTIME_RESERVE
  );
});

test('Should return array of movies where every movie contain proper genre', async () => {
  const testGenres = ['Crime', 'Drama', 'Thriller'];
  result = await readMovies(undefined, testGenres);

  // checking if every movie has atleast one of valid genres
  result.forEach((movie) => {
    expect(movie.genres.some((item) => testGenres.includes(item))).toBe(true);
  });
});

test('Should return error, when passing invalid genre', async () => {
  const testGenres = ['Crie', 'Drama', 'Thriller'];
  result = await readMovies(undefined, testGenres);
  expect(result).toBeInstanceOf(Error);
});

test('Should return array of movies with proper genres and duration', async () => {
  const testGenres = ['Crime', 'Drama', 'Thriller'];
  const testDuration = 90;
  const RUNTIME_RESERVE = 10;
  result = await readMovies(testDuration, testGenres);

  const isProperDuration = (runtime) => {
    return (
      runtime >= testDuration - RUNTIME_RESERVE &&
      runtime <= testDuration + RUNTIME_RESERVE
    );
  };

  await result.forEach((movie) => {
    expect(
      movie.genres.some((item) => testGenres.includes(item)) &&
        isProperDuration(Number(movie.runtime))
    ).toBe(true);
  });
});

test('Should return proper message when movie is already in db', async () => {
  const movieFromDb = {
    title: 'Beetlejuice',
    year: '1988',
    runtime: '92',
    genres: ['Comedy', 'Fantasy'],
    director: 'Tim Burton',
    actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
    plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
    posterUrl:
      'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
  };

  const result = await saveMovieToFile(movieFromDb);
  expect(result).toMatch('Movie already in db');
});

test('Should return proper message when movie is added to db', async () => {
  const DB_FILE_PATH = './data/db.json';
  const newMovie = {
    title: 'Testt',
    year: '1337',
    runtime: '100',
    genres: ['Comedy', 'Fantasy'],
    director: 'Tim ',
  };

  const result = await saveMovieToFile(newMovie);

  await expect(result).toMatch('Movie added to db');
});

afterAll(async () => {
  const DB_FILE_PATH = './data/db.json';

  fsPromises
    .readFile(DB_FILE_PATH)
    .then((json) => JSON.parse(json))
    .then((data) => {
      data.movies.pop();
      fsPromises.writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2));
      return 'Deleted test movie from db';
    })
    .catch((err) => {
      return 'Error when trying to do operation on file';
    });
});
