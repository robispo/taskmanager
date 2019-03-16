const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/api/tasks', auth, async (req, res) => {
  const task = new Task(req.body);
  task.user_id = req.user._id;

  try {
    await task.save();
    //await task.populate('user_id').execPopulate();
    res.status(201).json(task);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.get('/api/tasks', auth, async (req, res) => {
  const match = {};

  if (req.query.completed) {
    match.completed = req.query.completed.trim().toLowerCase() === 'true';
  }

  try {
    //const tasks = await Task.find({ user_id: req.user._id });
    await req.user.populate({ path: 'tasks', match }).execPopulate();

    res.status(200).json(req.user.tasks);
  } catch (e) {
    res.status(500).json();
  }
});

router.get('/api/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user_id: req.user.user_id
    });

    if (!task) {
      res.status(404).json();
      return;
    }

    res.status(200).json(task);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.patch('/api/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every(p => allowedUpdates.includes(p));

  if (!isValidOperation) {
    res
      .status(400)
      .json({ error: 'Trying to update a property that is not allowed!' });
    return;
  }

  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user_id: req.user.user_id
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      res.status(404).json();
      return;
    }

    res.status(200).json(task);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.delete('/api/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.user_id
    });

    if (!task) {
      res.status(404).json();
      return;
    }

    res.status(200).json(task);
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = router;
