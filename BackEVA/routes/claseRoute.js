import express from 'express'
import { createClaseController, singleClaseController, claseController, updateClaseController } from '../controllers/claseController.js'

//Router object
const router = express.Router()

//Routing
//Registrar clase
router.post('/register',createClaseController)
//Obtener una clase
router.get('/clase/:id',singleClaseController)
//Obtener todas las clases
router.get('/clase',claseController)
//Actualizar una clase
router.put('/updateClase',updateClaseController)

export default router