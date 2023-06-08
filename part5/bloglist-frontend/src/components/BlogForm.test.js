import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm component testing', () => {
  test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('write Blog title here')
    const authorInput = screen.getByPlaceholderText('write Blog author here')
    const urlInput = screen.getByPlaceholderText('write Blog url here')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'testing title field...')
    await user.type(authorInput, 'testing author field...')
    await user.type(urlInput, 'testing url field...')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'testing title field...',
      author: 'testing author field...',
      url: 'testing url field...'
    })
  })

})