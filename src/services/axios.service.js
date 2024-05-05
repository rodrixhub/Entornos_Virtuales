import axios from 'axios'
import BACKENDURL from '../utils/backendUrl.js'

const shopAPI = axios.create({ baseURL: `${BACKENDURL}/api`})

export default shopAPI