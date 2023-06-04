const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.blogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.blogs.length)
})

test('unique identifier is named \'id\'', async () => {
  const blogs = await helper.blogsInDb()

  const promiseArray = blogs.map(blog => expect(blog.id).toBeDefined())
  await Promise.all(promiseArray)
})

test('a valid blog can be added ', async () => {
  const { title, author, url, likes } = helper.listWithOneBlog[0]
  const newBlog = { title, author, url, likes }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1)

  const titleQuery = blogsAtEnd.map(n => n.title)
  expect(titleQuery).toContain(
    helper.listWithOneBlog[0].title
  )
})

afterAll(async () => {
  await mongoose.connection.close()
})