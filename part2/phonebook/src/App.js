import { useState, useEffect } from 'react'
import personService from './services/person'

const Filter = ({filterName, filterChange}) => (
  <div>
    filter shown with <input value={filterName} onChange={filterChange}/>
  </div>
)

const PersonForm = (props) => (
  <form onSubmit={props.addPerson}>
    <div>name: <input value={props.name} onChange={props.nameChange}/></div>
    <div>number: <input value={props.number} onChange={props.numberChange}/></div>
    <div><button type="submit">add</button></div>
  </form>
)

const Persons = ({persons, deleteFcn}) => {
  return (
    <>
      {persons.map(person => 
      <div key={person.id}>
        {person.name} {person.number}
        <button onClick={() => deleteFcn(person.id, person.name)}> delete</button>
        </div>
        )}
    </> 
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    personService.getAll()
    .then(personsList => {
      setPersons(personsList)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const duplicatePerson = persons.find(person => person.name === newName)

    if (duplicatePerson) {
      alert(`${newName} is already added to the phonebook.`)
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
        id: persons.length + 1
      };
      personService.create(newPerson)
      .then(addedPerson => {
        setPersons(persons.concat(addedPerson))
        setNewName('')
        setNewNumber('')
      })
    }
  }
  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService.remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id));
      });
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