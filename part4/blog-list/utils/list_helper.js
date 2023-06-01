const lodash = require('lodash')

const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) =>
  blogs
    .reduce((sum, item) =>
      item.likes + sum, 0)

const favoriteBlog = (blogs) => {
  let favorite = null
  for (const blog of blogs) {
    if (!favorite || blog.likes > favorite.likes) {
      favorite = blog
    }
  }

  return favorite
    ? {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes,
    }
    : { }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return { }
  }
  // Count the number of blogs by author
  const blogCounts = lodash.countBy(blogs, 'author')

  // Find the author with the most blogs
  const topAuthor = lodash.maxBy(lodash.keys(blogCounts), (author) => blogCounts[author])

  return {
    author: topAuthor,
    blogs: blogCounts[topAuthor]
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs
}