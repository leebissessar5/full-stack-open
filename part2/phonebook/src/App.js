import { useState, useEffect } from 'react'
import personService from './services/person'
import Notification from './components/Notification'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)

  useEffect(() => {
    personService.getAll()
    .then(personsList => {
      setPersons(personsList)
    })
  }, [])

  const showNotification = (notification, setNotification) => {
    setNotification(notification)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const duplicatePerson = persons.find(person => person.name === newName)

    if (duplicatePerson) {
      if (duplicatePerson.number === newNumber) {
        alert(`${newName} is already added to the phonebook`)
      }
      else if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const updatedPerson = {...duplicatePerson, number: newNumber }
        personService.update(duplicatePerson.id, updatedPerson)
        .then(updatedPerson => {
          setPersons(persons.map(person =>
            person.id === updatedPerson.id ? updatedPerson : person
          ));
          showNotification(`Changed Phone Number of ${newName}`, setInfoMessage)
          setNewName('');
          setNewNumber('');
        })
        .catch(error => showNotification(error.response.data.error, setErrorMessage))
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
        id: persons.length + 1
      };
      personService.create(newPerson)
      .then(addedPerson => {
        setPersons(persons.concat(addedPerson))
        showNotification(`Added ${newName}`, setInfoMessage)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => showNotification(error.response.data.error, setErrorMessage))
    }
  }
  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService.remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch(error => 
        showNotification(`Information of ${name} has already been removed from server`, setErrorMessage)
      )
    }
  }
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setNameFilter(event.target.value)

  const filteredList = nameFilter.length === 0 
  ? persons 
  : persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={errorMessage} type="error"/>
      <Notification message={infoMessage}  type="info"/>

      <Filter filterName={nameFilter} filterChange={handleFilterChange} />

      <h2>add a new</h2>

      <PersonForm 
        name={newName} 
        nameChange={handleNameChange}
        number={newNumber}
        numberChange={handleNumberChange}
        addPerson={addPerson}
      />
      
      <h2>Numbers</h2>

      <Persons persons={filteredList} deleteFcn={deletePerson}/>
    </div>
  )
}

export default App