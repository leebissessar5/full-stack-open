import { createNote } from "../reducers/anecdoteReducer"
import { useDispatch } from "react-redux"
import { showNotification } from '../reducers/notificationReducer'

import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
    const dispatch = useDispatch()
  
    const addNote = async (event) => {
      event.preventDefault()
      const content = event.target.anecdote.value
      event.target.anecdote.value = ''
  
      const newAnecdote = await anecdoteService.createNew(content)
      dispatch(createNote(newAnecdote))
      dispatch(showNotification(`You added "${content}"`))
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={addNote}>
                <div><input name="anecdote"/></div>
                <button>create</button>
            </form>
        </>
    )
}

export default AnecdoteForm