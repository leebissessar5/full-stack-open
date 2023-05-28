import axios from 'axios'
const baseUrl = 'api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}
  
const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const remove = (idToRemove) => axios.delete(`${baseUrl}/${idToRemove}`)

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const personService = { getAll, create, remove, update }

export default personService