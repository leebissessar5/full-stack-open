import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: ""
  })
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  const showNotification = (notification, setNotification) => {
    setNotification(notification)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
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
  }, [])

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const addBlog = async (event) => {
    event.preventDefault()
  
    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog({
        title: "",
        author: "",
        url: ""
      })
  
      showNotification(`a new blog ${newBlog.title} by ${newBlog.author} successfully added`, setInfoMessage)
    } catch (error) {
      showNotification("Failed to add new blog", setErrorMessage)
    }
  }  

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <h2>create new</h2>
      <div>
        title:
          <input
          type="text"
          value={newBlog.title}
          name="Title"
          onChange={({ target }) => setNewBlog({...newBlog, title: target.value})}
        />
      </div>
      <div>
        author:
          <input
          type="text"
          value={newBlog.author}
          name="Author"
          onChange={({ target }) => setNewBlog({...newBlog, author: target.value})}
        />
      </div>
      <div>
        url:
          <input
          type="text"
          value={newBlog.url}
          name="URL"
          onChange={({ target }) => setNewBlog({...newBlog, url: target.value})}
        />
      </div>
      <button type="submit">create</button>
    </form>  
  )

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

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  return (
    <div>
      <Notification message={errorMessage} type="error"/>
      <Notification message={infoMessage}  type="info"/>
      {!user && loginForm()}
      <h2>blogs</h2>
      {user && loginInfo()}
      <Togglable buttonLabel="create note">
        {blogForm()}
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App