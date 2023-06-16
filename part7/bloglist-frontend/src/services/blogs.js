import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const config = (token) => ({ headers: { Authorization: token } })

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, config(token))
  return response.data
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const updateItem = async (blogObject) => {
  const response = await axios.put(
    `${baseUrl}/${blogObject.id}`,
    blogObject,
    config(token)
  )
  return response.data
}

const removeItem = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, config(token))
  return response.data
}

const blogService = {
  getAll,
  create,
  setToken,
  updateItem,
  removeItem,
}
export default blogService
