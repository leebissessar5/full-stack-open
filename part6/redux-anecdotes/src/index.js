import React from 'react'
import ReactDOM from 'react-dom/client'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import App from './App'

import anecdoteReducer, { appendNote } from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'
import anecdoteService from './services/anecdotes'

const store = configureStore(
  {
    reducer:
    {
      anecdotes: anecdoteReducer,
      filter: filterReducer,
      notification: notificationReducer
    }
  }
)

anecdoteService.getAll()
  .then(anecdotes =>
    anecdotes.forEach(anecdote => {
      store.dispatch(appendNote(anecdote))
    })
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)