require('../src/db/mongoose');
const Task = require('../src/models/task');

const filter = { completed: false };
const id = '5c87eda6c438ac1bb5546a0c';

// Task.findByIdAndDelete(id)
//   .then(d => Task.countDocuments(filter))
//   .then(c => console.log(c))
//   .catch(e => console.log(e));

const deleteTaskAndCount = async id => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments(filter);
  return count;
};

deleteTaskAndCount(id)
  .then(d => console.log(d))
  .catch(e => console.log(e));
