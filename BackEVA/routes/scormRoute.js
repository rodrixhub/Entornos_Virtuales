import express from 'express'
import { exportScorm } from '../controllers/scormController.js'

//Router object
const router = express.Router()

//Routing
router.get('/export/:id', exportScorm);

export default router;