const express = require('express');
const apiRouter = require('./app/routes/apiRouter.js');

const port = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', apiRouter);

app
  .route('*')
  .get((req, res) => {
    res.json({
      error: '404',
    });
  })
  .post((req, res) => {
    res.json({
      error: '404',
    });
  })
  .put((req, res) => {
    res.json({
      error: '404',
    });
  });

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
