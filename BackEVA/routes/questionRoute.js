import express from 'express'
import { createQuestionController, questionController, singleQuestionController } from '../controllers/questionController.js'

//Router object
const router = express.Router()

//Routing
//Registrar Pregunta
router.post('/register',createQuestionController)
//Obtener un pregunta
router.get('/pregunta/:id',singleQuestionController)
//Obtener todas las preguntas
router.get('/pregunta',questionController)
/*
//Actualizar una clase
router.put('/updateClase',updateClaseController)
*/
export default router