const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = require('../src/index');
const Task = require('../src/models/task');
const { userOneId, userOne, setupDB } = require('./fixtures/db');

beforeEach(setupDB);

test('Should create a new task', async () => {
  const res = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'Abrirle a Titi'
    })
    .expect(201);

  const task = await Task.findById(res.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toBe(false);

  expect(res.body).toMatchObject({
    description: 'Abrirle a Titi'
  });
});

test('Should get 2 task', async () => {
  const res = await request(app)
    .get('/api/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(res.body.length).toBe(2);
});
