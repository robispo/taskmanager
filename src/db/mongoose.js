const mongoose = require('mongoose');
const validator = require('validator');

const dbName = 'taskmanagerapi';
const connectionUrl = `mongodb://127.0.0.1:27017/${dbName}`;
const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true
};

mongoose.connect(connectionUrl, mongooseOptions);

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('The password can not includes the world "password"!');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number!');
      }
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid!');
      }
    }
  }
});

const me = new User({
  name: 'Rabel',
  age: 29,
  email: 'rabelobispo@hotmail.com',
  password: '1234'
});

// me.save()
//   .then(d => console.log(d))
//   .catch(e => console.log(e));

const Task = mongoose.model('Task', {
  description: {
    type: String,
    trim: true,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const task = new Task({
  description: 'Testing',
  //completed: false
});

task
  .save()
  .then(d => console.log(d))
  .catch(e => console.log(e));
