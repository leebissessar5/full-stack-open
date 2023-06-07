import { useState } from 'react'

const BlogInfo = ({ url, likes, name }) => (
  <div>
    <div>{url}</div>
    <div>likes {likes} <button>like</button></div>
    <div>{name}</div>
  </div>
)

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} 
        <button onClick={toggleVisibility}>
          {visible ? "hide" : "view"}
        </button>
      </div>
      {visible && <BlogInfo url={blog.url} likes={blog.likes} name={blog.user.name}/>}
  </div>
)}

export default Blog