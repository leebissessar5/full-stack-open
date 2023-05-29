require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.static('build'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
morgan.token('body', getBody = (req) => JSON.stringify(req.body))

app.use(morgan('tiny', {
  skip: (req, res) => req.method === 'POST'
}))

app.get("/api/persons", (request, response) => {
    Person.find({}).then(person => {
      response.json(person)
    })
})

app.get('/info', (request, response) => {
  const length = persons.length
  const date = new Date().toString()
  
  response.send(
    `<div>
      Phonebook info for ${length} people
    </div>
    </br>
    <div>
      ${date}
    </div>`
    )
})

app.get("/api/persons/:id", (request, response) => {
  Person
  .findById(request.params.id)
  .then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => Math.floor(Math.random()*100) + 1

app.post('/api/persons',
morgan(':method :url :status :res[content-length] - :response-time ms :body '),
(request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name field (person\'s full name) missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'number field (person\'s phone number) missing' 
    })
  }
  // needs mongoose implementation
  // if (persons.find(person => person.name === body.name)) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  const person = new Person({...body})

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})