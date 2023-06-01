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


module.exports = {
  dummy, totalLikes, favoriteBlog
}