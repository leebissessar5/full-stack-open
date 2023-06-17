import { useQuery } from 'react-query'
import { useMatch } from 'react-router-dom'
import userService from '../services/users'
import { Box, Typography, Paper, List, ListItem } from '@mui/material'

const UserView = () => {
  const match = useMatch('/users/:id')

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery('users', userService.getAll)

  if (isLoading) {
    return <div>Loading user...</div>
  }

  if (isError) {
    return <div>Error loading user</div>
  }

  const user = match ? users.find((user) => user.id === match.params.id) : null

  return (
    <Box>
      <Typography variant="h4" component="h2" sx={{ marginBottom: '1rem' }}>
        {user.name}
      </Typography>
      <Typography variant="h5" component="h3" sx={{ marginBottom: '0.5rem' }}>
        added blogs
      </Typography>
      <Paper sx={{ padding: '1rem' }}>
        <List>
          {user.blogs.map((blog) => (
            <ListItem
              key={blog.id}
              sx={{ borderRadius: '8px', marginBottom: '0.5rem' }}
            >
              {blog.title}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  )
}

export default UserView
