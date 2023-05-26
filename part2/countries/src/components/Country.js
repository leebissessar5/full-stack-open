import React from "react"
import CountryInfo from "./CountryInfo"

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
        {countries.map((country, id) => 
        <Country 
            key={id} 
            country={country}  
            toggleDisplay={() => displayHandler(country.name)}
        />
        )}
        </>
    )
}

export default Countries
