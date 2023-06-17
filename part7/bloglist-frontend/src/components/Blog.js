import { useMatch } from 'react-router-dom'
import blogService from '../services/blogs'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { useNotificationDispatch } from './NotificationContext'
import { useNavigate } from 'react-router-dom'

const Blog = ({ user }) => {
  const navigate = useNavigate()
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

  const match = useMatch('/blogs/:id')

  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery('blogs', blogService.getAll)

  if (isLoading) {
    return <div>Loading blog...</div>
  }

  if (isError) {
    return <div>Error loading blog</div>
  }

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
    navigate('/')
  }

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  return (
    <div className="blog">
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes
        {user && <button onClick={() => handleLikes(blog)}>like</button>}
      </div>
      <div>added by {blog.user.name}</div>
      <div>
        {user && user.username === blog.user.username && (
          <button
            onClick={() => {
              if (
                window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
              ) {
                handleDelete(blog)
              }
            }}
          >
            remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog
