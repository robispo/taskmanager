const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();
const taskOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: 'Waldo',
  email: 'waldo@hotmail.com',
  password: '1234567',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
};
const userTwo = {
  _id: userTwoId,
  name: 'Titi',
  email: 'titi@hotmail.com',
  password: '1234567',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
};

const taskOne = {
  _id: taskOneId,
  description: '1',
  completed: false,
  user_id: userOne._id
};

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: '2',
    completed: true,
    user_id: userOne._id
  };

  const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: '3',
    completed: true,
    user_id: userTwo._id
  };

const setupDB = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();

  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneId,
  userOne,
  setupDB,
  userTwoId,
  userTwo,
  taskOneId
};
