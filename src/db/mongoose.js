const mongoose = require('mongoose');

const dbName = 'taskmanagerapi';
const connectionUrl = `mongodb://127.0.0.1:27017/${dbName}`;
const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(connectionUrl, mongooseOptions);
