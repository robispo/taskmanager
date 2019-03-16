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
  const options = {};
  const sort = {};
  const booleans = ['true', 'false'];
  const sorts = ['asc', 'desc'];
  const asc = 1;
  const desc = -1;

  if (req.query.completed) {
    const completedValue = req.query.completed.trim().toLowerCase();

    if (!booleans.includes(completedValue)) {
      res.status(400).json({
        error: 'completed must be "true" or "false"!'
      });
      return;
    }

    match.completed = completedValue === 'true';
  }

  if (req.query.limit || req.query.skip) {
    if (
      isNaN(req.query.limit) ||
      isNaN(req.query.skip) ||
      parseInt(req.query.limit) < 0 ||
      parseInt(req.query.skip) < 0
    ) {
      res.status(400).json({
        error: 'limit and skip are use together, must be numbers and positives!'
      });
      return;
    }
    options.limit = parseInt(req.query.limit);
    options.skip = parseInt(req.query.skip);
  }

  if (req.query.sort) {
    try {
      const parts = req.query.sort.split(/[,:]+/);

      for (let i = 0; i < parts.length; i = i + 2) {
        if (
          !parts[i + 1] ||
          !sorts.includes(parts[i + 1].trim().toLowerCase())
        ) {
          res.status(400).json({
            error:
              'sort is a key:value pair, separated by "," and ":", where the value must be "asc" or "desc"!'
          });
          return;
        }

        sort[parts[i]] =
          parts[i + 1].trim().toLowerCase() === 'asc' ? asc : desc;
      }

      options.sort = sort;
      
    } catch (e) {
      res.status(400).json({
        error:
          'sort is a key:value pair, separated by "," and ":", where the value must be "asc" or "desc"!'
      });
      return;
    }
  }

  try {
    await req.user.populate({ path: 'tasks', match, options }).execPopulate();

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
