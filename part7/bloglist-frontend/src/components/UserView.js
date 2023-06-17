import { useQuery } from 'react-query'
import { useMatch } from 'react-router-dom'
import userService from '../services/users'

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
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserView
