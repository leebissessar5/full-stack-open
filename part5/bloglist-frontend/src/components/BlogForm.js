import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog)

    setNewBlog({
      title: '',
      author: '',
      url: ''
    })
  }

  return (
    <form onSubmit={addBlog}>
      <h2>create new</h2>
      <div>
          title:
        <input
          type="text"
          value={newBlog.title}
          name="Title"
          onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
          placeholder='write Blog title here'
          id='title-field'
        />
      </div>
      <div>
          author:
        <input
          type="text"
          value={newBlog.author}
          name="Author"
          onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
          placeholder='write Blog author here'
          id='author-field'
        />
      </div>
      <div>
          url:
        <input
          type="text"
          value={newBlog.url}
          name="URL"
          onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
          placeholder='write Blog url here'
          id='url-field'
        />
      </div>
      <button id='create-button' type="submit">create</button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm