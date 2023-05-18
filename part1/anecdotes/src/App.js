import { useState } from 'react'

const Section = ({header, anecdote, votes}) => (
  <>
    <h1>{header}</h1>
    <div>{anecdote}</div>
    <div>has {votes} votes</div>
  </>
)

const Button = ({text, handleClick}) => (
  <button onClick={handleClick}>{text}</button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const RandInt = (max) => Math.floor(Math.random() * max)
  const UpdateVotes = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array.from(anecdotes, () => 0));

  const maxVotes = Math.max(...votes)
  const maxVoted = anecdotes.filter((value, index) => votes[index] === maxVotes)[0]

  return (
    <div>
      <Section header="Anecdote of the day" anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button text="vote" handleClick={() => UpdateVotes()}/>
      <Button text="next anecdote" handleClick={() => setSelected(RandInt(anecdotes.length))} />
      <Section header="Anecdote with most votes" anecdote={maxVoted} votes={maxVotes} />
    </div>
  )
}

export default App