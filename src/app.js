const express = require('express');
require('./db/mongoose');
const User = require('./models/User');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/users', (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(d => res.status(201).json(d))
    .catch(e => res.status(400).json(e));
});

app.get('/api/users', (req, res) => {
  User.find({})
    .then(d => res.status(200).json(d))
    .catch(e => res.status(500).json());
});

app.get('/api/users/:id', (req, res) => {
  User.findById(req.params.id)
    .then(d => {
      if (!d) {
        res.status(404).json();
        return;
      }
      res.status(200).json(d);
    })
    .catch(e => res.status(400).json(e));
});

app.post('/api/tasks', (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then(d => res.status(201).json(d))
    .catch(e => res.status(400).json(e));
});

app.get('/api/tasks', (req, res) => {
  Task.find({})
    .then(d => res.status(200).json(d))
    .catch(e => res.status(500).json());
});

app.get('/api/tasks/:id', (req, res) => {
  Task.findById(req.params.id)
    .then(d => {
      if (!d) {
        res.status(404).json();
        return;
      }
      res.status(200).json(d);
    })
    .catch(e => res.status(400).json(e));
});

app.listen(port, () => console.log(`Server is up in port ${port}!`));
