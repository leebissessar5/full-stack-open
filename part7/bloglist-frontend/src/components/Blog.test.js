import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog component tests', () => {
  const blog = {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: {
      username: 'test',
      name: 'test',
    },
  }

  const testUser = {
    username: 'robertmartin1',
    name: 'Robert Martin',
    password: 'password123',
  }

  test('renders content without url and likes by default', () => {
    const { container } = render(<Blog blog={blog} />)

    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(
      'Go To Statement Considered Harmful Edsger W. Dijkstra'
    )
  })

  test('clicking the button displays url and likes', async () => {
    const { container } = render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
    )
    expect(div).toHaveTextContent('likes 5')
  })

  test('Likes event handler called twice if pressed twice', async () => {
    const mockHandler = jest.fn()

    render(<Blog blog={blog} user={testUser} likesHandler={mockHandler} />)
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
