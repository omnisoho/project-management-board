const express = require('express');
const createError = require('http-errors');

const taskRouter = require('./routers/Task.router');
const statusRouter = require('./routers/Status.router');

const app = express();
app.use(express.json());

app.use(express.static('public'));
app.use('/tasks', taskRouter);
app.use('/statuses', statusRouter);

app.use(function (req, res, next) {
  next(createError(404, `Unknown resource ${req.method} ${req.originalUrl}`));
});

app.use(function (error, req, res, next) {
  console.error(error);
  res
    .status(error.status || 500)
    .json({ error: error.message || 'Unknown Server Error!' });
});

module.exports = app;
