import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogList from './components/BlogList'

import { useNotificationDispatch } from './components/NotificationContext'

const App = () => {
  const togglableRef = useRef()
  const [user, setUser] = useState(null)

  const notificationDispatch = useNotificationDispatch()

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      notificationDispatch({
        payload: 'login success',
        type: 'SET_INFO_MESSAGE',
      })
    } catch (exception) {
      notificationDispatch({
        payload: 'wrong username or password',
        type: 'SET_ERROR_MESSAGE',
      })
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

  const addBlog = async (blogObject) => {
    try {
      await blogService.create(blogObject)

      notificationDispatch({
        payload: `a new blog ${blogObject.title} by ${blogObject.author} successfully added`,
        type: 'SET_INFO_MESSAGE',
      })
    } catch (error) {
      notificationDispatch({
        payload: 'Failed to add new blog',
        type: 'SET_ERROR_MESSAGE',
      })
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginInfo = () => (
    <div>
      <form onSubmit={handleLogout}>
        <p>
          {user.name} logged in
          <button type="submit">logout</button>
        </p>
      </form>
    </div>
  )

  return (
    <div>
      <Notification />
      {!user && <LoginForm handleLogin={handleLogin} />}
      {user && (
        <>
          <h2>blogs</h2>
          {loginInfo()}
          <Togglable buttonLabel="new blog" ref={togglableRef}>
            <BlogForm
              createBlog={addBlog}
              onAdd={() => togglableRef.current.toggleVisibility()}
            />
          </Togglable>
          <BlogList user={user} />
        </>
      )}
    </div>
  )
}

export default App
