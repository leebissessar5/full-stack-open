import { useState, useEffect } from 'react'
import axios from 'axios'

const WeatherInfo = ({query}) => {
    const [weatherData, setWeatherData] = useState(null)
  
    useEffect(() => {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${process.env.REACT_APP_API_KEY}`)
      .then(response => {
        setWeatherData({
          'temperature': response.data.main.temp,
          'icon': response.data.weather[0].icon,
          'wind': response.data.wind.speed
        })
      })
    }, [query])
  
    if (!weatherData) {
      return null
    }
  
    return (
    <div>
        <h2>Weather in {query}</h2>
        <p>temperature {weatherData.temperature} Celsius</p>
        <img src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} alt="openweather weather icon" />
        <p>wind {weatherData.wind} m/s</p>
    </div>
  )}
  
const CountryInfo = ({country}) => {
    const flagStyle = {
        width: '15%'
    }

    return (
    <div>
            <h1>{country.name}</h1>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <h3>languages:</h3>
            {country.languages.length > 0 ? (
              <ul>
                {country.languages.map((lang, id) => (<li key={id}>{lang}</li>))}
              </ul>
            ) : (
              <p>No languages found.</p>
            )}

            <img style={flagStyle} src={country.flags.svg} alt={country.flags.alt} />
            <WeatherInfo query={country.capital}/>
    </div>
)}

export default CountryInfo
