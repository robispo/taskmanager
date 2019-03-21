const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/user');
const auth = require('../middleware/auth');
const mailManager = require('../emails/account');

const router = express.Router();
const avatar = multer({
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
  let token = '';

  try {
    await user.save();
    mailManager.sendWelcomeEmail(user.email, user.name);
    token = await user.generateAuthToken();

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
  try {//console.log(req.body)
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
    mailManager.sendCancelationEmail(req.user.email, req.user.name);
    res.status(200).json(req.user);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.post(
  '/api/users/me/avatar',
  auth,
  avatar.single('avatar'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (err, req, res, next) => {
    res.status(400).json({ error: err.message });
  }
);

router.delete('/api/users/me/avatar', auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).json();
  } catch (e) {
    res.status(400).json(e);
  }
});

router.get('/api/users/me/avatar', auth, async (req, res) => {
  try {
    if (!req.user.avatar) {
      res.status(404).json();
      return;
    }

    res.set('Content-Type', 'image/png');
    res.status(200).send(req.user.avatar);
  } catch (e) {
    res.status(400).json();
  }
});

module.exports = router;
