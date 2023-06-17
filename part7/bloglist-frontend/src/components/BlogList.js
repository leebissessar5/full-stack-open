import blogService from '../services/blogs'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material'

const BlogList = () => {
  const result = useQuery('blogs', blogService.getAll, { retry: false })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>blog service not available due to problems in server</div>
  }

  const blogs = result.data
  const sortedBlogs = blogs.slice().sort((a, b) => b.likes - a.likes)

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6">Blog</Typography>
            </TableCell>
            <TableCell sx={{ textAlign: 'right' }}>
              <Typography variant="h6">User</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedBlogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>
                <Link to={`/blogs/${blog.id}`}>
                  <Typography>{blog.title}</Typography>
                </Link>
              </TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                <Typography>{blog.user.name}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BlogList
