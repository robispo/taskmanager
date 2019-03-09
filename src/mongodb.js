const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const connectionUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'taskmanager';
const mongoOptions = {
  useNewUrlParser: true
};

MongoClient.connect(connectionUrl, mongoOptions, (error, client) => {
  if (error) {
    console.log(error);
    return;
  }

  console.log('Conneted correctly!');

  const db = client.db(dbName);

  db.collection('user').insertOne({
    name: 'Rabel',
    age: 29
  });
});
