const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blog = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = request.user

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
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user
  const blogToDelete = await Blog.findById(request.params.id)
  if (blogToDelete.user._id.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'Unauthorized operation' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = await Blog.findByIdAndUpdate(
    request.params.id, { ...body },
    { new: true , runValidators: true, context: 'query' }
  )
  response.json(blog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { id } = request.params
  const { comment } = request.body

  try {
    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    blog.comments = [...blog.comments, comment]
    const savedBlog = await blog.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    response.status(500).json({ error: 'Failed to add comment' })
  }
})

module.exports = blogsRouter