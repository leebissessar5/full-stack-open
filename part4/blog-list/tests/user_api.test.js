const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')

const app = require('../app')

const api = supertest(app)

const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})

  const userObjects = helper.users.map(user => {
    const saltRounds = 10
    const passwordHash = bcrypt.hashSync(user.password, saltRounds)
    return new User({ ...user, passwordHash })
  })

  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
})

describe('addition of a new user', () => {
  const { username, name, password } = {
    'username': 'Test',
    'name': 'Test User',
    'password': 'testpassword'
  }

  test('add valid user', async () => {
    await api
      .post('/api/users')
      .send({ username, name, password })
      .expect(201)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(helper.users.length + 1)
  })

  test('user without username or password is not added', async () => {
    // send without username
    await api
      .post('/api/users')
      .send({ name, password })
      .expect(400)

    // send without password
    await api
      .post('/api/users')
      .send({ username, name })
      .expect(400)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(helper.users.length)
  })

  test('username is already registered', async () => {
    const example = helper.users[0]

    await api
      .post('/api/users')
      .send(example)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(helper.users.length)
  })

  test('username does not satisfy length requirement', async () => {
    const example = {
      'username': 'AA',
      'name': 'aa',
      'password': 'weakpassword'
    }

    await api
      .post('/api/users')
      .send(example)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(helper.users.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})