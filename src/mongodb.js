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

  // db.collection('user')
  //   .updateOne(
  //     {
  //       _id: new ObjectID('5c8444ba36f7f4440b56fc4b')
  //     },
  //     {
  //       $set: {
  //         name: 'Wilmy'
  //       },
  //       $inc: {
  //         age: 1
  //       }
  //     }
  //   )
  //   .then(d => console.log(d.matchedCount))
  //   .catch(e => console.log(e));

  db.collection('task')
    .updateMany(
      {
        completed: false
      },
      {
        $set: {
          completed: true
        }
      }
    )
    .then(d => console.log(d.matchedCount))
    .catch(e => console.log(e));

  //modifiedCount
  //matchedCount
  client.close();
});
