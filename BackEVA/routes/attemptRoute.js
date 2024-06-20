import express from 'express'
import { createAttemptController, attemptController, singleAttemptController, singleAttemptUserQuestionController, singleAttemptQuestionController, attemptPutController } from '../controllers/attemptController.js'

//Router object
const router = express.Router()

//Routing
//Registrar Pregunta
router.post('/register',createAttemptController)
//Obtener un pregunta por su _id
router.get('/Attempt/:id',singleAttemptController)
//Obtener un pregunta por su id user y id question
router.post('/Attemptuser',singleAttemptUserQuestionController)
//Obtener un pregunta por su id question
router.post('/AttemptQuestion',singleAttemptQuestionController)
//Obtener todas las preguntas
router.get('/Attempt',attemptController)
//Cambiar la cantidad de intentos y guardar la respuesta seleccionada
router.put('/AttemptPut',attemptPutController)
/*
//Actualizar una clase
router.put('/updateClase',updateClaseController)
*/
export default router