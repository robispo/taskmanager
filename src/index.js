const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err);
  err.stacktrace = err.stack;
  res.status(400).json(err);
});

app.use(userRouter);
app.use(taskRouter);

app.all('*', (req, res) => {
  res.status(404).json({ error: 'Resource not found!' });
});

module.exports = app;