# Phonebook API <!-- omit in toc -->

This is the documentation for the Phonebook API. It provides endpoints for managing a phonebook with person entries. The API is deployed on Render at https://phonebook-backend-jom2.onrender.com.

# Table of Contents <!-- omit in toc -->
- [Getting Started](#getting-started)
- [Endpoints](#endpoints)
  - [List all Persons](#list-all-persons)
  - [Get a Person by ID](#get-a-person-by-id)
  - [Add a New Person](#add-a-new-person)
  - [Delete a Person](#delete-a-person)
- [Additional Information](#additional-information)

## Getting Started

To get started with the Phonebook API, you can use any HTTP client or tool of your choice, such as cURL, Postman, or JavaScript's ```fetch()```.

Base URL: [phonebook-backend](https://phonebook-backend-jom2.onrender.com/api)

## Endpoints

### List all Persons

**URL:** ```/persons```

**Method:** GET

**Response:** JSON array containing all the persons in the phonebook.

**Example:**
```http
GET /api/persons
```

**Response:**
```json
[
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
  // ...
]
```

### Get a Person by ID

**URL:** ```/persons/:id```

**Method:** GET

**Response:** JSON object representing the person with the specified ID.

**Example:**
```http
GET /api/persons/1
```

**Response:**
```json
{
  "id": 1,
  "name": "Arto Hellas",
  "number": "040-123456"
}
```

### Add a New Person

**URL:** ```/persons```

**Method:** POST

**Request Body:** JSON object representing the person to be added. The object must have ```name``` and ```number``` properties.

**Example:**
```http
POST /api/persons

{
  "name": "John Doe",
  "number": "123-456789"
}
```

**Response:** JSON object representing the newly added person, including the assigned ```id```.json
```json
{
  "id": 5,
  "name": "John Doe",
  "number": "123-456789"
}
```

### Delete a Person

**URL:** ```/persons/:id```

**Method:** DELETE

**Response:** No content (204 status code) if the person was successfully deleted.

**Example:**
```http
DELETE /api/persons/3
```

## Additional Information

The API also provides an ```/info``` endpoint that displays basic information about the phonebook.

**URL:** ```/info```

**Method:** GET

**Response:** Text containing the phonebook's total number of people and the current date.

**Example:**
```http
GET /api/info
```

**Response:**
```sql
Phonebook info for 4 people

Tue May 28 2023 09:00:00 GMT+0000 (Coordinated Universal Time)
```