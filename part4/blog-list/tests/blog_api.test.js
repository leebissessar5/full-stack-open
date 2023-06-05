const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

let token
let wrongToken

beforeAll(async () => {
  // Perform login to obtain the bearer token for the authorized user
  const credentials = {
    username: 'robertmartin1',
    password: 'password123'
  }

  const response = await api
    .post('/api/login')
    .send(credentials)

  token = response.body.token

  // Perform login to obtain the wrong bearer token for another user
  const wrongCredentials = {
    username: 'edsger',
    password: 'securepass'
  }

  const wrongResponse = await api
    .post('/api/login')
    .send(wrongCredentials)

  wrongToken = wrongResponse.body.token
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const user = await User.findOne({ username: 'robertmartin1' })
  const blogObjects = helper.blogs.map(blog => new Blog({ ...blog, user: user._id }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
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
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Checked if added
    const blogsAtEnd = await helper.blogsInDb()
    const titleQuery = blogsAtEnd.map(n => n.title)
    expect(titleQuery).toContain(helper.listWithOneBlog[0].title)

    // Even if duplicate entry
    expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1)
  })

  test('blog without likes is defaulted to 0', async () => {
    const { title, author, url } = helper.listWithOneBlog[0]
    const newBlog = { title, author, url }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send({ author, url, likes })
      .expect(400)

    // send without url
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    // check if size reduced
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    // check if blog is gone
    const title = blogsAtEnd.map(r => r.title)
    expect(title).not.toContain(blogToDelete.title)
  })

  test('fails with status code 401 if authorization token is from the wrong user', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${wrongToken}`)
      .expect(401)

    // blogs were not deleted
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })
})

describe('modification of an existing blog', () => {
  test('modify a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToModify = { ...blogsAtStart[0], likes: 10 }

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