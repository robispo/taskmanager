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

  //   db.collection('user').findOne(
  //     { _id: new ObjectID('5c842092a82e2539c1fcc3cf') },
  //     (e, u) => {
  //       if (e) {
  //         console.log(e);
  //         return;
  //       }
  //       console.log(u);
  //     }
  //   );

  //   db.collection('user').find({ age: 29 }).toArray((e, us) => {
  //     if (e) {
  //       console.log(e);
  //       return;
  //     }
  //     console.log(us);
  //   });

  //   db.collection('user').find({ age: 29 }).count((e, count) => {
  //     if (e) {
  //       console.log(e);
  //       return;
  //     }
  //     console.log(count);
  //   });

  db.collection('task')
    .find({})
    .sort({ _id: -1 })
    .limit(1)
    .toArray((e, lastTask) => {
      if (e) {
        console.log(e);
        return;
      }
      console.log(lastTask);
    });

  db.collection('task')
    .find({ completed: false })
    .toArray((e, tasks) => {
      if (e) {
        console.log(e);
        return;
      }
      console.log(tasks);
    });

  client.close();
});
