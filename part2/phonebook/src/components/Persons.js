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

export default Persons
