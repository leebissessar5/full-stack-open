import { useMutation, useQueryClient } from 'react-query'
import { createNew } from "../requests"
import { useNotificationDispatch } from '../components/NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation(createNew)

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
    newAnecdoteMutation.mutate(content, {
      onSuccess: () => {
        queryClient.invalidateQueries('anecdotes')
        dispatch({ type: 'DISPLAY', payload: `You added "${content}"` })
      },
      onError: (error) => {
        dispatch({ type: 'DISPLAY', payload: error.response.data.error })
      }
    })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
