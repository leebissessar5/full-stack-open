import { createSlice } from "@reduxjs/toolkit"

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    addVote(state, action) {
      const id = action.payload
      const anecdote = state.find(n => n.id === id)
      if (anecdote) {
        anecdote.votes += 1
      }
    },
    createNote(state, action) {
      return [...state, asObject(action.payload)]
    },
    appendNote(state, action) {
      state.push(action.payload)
    }
  }
})


export const { addVote, createNote, appendNote } = anecdoteSlice.actions
export default anecdoteSlice.reducer