require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.static('build'))

let persons = []

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
  const date = new Date().toString()

  Person.find({}).then(person => {   
      response.send(
        `<div>
          Phonebook info for ${person.length} people
        </div>
        </br>
        <div>
          ${date}
        </div>`
      )
  })
})

app.get("/api/persons/:id", (request, response, next) => {
  Person
  .findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    }
    else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = { ...body }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})