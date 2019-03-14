const express = require('express');
const Task = require('../models/task');

const router = express.Router();

router.post('/api/tasks', async (req, res) => {
    const task = new Task(req.body);
  
    try {
      await task.save();
      res.status(201).json(task);
    } catch (e) {
      res.status(400).json(e);
    }
  });
  
  router.get('/api/tasks', async (req, res) => {
    try {
      const tasks = await Task.find({});
      res.status(200).json(tasks);
    } catch (e) {
      res.status(500).json();
    }
  });
  
  router.get('/api/tasks/:id', async (req, res) => {
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
  
  router.patch('/api/tasks/:id', async (req, res) => {
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
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
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
  
  router.delete('/api/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
  
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