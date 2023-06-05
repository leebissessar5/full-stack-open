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
  const promiseArray2 = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray2)
})


describe('validate GET requests', () => {

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
})

describe('addition of a new blog', () => {

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

  test('blog without likes is defaulted to 0', async () => {
    const { title, author, url } = helper.listWithOneBlog[0]
    const newBlog = { title, author, url }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1)

    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toEqual(0)
  })

  test('blog without title or url is not added', async () => {
    const { title, author, url, likes } = helper.listWithOneBlog[0]

    // send without title
    await api
      .post('/api/blogs')
      .send({ author, url, likes })
      .expect(400)

    // send without url
    await api
      .post('/api/blogs')
      .send({ title, author, likes })
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.blogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.blogs.length - 1
    )

    const title = blogsAtEnd.map(r => r.title)

    expect(title).not.toContain(blogToDelete.title)
  })
})

describe('modification of an existing blog', () => {
  test('modify a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToModify = {
      ...blogsAtStart[0], likes: 10
    }

    await api
      .put(`/api/blogs/${blogToModify.id}`)
      .send(blogToModify)
      .expect(200)

    const blogsAfter = await helper.blogsInDb()
    const modifiedBlog = blogsAfter.find(blog => blog.id === blogToModify.id)

    expect(modifiedBlog.likes).toEqual(10)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})