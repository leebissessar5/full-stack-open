import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticLine = ({text, value, percent}) => 
  <tr>
    <td>{text}</td> 
    <td>{value} {percent && '%'}</td>
  </tr>

const Statistics = ({good, neutral, bad}) => {
  const positive = 100 * good / (good + neutral + bad)
  const score = (good * 1 + neutral * 0 + bad * -1) / (good + neutral + bad)

  if (good === 0 && bad === 0 && neutral === 0) {
    return <div>No feedback given</div>
  }
  return (<table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={good + neutral + bad} />
        <StatisticLine text="average" value={score} />
        <StatisticLine text="positive" value={positive} percent={true}/>
      </tbody>
  </table>)
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" handleClick={() => setGood(good + 1)} />
      <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" handleClick={() => setBad(bad + 1)} />

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App