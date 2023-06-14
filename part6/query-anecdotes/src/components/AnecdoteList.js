import { useNotificationDispatch } from '../components/NotificationContext'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAll, updateItem } from '../requests'

const AnecdoteList = () => {

  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const updateAnecdoteMutation = useMutation(updateItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    }
  })

  const handleVote = (anecdote) => {
    console.log('vote')
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    dispatch({ type: 'DISPLAY', payload: `anecdote '${anecdote.content}' voted` })
  }

  const result = useQuery(
    'anecdotes',
    getAll,
    { retry: false }
  )

  if (result.isLoading ) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data
  const sortedAnecdotes = anecdotes.slice().sort((a, b) => b.votes - a.votes)

  return (
    <>    
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList
