import { useNotificationDispatch } from './NotificationContext'
import blogService from '../services/blogs'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import Blog from './Blog'

const BlogList = ({ user }) => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const updateBlogMutation = useMutation(blogService.updateItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })
  const removeBlogMutation = useMutation(blogService.removeItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  const handleLikes = (blog) => {
    updateBlogMutation.mutate({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      id: blog.id,
    })
    dispatch({
      type: 'SET_INFO_MESSAGE',
      payload: `blog '${blog.title}' liked`,
    })
  }

  const handleDelete = (blog) => {
    removeBlogMutation.mutate(blog.id)
    dispatch({
      type: 'SET_INFO_MESSAGE',
      payload: `blog '${blog.title}' deleted`,
    })
  }

  const result = useQuery('blogs', blogService.getAll, { retry: false })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>blog service not available due to problems in server</div>
  }

  const blogs = result.data
  const sortedBlogs = blogs.slice().sort((a, b) => b.likes - a.likes)

  return (
    <>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          likesHandler={() => handleLikes(blog)}
          deleteHandler={() => handleDelete(blog)}
        />
      ))}
    </>
  )
}

export default BlogList
