import { createSlice } from "@reduxjs/toolkit"

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
      return [...state, action.payload]
    },
    appendNote(state, action) {
      state.push(action.payload)
    }
  }
})


export const { addVote, createNote, appendNote } = anecdoteSlice.actions
export default anecdoteSlice.reducer