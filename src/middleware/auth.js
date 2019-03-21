const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    if (!req.header('Authorization')) {
      throw new Error('Authorization header not provided.');      
    }

    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    });

    if (!user) {
      throw new Error('User do not exists or token is not stored.');
    }

    req.token = token;
    req.user = user;

    next();
  } catch (e) {
    console.log(e);
    res.status(401).json();
  }
};

module.exports = auth;
