import axios from 'axios'
import BACKENDURL from '../utils/backendUrl.js'

const eduAPI = axios.create({ baseURL: `${BACKENDURL}/api`})

export default eduAPI