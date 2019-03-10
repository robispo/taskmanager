const mongoose = require('mongoose');

const dbName = 'taskmanagerapi';
const connectionUrl = `mongodb://127.0.0.1:27017/${dbName}`;
const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true
};

mongoose.connect(connectionUrl, mongooseOptions);

const User = mongoose.model('User', {
  name: {
    type: String
  },
  age: {
    type: Number
  }
});

const me = new User({
  name: 'Rabel',
  age: 'asdfa'
});

me.save()
  .then(d => console.log(d))
  .catch(e => console.log(e));

  