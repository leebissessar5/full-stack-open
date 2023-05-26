import { useState, useEffect } from 'react'
import axios from 'axios'

const WeatherInfo = ({capital, weatherData}) => (
  <>
      <h2>Weather in {capital}</h2>
      <p>temperature {weatherData.temperature} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} alt="openweather weather icon" />
      <p>wind {weatherData.wind} m/s</p>
  </>
)

const CountryInfo = ({country}) => {
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${process.env.REACT_APP_API_KEY}`)
    .then(response => {
      setWeatherData({
        'temperature': response.data.main.temp,
        'icon': response.data.weather[0].icon,
        'wind': response.data.wind.speed
      })
    })
  }, [country.capital])

  const flagStyle = {
      width: '10%'
  }
  
  return (
  <div>
        <h1>{country.name}</h1>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
        <h3>languages:</h3>
        <ul>
          {country.languages.map(lang => <li key={lang}>{lang}</li>)}
        </ul>
        <img style={flagStyle} src={country.flags.svg} alt={country.flags.alt} />
        {weatherData && <WeatherInfo capital={country.capital} weatherData={weatherData} />}
  </div>
)}

const Country = ({country, toggleDisplay}) => {
  const label = country.display? "hide" : "show"
  return (
    <>
      <div>{country.name}<button onClick={toggleDisplay}>{label}</button></div>
      {country.display && <CountryInfo country={country} />}
    </>
  ) 
}

const Countries = ({countries, displayHandler}) => {
  if (!countries) {
    return null
  }
  else if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  else if (countries.length === 1) {
    return <CountryInfo country={countries[0]} />
  }
  return (
    <>
      {countries.map(country => 
      <Country 
        key={country.name} 
        country={country}  
        toggleDisplay={() => displayHandler(country.name)}
      />
      )}
    </>
  )
}

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
