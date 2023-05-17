import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Stat = (props) => (
  <div>{props.text} {props.value}</div>
)

const App = () => {
  // save clicks of each button to its own state
  const labels = ["good", "neutral", "bad"]
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text={labels[0]} handleClick={() => setGood(good + 1)} />
      <Button text={labels[1]} handleClick={() => setNeutral(neutral + 1)} />
      <Button text={labels[2]} handleClick={() => setBad(bad + 1)} />

      <h1>statistics</h1>
      <Stat text={labels[0]} value={good} />
      <Stat text={labels[1]} value={neutral} />
      <Stat text={labels[2]} value={bad} />
    </div>
  )
}

export default App