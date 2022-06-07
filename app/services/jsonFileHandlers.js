const fsPromises = require('fs').promises;

const DB_FILE_PATH = './data/db.json';
const RUNTIME_RESERVE = 10;
const { object } = require('joi');
const {
  arrayContainElement,
  generateRandomFromLength,
} = require('../utils/helpers.js');

const isMovieDataInDb = (movies, movieToAppend) => {
  return movies.some((element) => {
    return (
      element.title === movieToAppend.title &&
      element.director === movieToAppend.director &&
      element.year == movieToAppend.year &&
      element.runtime == movieToAppend.runtime
    );
  });
};

const getMovieGenres = () => {
  return fsPromises
    .readFile(DB_FILE_PATH)
    .then((json) => JSON.parse(json))
    .then((data) => data.genres)
    .catch((err) => {
      return 'Couldnt get genres from file';
    });
};

const removeNullsFromObject = (object) => {
  return Object.entries(object).reduce(
    (acc, [key, value]) => (value ? ((acc[key] = value), acc) : acc),
    {}
  );
};

const createProperMovieObject = (movie, id) => {
  return removeNullsFromObject(
    Object.assign(
      {
        id: id,
        title: null,
        year: null,
        runtime: null,
        genres: null,
        director: null,
        actors: null,
        plot: null,
      },
      movie
    )
  );
};

const getLatestMovieId = (moviesArray) => {
  return Object.keys(moviesArray).length + 1;
};

const saveMovieToFile = (movieToAppend) => {
  return fsPromises
    .readFile(DB_FILE_PATH)
    .then((json) => JSON.parse(json))
    .then((data) => {
      const id = getLatestMovieId(data.movies);
      movieToAppend = createProperMovieObject(movieToAppend, id);

      if (isMovieDataInDb(data.movies, movieToAppend)) {
        return 'Movie already in db';
      } else {
        data.movies.push(movieToAppend);
        fsPromises.writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2));
        return 'Movie added to db';
      }
    })
    .catch((err) => {
      console.log(err);
      return 'Error when trying to do operation on file';
    });
};

const isValidGenres = (validGenres, genres) => {
  return genres.every((element) => {
    return arrayContainElement(validGenres, element);
  });
};

const readMovies = async (duration, genres) => {
  return fsPromises
    .readFile(DB_FILE_PATH)
    .then((json) => JSON.parse(json))
    .then(({ genres: validGenres, movies }) => {
      // in case of single genre not beeing treated like a array
      if (typeof genres === 'string') {
        genres = [genres];
      }

      if (!duration && !genres) {
        return getRandom(movies);
      }
      if (duration && !genres) {
        return getRandomWithDuration(movies, duration);
      }

      if (!isValidGenres(validGenres, genres)) {
        return new Error('Passed invalid genres');
      }

      if (!duration && genres) {
        return getMoviesBasedOnGenre(movies, genres);
      }

      if (duration && genres) {
        return getMovieBasedOnGenreAndDuration(movies, genres, duration);
      }

      return new Error('Pass correct parameters!');
    })
    .catch((err) => {
      return err;
    });
};

const getMovieBasedOnGenreAndDuration = (movies, genres, duration) => {
  return getMoviesBasedOnGenre(movies, genres).filter((movie) => {
    return isRuntimeCorrect(movie.runtime, duration);
  });
};

const whichBucketForMovie = (movie, genres) => {
  if (
    arrayContainElement(movie.genres, genres[0]) &&
    arrayContainElement(movie.genres, genres[1]) &&
    arrayContainElement(movie.genres, genres[2])
  ) {
    return 'allThree';
  } else if (
    arrayContainElement(movie.genres, genres[0]) &&
    arrayContainElement(movie.genres, genres[1])
  ) {
    return 'firstAndSecond';
  } else if (
    arrayContainElement(movie.genres, genres[0]) &&
    arrayContainElement(movie.genres, genres[2])
  ) {
    return 'firstAndThird';
  } else if (
    arrayContainElement(movie.genres, genres[1]) &&
    arrayContainElement(movie.genres, genres[2])
  ) {
    return 'secondAndThird';
  } else if (arrayContainElement(movie.genres, genres[0])) {
    return 'first';
  } else if (arrayContainElement(movie.genres, genres[1])) {
    return 'second';
  } else if (arrayContainElement(movie.genres, genres[3])) {
    return 'third';
  }
};

const getRandom = (movies) => {
  const randomId = [Math.floor(Math.random() * movies.length)];
  return movies.find((movie) => movie.id == randomId);
};

const getMoviesBasedOnGenre = (movies, genres) => {
  let threeGenresBucket = [];
  let twoGenresBucket = [[], [], []];
  let oneGenreBucket = [[], [], []];

  movies.forEach((movie) => {
    switch (whichBucketForMovie(movie, genres)) {
      case 'allThree':
        threeGenresBucket.push(movie);
        break;
      case 'firstAndSecond':
        twoGenresBucket[0].push(movie);
        break;
      case 'firstAndThird':
        twoGenresBucket[1].push(movie);
        break;
      case 'secondAndThird':
        twoGenresBucket[2].push(movie);
        break;
      case 'first':
        oneGenreBucket[0].push(movie);
        break;
      case 'second':
        oneGenreBucket[1].push(movie);
        break;
      case 'third':
        oneGenreBucket[2].push(movie);
    }
  });

  return (mergedBrackets = [
    ...threeGenresBucket,
    ...twoGenresBucket.flat(1),
    ...oneGenreBucket.flat(1),
  ]);
};

const getRandomWithDuration = (movies, duration) => {
  movies = movies.filter((movie) => {
    return isRuntimeCorrect(movie.runtime, duration);
  });
  const randomIndex = generateRandomFromLength(movies.length);
  return movies[randomIndex];
};

const isRuntimeCorrect = (runtime, duration) => {
  return (
    Number(runtime) >= Number(duration) - 10 &&
    Number(runtime) <= Number(duration) + 10
  );
};

module.exports = { saveMovieToFile, getMovieGenres, readMovies };
