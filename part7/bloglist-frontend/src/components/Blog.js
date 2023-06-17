import { useMatch } from 'react-router-dom'
import blogService from '../services/blogs'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { useNotificationDispatch } from './NotificationContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  Box,
  Typography,
  Link,
  Button,
  TextField,
  List,
  ListItem,
  Paper,
} from '@mui/material'

const Blog = ({ user }) => {
  const [commentInput, setCommentInput] = useState('')
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

  const addCommentMutation = useMutation(
    ([blogId, comment]) => blogService.addComment(blogId, comment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('blogs')
        setCommentInput('') // Clear comment input after successful comment addition
      },
    }
  )

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

  const handleCommentSubmit = (event) => {
    event.preventDefault()

    if (!commentInput) {
      dispatch({
        type: 'SET_ERROR_MESSAGE',
        payload: 'Comment cannot be empty',
      })
      return
    }

    addCommentMutation.mutate([blog.id, commentInput])

    dispatch({
      type: 'SET_INFO_MESSAGE',
      payload: 'Comment added',
    })
  }

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  return (
    <Box className="blog">
      <Typography variant="h4" component="h2" sx={{ marginBottom: '1rem' }}>
        {blog.title}
      </Typography>
      <Link
        href={blog.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ marginBottom: '1rem' }}
      >
        {blog.url}
      </Link>
      <Box sx={{ marginBottom: '1rem' }}>
        {blog.likes} likes
        {user && (
          <Button
            onClick={() => handleLikes(blog)}
            variant="contained"
            size="small"
            sx={{ marginLeft: '1rem' }}
          >
            Like
          </Button>
        )}
      </Box>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ marginBottom: '1rem' }}
      >
        added by {blog.user.name}
      </Typography>
      {user && user.username === blog.user.username && (
        <Button
          onClick={() => {
            if (
              window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
            ) {
              handleDelete(blog)
            }
          }}
          variant="contained"
          color="error"
          size="small"
          sx={{ marginBottom: '1rem' }}
        >
          Remove
        </Button>
      )}
      <Typography variant="h5" component="h3" sx={{ marginBottom: '0.5rem' }}>
        comments
      </Typography>
      <form onSubmit={handleCommentSubmit}>
        <TextField
          type="text"
          value={commentInput}
          onChange={(event) => setCommentInput(event.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          sx={{ marginBottom: '1rem' }}
        />
        <Button type="submit" variant="contained" size="small">
          Add Comment
        </Button>
      </form>

      {blog.comments && (
        <Paper sx={{ padding: '1rem', marginBottom: '1rem' }}>
          <List>
            {blog.comments.map((comment, idx) => (
              <ListItem key={idx}>{comment}</ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  )
}

export default Blog
