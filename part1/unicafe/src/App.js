import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = (props) => (
  <div>{props.text} {props.value}{props.percent && '%'}</div>
)

const App = () => {
  // save clicks of each button to its own state
  const labels = ["good", "neutral", "bad"]
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const positive = 100 * good / (good + neutral + bad)
  const score = (good * 1 + neutral * 0 + bad * -1) / (good + neutral + bad)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text={labels[0]} handleClick={() => setGood(good + 1)} />
      <Button text={labels[1]} handleClick={() => setNeutral(neutral + 1)} />
      <Button text={labels[2]} handleClick={() => setBad(bad + 1)} />

      <h1>statistics</h1>
      <Statistics text={labels[0]} value={good} />
      <Statistics text={labels[1]} value={neutral} />
      <Statistics text={labels[2]} value={bad} />
      <Statistics text="all" value={good + neutral + bad} />
      <Statistics text="average" value={score}/>
      <Statistics text="positive" value={positive} percent={true}/>
    </div>
  )
}

export default App