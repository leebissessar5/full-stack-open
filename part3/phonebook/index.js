require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.static('build'))

app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan('tiny', {
  skip: (req) => req.method === 'POST'
}))

app.get('/api/persons', (request, response) => {
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

app.get('/api/persons/:id', (request, response, next) => {
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
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = { ...body }

  Person.findByIdAndUpdate(
    request.params.id, person,
    { new: true , runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons',
  morgan(':method :url :status :res[content-length] - :response-time ms :body '),
  (request, response, next) => {
    const body = request.body

    // Check if a person with the same name already exists
    Person.findOne({ name: body.name })
      .then(existingPerson => {
        if (existingPerson) {
          return response.status(400).json({
            error: 'Name must be unique'
          })
        }

        const person = new Person({ ...body })

        person.save()
          .then(savedPerson => {
            response.json(savedPerson)
          })
          .catch(error => next(error))
      })
      .catch(error => next(error))
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