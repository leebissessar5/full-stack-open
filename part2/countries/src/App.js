import { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = ({countries}) => {
  if (!countries) {
    return null
  }
  else if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  else if (countries.length === 1) {
    const country = {
      'name': countries[0].name.common,
      'capital': countries[0].capital,
      'area': countries[0].area,
      'languages': Object.values(countries[0].languages),
      'flags': countries[0].flags
    }

    return (
      <>
        <h1>{country.name}</h1>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
        <ul>
          {country.languages.map(lang => <li key={lang}>{lang}</li>)}
        </ul>
        <img className="flag" src={country.flags.svg} alt={country.flags.alt} />
      </>
    )
  }
  return (
    <>
      {countries.map(country => {
        const name = country.name.common
        return <div key={name}>{name}</div>
      }
      )}
    </>
  )
}

function App() {
  const [countriesFilter, setCountriesFilter] = useState('')
  const [countries, setCountries] = useState(null)

  const handleCountriesFilter = (event) => setCountriesFilter(event.target.value)

  useEffect(() => {
    axios
    .get("https://studies.cs.helsinki.fi/restcountries/api/all")
    .then(response => {
      if (countriesFilter.length === 0) {
        setCountries(null)
      }
      else {
        setCountries(response.data
          .filter(country => country.name.common.toLowerCase().includes(countriesFilter.toLowerCase()))
        )
      }
    })
  }, [countriesFilter])

  return (
    <div>
      <form>
        find countries
        <input value={countriesFilter} onChange={handleCountriesFilter}/>
      </form>
      <Countries countries={countries} />
    </div>
  )
}

export default App
