const { MongoClient, ObjectID } = require('mongodb');

const connectionUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'taskmanager';
const mongoOptions = {
  useNewUrlParser: true
};

// const id = new ObjectID();
// console.log(id);
// console.log(id.id);
// console.log(id.id.length);
// console.log(id.toHexString());
// console.log(id.getTimestamp());

MongoClient.connect(connectionUrl, mongoOptions, (error, client) => {
  if (error) {
    console.log(error);
    return;
  }

  console.log('Conneted correctly!');

  const db = client.db(dbName);

//   db.collection('user').insertOne(
//     {
//     //   _id: id,
//       name: 'Rabel',
//       age: 29
//     },
//     (error, result) => {
//       if (error) {
//         console.log(error);
//         return;
//       }
//       console.log(result.ops);
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
  client.close();
});
