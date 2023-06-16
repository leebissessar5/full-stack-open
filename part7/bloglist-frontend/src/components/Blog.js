import { useState } from 'react'

const Blog = ({ blog, user, likesHandler, deleteHandler }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
          <div>
            <div>{blog.url}</div>
            <div>
              likes {blog.likes}{' '}
              {user && <button onClick={likesHandler}>like</button>}
            </div>
            <div>{blog.user.name}</div>
            {user && user.username === blog.user.username && (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Remove blog ${blog.title} by ${blog.author}?`
                    )
                  ) {
                    deleteHandler()
                  }
                }}
              >
                remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog
