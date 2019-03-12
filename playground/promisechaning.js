require('../src/db/mongoose');
const User = require('../src/models/user');

//5c8724c9d930f113e6aa5dde
// const age = { age: 30 };

// User.findByIdAndUpdate('5c8724c9d930f113e6aa5dde', age)
//   .then(d => {
//     console.log(d);
//     return User.countDocuments(age);
//   })
//   .then(c => console.log(c))
//   .catch(e => console.log(e));

const updateUserAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });
  return count;
};

updateUserAndCount('5c8724c9d930f113e6aa5dde', 31)
  .then(d => console.log(d))
  .catch(e => console.log(e));
