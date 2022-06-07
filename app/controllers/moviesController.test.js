const app = require('./../../index.js');
const request = require('supertest');
const fsPromises = require('fs').promises;

describe('GET /getMovies', () => {
  it('should respond with status code 200', async () => {
    const response = await request(app).get(
      '/getMovies?duration=90&genres=Crime&genres=Drama&genres=Thriller'
    );

    expect(response.statusCode).toBe(200);
  });
  it('should return json format', async () => {
    const response = await request(app).get(
      '/getMovies?duration=90&genres=Crime&genres=Drama&genres=Thriller'
    );

    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
  });
  it('should return status 400', async () => {
    const response = await request(app).get(
      '/getMovies?duration=90&genres=Cime&genres=Drma&genres=Thriller'
    );
    expect(response.statusCode).toBe(400);
  });
});

describe('POST /addMovie', () => {
  it('Should respond with status 200', async () => {
    const response = await request(app)
      .post('/addMovie')
      .send({
        title: 'Testt',
        year: '1337',
        runtime: '100',
        genres: ['Comedy', 'Fantasy'],
        director: 'Tim ',
      });
    expect(response.statusCode).toBe(200);
  });
  it('Should respond with status 400', async () => {
    const response = await request(app)
      .post('/addMovie')
      .send({
        title: 'Testt',
        year: '1337',
        runtime: '100',
        genres: ['Coedy', 'Fantasy'],
        director: 'Tim ',
      });
    expect(response.statusCode).toBe(400);
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
});
