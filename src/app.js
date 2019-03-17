const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const port = process.env.PORT || 3000;
const app = express();

const multer = require('multer');
const upload = multer({
  dest: 'images',
  limits: {
    fielSize: 1000000
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
      callback(new Error('You can only upload pdf.'));
      return;
    }
    callback(null, true);
  }
});

app.post('/api/upload', upload.single('upload'), (req, res) => {
  res.send();
});

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
