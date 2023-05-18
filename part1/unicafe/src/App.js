import { useState } from 'react'

const Button = ({text, handleClick}) => (
  <button onClick={handleClick}>{text}</button>
)

const StatisticLine = ({text, value, percent}) => 
  <tr>
    <td>{text}</td> 
    <td>{value} {percent && '%'}</td>
  </tr>

const Statistics = ({good, neutral, bad}) => {
  const total =  good + neutral + bad
  
  if (total === 0) {
    return <div>No feedback given</div>
  }

  const positive = 100 * good / total
  const score = (good * 1 + neutral * 0 + bad * -1) / total

  return (<table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={score} />
        <StatisticLine text="positive" value={positive} percent={true}/>
      </tbody>
  </table>)
}

const App = () => {
  // save clicks of each button to its own state
  const [clicks, setClicks] = useState({
    good: 0, neutral: 0, bad: 0
  })

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" handleClick={() => setClicks({...clicks, good: clicks.good + 1})} />
      <Button text="neutral" handleClick={() => setClicks({...clicks, neutral: clicks.neutral + 1})} />
      <Button text="bad" handleClick={() => setClicks({...clicks, bad: clicks.bad + 1})} />

      <h1>statistics</h1>
      <Statistics good={clicks.good} neutral={clicks.neutral} bad={clicks.bad} />
    </div>
  )
}

export default App