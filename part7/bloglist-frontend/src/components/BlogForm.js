import { useState } from 'react'
import PropTypes from 'prop-types'
import { Typography, TextField, Button, Box } from '@mui/material'

const BlogForm = ({ createBlog, onAdd }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog)

    setNewBlog({
      title: '',
      author: '',
      url: '',
    })
    if (onAdd) {
      onAdd()
    }
  }

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
      onSubmit={addBlog}
    >
      <Typography variant="h6" component="h2" sx={{ marginTop: '20px' }}>
        create new
      </Typography>
      <TextField
        type="text"
        label="Title"
        value={newBlog.title}
        onChange={({ target }) =>
          setNewBlog({ ...newBlog, title: target.value })
        }
        placeholder="Write Blog title here"
        id="title-field"
        variant="outlined"
        size="small"
        sx={{ width: '40%' }}
      />
      <TextField
        type="text"
        label="Author"
        value={newBlog.author}
        onChange={({ target }) =>
          setNewBlog({ ...newBlog, author: target.value })
        }
        placeholder="Write Blog author here"
        id="author-field"
        variant="outlined"
        size="small"
        sx={{ width: '40%' }}
      />
      <TextField
        type="text"
        label="URL"
        value={newBlog.url}
        onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
        placeholder="Write Blog URL here"
        id="url-field"
        variant="outlined"
        size="small"
        sx={{ width: '40%' }}
      />
      <Button
        variant="contained"
        type="submit"
        sx={{ width: '10px', marginBottom: '10px' }}
      >
        add
      </Button>
    </Box>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm
