import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin(username, password)
    setUsername('')
    setPassword('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#1976d2',
          borderRadius: '8px',
          padding: '30px',
        }}
      >
        <label
          htmlFor="username"
          style={{ color: '#FFF', marginBottom: '10px' }}
        >
          Username
        </label>
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          id="username"
          style={{
            padding: '8px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#FFF',
            width: '100%',
          }}
        />
        <label
          htmlFor="password"
          style={{ color: '#FFF', marginBottom: '10px', marginTop: '10px' }}
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          id="password"
          style={{
            padding: '8px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#FFF',
            width: '100%',
          }}
        />
        <Button
          id="login-button"
          type="submit"
          variant="contained"
          style={{
            marginTop: '10px',
            backgroundColor: '#FFF',
            color: '#000',
          }}
        >
          Login
        </Button>
      </div>
    </form>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
}

export default LoginForm
