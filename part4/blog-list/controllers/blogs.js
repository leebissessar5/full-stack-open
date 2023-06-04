const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blog = await Blog.find({})
  response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog
    .findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

module.exports = blogsRouter