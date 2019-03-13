const express = require('express');
require('./db/mongoose');
const User = require('./models/User');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json(e);
  }

  // user
  //   .save()
  //   .then(d => res.status(201).json(d))
  //   .catch(e => res.status(400).json(e));
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json();
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json();
      return;
    }

    res.status(200).json(user);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post('/api/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).json(task);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (e) {
    res.status(500).json();
  }
});

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json();
      return;
    }

    res.status(200).json(task);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.listen(port, () => console.log(`Server is up in port ${port}!`));
