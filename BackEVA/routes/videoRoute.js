import express from 'express'
import {    createVideoController, 
            videoController, 
            singleVideoController, 
            videoLibreController, 
            updateVideoController, 
            upload, 
            deleteVideoController, 
            updateVideoPreguntaController 
        }
        from '../controllers/videoController.js'

//Router object
const router = express.Router()

//Routing
//Registrar video
router.post('/register', upload.single('video'),createVideoController)
//Obtener un video
router.get('/video/:id',singleVideoController)
//Obtener todos los videos que no pertenece a una clase
router.get('/videoLibres',videoLibreController)
//Obtener todos los videos
router.get('/video',videoController)
//Actualizar un video
router.put('/updateVideo',updateVideoController)
//Es para actualizar video y crear preguntas
router.put('/updatePreguntaVideo',updateVideoPreguntaController)
//delete video
router.delete("/deleteVideo/:_id", deleteVideoController);

export default router