import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import userService from '../services/users'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material'

const User = ({ user }) => (
  <TableRow>
    <TableCell>
      <Link to={`/users/${user.id}`}>{user.name}</Link>
    </TableCell>
    <TableCell sx={{ textAlign: 'right' }}>{user.blogs.length}</TableCell>
  </TableRow>
)

const UserList = () => {
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery('users', userService.getAll)

  if (isLoading) {
    return <div>Loading users...</div>
  }

  if (isError) {
    return <div>Error loading users</div>
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6">User</Typography>
            </TableCell>
            <TableCell sx={{ textAlign: 'right' }}>
              <Typography variant="h6">Blogs created</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <User key={user.id} user={user} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default UserList
