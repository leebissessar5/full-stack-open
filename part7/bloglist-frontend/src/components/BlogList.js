import blogService from '../services/blogs'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

const BlogList = () => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

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
    <>
      {sortedBlogs.map((blog) => (
        <p key={blog.id} style={blogStyle}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </p>
      ))}
    </>
  )
}

export default BlogList
