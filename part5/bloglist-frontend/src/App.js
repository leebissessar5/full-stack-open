import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const togglableRef = useRef()
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const [user, setUser] = useState(null)

  const showNotification = (notification, setNotification) => {
    setNotification(notification)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (username, password) => {

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      showNotification('login success', setInfoMessage)
    } catch (exception) {
      showNotification('wrong username or password', setErrorMessage)
    }
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
    getBlogs()
  }, [])

  const addBlog = async (blogObject) => {
    try {
      await blogService.create(blogObject)
      getBlogs()

      showNotification(`a new blog ${blogObject.title} by ${blogObject.author} successfully added`, setInfoMessage)
    } catch (error) {
      showNotification('Failed to add new blog', setErrorMessage)
    }
  }

  const updateBlog = async (blog, id) => {
    await blogService.update(blog, id)
    getBlogs()
  }

  const removeBlog = async (id) => {
    await blogService.remove(id)
    getBlogs()
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginInfo = () => (
    <div>
      <form onSubmit={handleLogout}>
        <p>{user.name} logged in
          <button type="submit">logout</button></p>
      </form>
    </div>
  )

  const getBlogs = async () => {
    const allBlogs = await blogService.getAll()
    const sortedBlogs = allBlogs.sort((a, b) => b.likes - a.likes)
    setBlogs(sortedBlogs)
  }

  return (
    <div>
      <Notification message={errorMessage} type="error" />
      <Notification message={infoMessage} type="info" />
      {!user && <LoginForm handleLogin={handleLogin} />}
      {user && (
        <>
          <h2>blogs</h2>
          {loginInfo()}
          <Togglable buttonLabel="new blog" ref={togglableRef}>
            <BlogForm createBlog={addBlog} onAdd={() => togglableRef.current.toggleVisibility()}/>
          </Togglable>
          {blogs.map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              likesHandler={updateBlog}
              deleteHandler={removeBlog}
            />
          ))}
        </>
      )}
    </div>

  )
}

export default App