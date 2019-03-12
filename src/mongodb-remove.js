const { MongoClient, ObjectID } = require('mongodb');

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

  db.collection('user')
    .deleteMany({ age: 29 })
    .then(d => console.log(d.deletedCount))
    .catch(e => console.log(e));

  db.collection('task')
    .deleteOne({ description: 'Ir al super' })
    .then(d => console.log(d.deletedCount))
    .catch(e => console.log(e));

  client.close();
});
