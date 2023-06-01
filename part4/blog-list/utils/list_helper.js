const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) =>
  blogs
    .reduce((sum, item) =>
      item.likes + sum, 0)

module.exports = {
  dummy, totalLikes
}