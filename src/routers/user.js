const express = require('express');
const multer = require('multer');

const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();
const avatar = multer({
  dest: 'avatar',
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      callback(new Error('Please a valid image .jpg, .jpeg or .png.'));
      return;
    }
    callback(null, true);
  }
});

router.post('/api/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();

    res.status(201).json({ user, token });
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

router.patch('/api/users/me', auth, async (req, res) => {
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
    updates.forEach(p => (req.user[p] = req.body[p]));
    await req.user.save();

    res.status(200).json(req.user);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.delete('/api/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).json(req.user);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.post(
  '/api/users/me/avatar',
  avatar.single('avatar'),
  async (req, res) => {
    res.send();
  }
);

module.exports = router;
