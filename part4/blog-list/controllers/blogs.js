const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blog = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.user || !request.user.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const userId = request.user.id
  const user = await User.findById(userId)

  const blog = new Blog({
    ...request.body,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = await Blog.findByIdAndUpdate(
    request.params.id, { ...body },
    { new: true , runValidators: true, context: 'query' }
  )
  response.json(blog)
})

module.exports = blogsRouter