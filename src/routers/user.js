const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/api/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();

    res.status(200).json({ user, token });
  } catch (e) {
    res.status(400).json(e);
  }

  // user
  //   .save()
  //   .then(d => res.status(201).json(d))
  //   .catch(e => res.status(400).json(e));
});

router.post('/api/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    if (!user) {
      res.status(401).json();
      return;
    }

    const token = await user.generateAuthToken();

    res
      .set('Authorization', `Bearer ${token}`)
      .status(200)
      .json({ user, token });
  } catch (e) {
    res.status(401).json(e);
  }
});

router.post('/api/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(t => t.token !== req.token);
    await req.user.save();
    res.json();
  } catch (e) {
    res.status(400).json();
  }
});

router.post('/api/users/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.json();
  } catch (e) {
    res.status(400).json();
  }
});

router.get('/api/users/me', auth, async (req, res) => {
  res.json(req.user);
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
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json();
      return;
    }

    updates.forEach(p => (user[p] = req.body[p]));
    await user.save();

    res.status(200).json(user);
  } catch (e) {
    res.status(400).json(e);
  }

  // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true
  // });
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
