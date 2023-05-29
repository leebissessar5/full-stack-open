const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'User name must be longer than 3 characters'],
        required: [true, 'User name required']
    },
    number: {
        type: String,
        minLength: [8, 'Phone number must be longer than 8 characters!'],
        validate: {
          validator: function(v) {
            return /^\d{2,3}-\d+$/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!
          \nMust contain at least 2-3 digits followed by \'-\' followed by additional digits.
          \nMust also only contain digits `
        },
        required: [true, 'Phone number required']
    }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)