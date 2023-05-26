import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Country'

function App() {
  const [countriesFilter, setCountriesFilter] = useState('')
  const [countries, setCountries] = useState(null)

  const handleCountriesFilter = (event) => setCountriesFilter(event.target.value)

  const toggleCountryDisplay = (name) => {
    const country = countries.find(c => c.name === name)
    const changedCountry = { ...country, display: !country.display }
    setCountries(countries.map(country => country.name !== name ? country : changedCountry))
  }

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
          .map(country => {
            return {
              'name': country.name.common,
              'capital': country.capital,
              'area': country.area,
              'languages': country.languages ? Object.values(country.languages) : [], // Check if country.languages is defined
              'flags': country.flags,
              'display': false
            }
          })
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
      <Countries countries={countries} displayHandler={toggleCountryDisplay}/>
    </div>
  )
}

export default App
