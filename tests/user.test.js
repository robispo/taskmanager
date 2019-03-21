const request = require('supertest');

const app = require('../src/index');
const User = require('../src/models/user');
const { userOneId, userOne, setupDB } = require('./fixtures/db');

beforeEach(setupDB);

test('Should signup a new user', async () => {
  const res = await request(app)
    .post('/api/users')
    .send({
      name: 'Rabel Obispo',
      email: 'rabelobispo@hotmail.com',
      password: '1234567'
    })
    .expect(201);

  const user = await User.findById(res.body.user._id);
  expect(user).not.toBeNull();

  expect(res.body).toMatchObject({
    user: {
      name: 'Rabel Obispo',
      email: 'rabelobispo@hotmail.com'
    },
    token: user.tokens[0].token
  });

  expect(user.password).not.toBe('1234567');
});

test('Should login a user', async () => {
  const res = await request(app)
    .post('/api/users/login')
    .send(userOne)
    .expect(200);

  const user = await User.findById(res.body.user._id);
  expect(user).not.toBeNull();

  expect(res.body.token).toBe(user.tokens[1].token);
});

test('Should not login', async () => {
  await request(app)
    .post('/api/users/login')
    .send({
      email: 'waldo@hotmail.com',
      password: '12345'
    })
    .expect(401);
});

test('Should get my user', async () => {
  await request(app)
    .get('/api/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get my user', async () => {
  await request(app)
    .get('/api/users/me')
    .send()
    .expect(401);
});

test('Should not delete the user', async () => {
  await request(app)
    .delete('/api/users/me')
    .send()
    .expect(401);
});

test('Should delete my user', async () => {
  const res = await request(app)
    .delete('/api/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(res.body._id);
  expect(user).toBeNull();
});

test('Should upload avatar image', async () => {
  const res = await request(app)
    .post('/api/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update the name', async () => {
  const res = await request(app)
    .patch('/api/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Waldo2'
    })
    .expect(200);

  const user = await User.findById(res.body._id);
  expect(user.name).toBe('Waldo2');
});

test('Should not update', async () => {
  const res = await request(app)
    .patch('/api/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      hola: 'Waldo2'
    })
    .expect(400);
});
