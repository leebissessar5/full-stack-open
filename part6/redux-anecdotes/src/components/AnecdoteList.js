import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(({ anecdotes, filter}) => {
        return filter.length === 0 
        ? anecdotes
        : anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    })
    const dispatch = useDispatch()
    const vote = (id) => { dispatch(addVote(id)) }

    const sortedAnecdotes = anecdotes
    .slice() // create a new copy of the array
    .sort((a, b) => b.votes - a.votes); // sort the copied array

    return (
        <>
            {sortedAnecdotes
            .map((anecdote) => (
            <div key={anecdote.id}>
                <div>{anecdote.content}</div>
                <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote.id)}>vote</button>
                </div>
            </div>
            ))}
        </>
    )
}

export default AnecdoteList