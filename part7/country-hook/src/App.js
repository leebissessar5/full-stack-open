import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => {
        if (name.length === 0) {
          setCountry(null)
        } else {
          const foundCountry = response.data.find(country =>
            country.name.common.toLowerCase().includes(name.toLowerCase())
          );
          
          if (foundCountry) {
            setCountry({
              found: true,
              data: {
                name: foundCountry.name.common,
                capital: foundCountry.capital,
                population: foundCountry.population,
                flag: foundCountry.flags.svg,
              },
            })
          } else {
            setCountry({
              found: false,
              data: null,
            })
          }
        }
      })
      .catch(error => {
        console.error("Error fetching country data:", error)
        setCountry(null)
      })
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App