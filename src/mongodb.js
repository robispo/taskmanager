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

  //   db.collection('user').insertOne(
  //     {
  //       name: 'Rabel',
  //       age: 29
  //     },
  //     (error, result) => {
  //       if (error) {
  //         console.log(error);
  //         return;
  //       }
  //       console.log(result);
  //     }
  //   );

  //   db.collection('user').insertMany(
  //     [
  //       {
  //         name: 'Waldo',
  //         age: 28
  //       },
  //       {
  //         name: 'Titi',
  //         age: 25
  //       }
  //     ],
  //     (error, result) => {
  //       if (error) {
  //         console.log(error);
  //         return;
  //       }
  //       console.log(result.ops);
  //     }
  //   );

//   db.collection('task').insertMany(
//     [
//       {
//         description: 'Dentista',
//         completed: true
//       },
//       {
//         description: 'Mecanico',
//         completed: false
//       },
//       {
//         description: 'Ir al super',
//         completed: false
//       }
//     ],
//     (e, r) => {
//       if (e) {
//         console.log(e);
//         return;
//       }
//       console.log(r.ops);
//     }
//   );
});
