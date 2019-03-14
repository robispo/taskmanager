const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/api/users', async (req, res) => {
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
  
  router.get('/api/users', async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (e) {
      res.status(500).json();
    }
  });
  
  router.get('/api/users/:id', async (req, res) => {
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
  
  router.patch('/api/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every(p => allowedUpdates.includes(p));
  
    if (!isValidOperation) {
      res
        .status(400)
        .json({ error: 'Trying to update a property that is not allowed!' });
      return;
    }
  
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
  
      if (!user) {
        res.status(404).json();
        return;
      }
  
      res.status(200).json(user);
    } catch (e) {
      res.status(400).json(e);
    }
  });
  
  router.delete('/api/users/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
  
      if (!user) {
        res.status(404).json();
        return;
      }
  
      res.status(200).json(user);
    } catch (e) {
      res.status(400).json(e);
    }
  });


module.exports = router;