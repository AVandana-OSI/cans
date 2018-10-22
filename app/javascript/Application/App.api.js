import axios from 'axios'
import { handleError } from './util/ApiErrorHandler'

export const appApi = axios.create({
  baseURL: process.env.CANS_BASE_PATH ? process.env.CANS_BASE_PATH + '/api' : '/api',
  timeout: 15000,
})

export const apiGet = path => {
  return appApi
    .get(path)
    .then(response => response.data)
    .catch(handleError)
}

export const apiPost = (path, data) => {
  return appApi
    .post(path, data)
    .then(response => response.data)
    .catch(handleError)
}

export const apiPut = (path, data) => {
  return appApi
    .put(path, data)
    .then(response => response.data)
    .catch(handleError)
}

export const apiDelete = path => {
  return appApi
    .delete(path)
    .then(response => response.data)
    .catch(handleError)
}

export const apiEndpoints = {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
}

export default apiEndpoints
