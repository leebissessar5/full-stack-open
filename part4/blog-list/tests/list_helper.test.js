const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

describe('dummy', () => {
  test('dummy returns one', () => {
    const result = listHelper.dummy([])
    expect(result).toBe(1)
  })
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(helper.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(helper.blogs)
    expect(result).toBe(5 + 7 + 12 + 10 + 2)
  })
})

describe('favorite blog', () => {
  test('when list is empty, return empty object',
    () => {
      const result = listHelper.favoriteBlog([ ])
      expect(result).toEqual({ })
    })

  test('when list has only one blog, return that blog',
    () => {
      const result = listHelper.favoriteBlog(helper.listWithOneBlog)
      const answer = {
        title: helper.listWithOneBlog[0].title,
        author: helper.listWithOneBlog[0].author,
        likes: helper.listWithOneBlog[0].likes
      }
      expect(result).toEqual(answer)
    }
  )

  test('of a bigger list is calculated right',
    () => {
      const result = listHelper.favoriteBlog(helper.blogs)
      const answer = {
        title: helper.blogs[2].title,
        author: helper.blogs[2].author,
        likes: helper.blogs[2].likes
      }
      expect(result).toEqual(answer)
    }
  )
})

describe('mostBlogs', () => {
  test('when list is empty, return empty object',
    () => {
      const result = listHelper.mostBlogs([ ])
      expect(result).toEqual({ })
    })

  test('when list has only one blog, return blog count of 1',
    () => {
      const result = listHelper.mostBlogs(helper.listWithOneBlog)
      const answer = {
        author: helper.listWithOneBlog[0].author,
        blogs: 1
      }
      expect(result).toEqual(answer)
    }
  )

  test('of a bigger list is calculated right',
    () => {
      const result = listHelper.mostBlogs(helper.blogs)
      const answer =  {
        author: 'Robert C. Martin',
        blogs: 3
      }
      expect(result).toEqual(answer)
    })
})

describe('mostLikes', () => {
  test('when list is empty, return empty object',
    () => {
      const result = listHelper.mostLikes([ ])
      expect(result).toEqual({ })
    })

  test('when list has only one blog, return blog count of 1',
    () => {
      const result = listHelper.mostLikes(helper.listWithOneBlog)
      const answer = {
        author: helper.listWithOneBlog[0].author,
        likes: 5
      }
      expect(result).toEqual(answer)
    }
  )

  test('of a bigger list is calculated right',
    () => {
      const result = listHelper.mostLikes(helper.blogs)
      const answer =  {
        author: 'Edsger W. Dijkstra',
        likes: 17
      }
      expect(result).toEqual(answer)
    })
})