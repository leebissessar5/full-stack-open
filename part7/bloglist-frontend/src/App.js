import { useRef } from 'react'
import { useQueryClient } from 'react-query'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogList from './components/BlogList'
import UserList from './components/UserList'
import { useUserValue, useUserDispatch } from './components/UserContext'
import { useNotificationDispatch } from './components/NotificationContext'
import { Routes, Route, Link } from 'react-router-dom'
import UserView from './components/UserView'
import Blog from './components/Blog'
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from '@mui/material'

const App = () => {
  const togglableRef = useRef()
  const user = useUserValue()
  const setUser = useUserDispatch()

  const queryClient = useQueryClient()

  const notificationDispatch = useNotificationDispatch()

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser({ type: 'SET_USER', payload: user })
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

  const addBlog = async (blogObject) => {
    try {
      await blogService.create(blogObject)
      // Invalidate the 'blogs' query to trigger a refetch
      queryClient.invalidateQueries('blogs')

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
    setUser({ type: 'REMOVE_USER' })
    notificationDispatch({
      payload: 'Logged out',
      type: 'SET_INFO_MESSAGE',
    })
  }

  const loginInfo = () => (
    <div>
      <form onSubmit={handleLogout}>
        <div>
          <p style={{ margin: 0 }}>
            {user.name} logged in{' '}
            <Button type="submit" variant="outlined" color="inherit">
              Logout
            </Button>
          </p>
        </div>
      </form>
    </div>
  )

  return (
    <Container>
      {!user && (
        <>
          <Notification />
          <LoginForm handleLogin={handleLogin} />
        </>
      )}
      {user && (
        <>
          <AppBar position="static">
            <Toolbar
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '& > *': {
                    pr: 2,
                  },
                }}
              >
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  <Link
                    to="/"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    blogs
                  </Link>
                </Typography>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  <Link
                    to="/users"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    users
                  </Link>
                </Typography>
              </Box>
              <Box>{user && loginInfo()}</Box>
            </Toolbar>
          </AppBar>
          <Notification />

          <h2>blog app</h2>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Togglable buttonLabel="create new" ref={togglableRef}>
                    <BlogForm
                      createBlog={addBlog}
                      onAdd={() => togglableRef.current.toggleVisibility()}
                    />
                  </Togglable>
                  <BlogList />
                </>
              }
            />
            <Route path="/users" element={<UserList />} />
            <Route path="/blogs/:id" element={<Blog user={user} />}></Route>
            <Route path="/users/:id" element={<UserView />}></Route>
          </Routes>
        </>
      )}
    </Container>
  )
}

export default App
