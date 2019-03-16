const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const port = process.env.PORT || 3000;
const app = express();

// app.use((req, res, next) => {
//   res.status(503).json({message:'Under Maintenance!'});
// });

app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err);
  err.stacktrace = err.stack;
  res.status(400).json(err);
});

app.use(userRouter);
app.use(taskRouter);

app.all('*', (req, res) => {
  res.status(404).json({ error: 'Resource not found!' });
});

app.listen(port, () => console.log(`Server is up in port ${port}!`));

// const jwt = require('jsonwebtoken');
// const jwtf = async () => {
//   const token = jwt.sign({ _id: 'id' }, 'Test', {
//     expiresIn: '0 seconds'
//   });
//   console.log(token);

//   // const data = jwt.verify(token, 'Test!');
//   // console.log(data);
// };
// jwtf();
