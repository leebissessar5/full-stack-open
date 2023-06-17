# Blog List Backend

This is the backend server for the Blog List application. It provides RESTful APIs for managing blog posts and user authentication.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Bcrypt.js

## Getting Started

Follow the instructions below to get the backend server up and running on your local machine.

### Prerequisites

Make sure you have the following software installed:

- Node.js: [Download and Install Node.js](https://nodejs.org)
- MongoDB: [Download and Install MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. Clone the repository:

   ```shell
   git clone <repository-url>
   ```

2. Install the dependencies:

   ```shell
   cd blog-list
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the root directory of the project.
   - Specify the following environment variables in the `.env` file:

     ```shell
     PORT=<port-number>
     MONGODB_URI=<mongodb-connection-string>
     SECRET=<jwt-secret>
     ```

   - Replace `<port-number>` with the desired port number for the server.
   - Replace `<mongodb-connection-string>` with the connection string to your MongoDB instance.
   - Replace `<jwt-secret>` with a secret key for JWT token generation.

### Usage

1. Start the server:

   ```shell
   npm start
   ```

   The server will start running at the specified port.

2. You can now send HTTP requests to the following endpoints:

   - `GET /api/blogs`: Get all blogs
   - `POST /api/blogs`: Create a new blog
   - `GET /api/blogs/:id`: Get a specific blog by ID
   - `PUT /api/blogs/:id`: Update a specific blog by ID
   - `DELETE /api/blogs/:id`: Delete a specific blog by ID
   - `POST /api/blogs/:id/comments`: Place a comment on a specific blog
   - `POST /api/users`: Create a new user
   - `POST /api/login`: Authenticate user and receive a JWT token

### License

This project is licensed under the [Apache License 2.0](LICENSE).