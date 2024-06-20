import videoModel from "../models/videoModel.js"
import questionModel from "../models/questionModel.js"

import slugify from "slugify"
import multer from "multer"
import path from "path"

// Configuración de multer para guardar archivos en la carpeta 'video'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'video');
  },
  filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

//registrar video libre y sin preguntas
export const createVideoController = async (req, res) => {
    try {

        const { name, description, duration, free } = req.body

        //validaciones
        if(!name){
          return res.status(401).send({ error: 'name is required' })
        } if(!description){
          return res.status(401).send({ error: 'description is required' })
        }if(!duration){
          return res.status(401).send({ error: 'duration is required' })
        }if(!free){
          return res.status(401).send({ error: 'status is required' }) 
        }if(!req.file) {
          return res.status(401).send({ error: 'video is required' });
        }

        //save
        const video = await new videoModel({
          slug: slugify(name), 
          name, 
          description, 
          duration, 
          free, 
          videoPath: req.file.path,
          preguntas: []
        }).save()

        //confirmacion
        res.status(200).send({
          success: true,
          message: "Video register successfully",
          video
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error in Registeration",
          error
        })
    }
}

//Obtener un video con las preguntas
export const singleVideoController = async (req, res) => {
  try {

    const { id } = req.params
    const video = await videoModel.findById( id ).populate('preguntas').exec();

    if (!video) { // Maneja el caso donde no se encuentra ninguna clase con el slug dado
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }
    res.status(200).send({
      success: true,
      message: "Get Single Video Successfully",
      video
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single video error"
    });
  }
}

//Obtener todos los videos libres
export const videoLibreController = async (req, res) => {
  try {

    const video = await videoModel.find({ free: true })//El true es porque no esta asociado a una clase

    if (!video) { // Maneja el caso donde no se encuentra ninguna clase con el slug dado
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }
    res.status(200).send({
      success: true,
      message: "Get Free Videos Successfully",
      video
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Free Videos Error"
    });
  }
}

//Obtener todos los videos 
export const videoController = async (req, res) => {
  try {
    const video = await videoModel.find({});
    res.status(200).send({
      success: true,
      message: "All video List",
      video
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all video",
    })
  }
}

//Actualizar video "falta eliminar el video de la base"
export const updateVideoController = async (req, res) => {
  try{
    const { _id } = req.body
    const { name } = req.body
    const { description } = req.body
    const { duration } = req.body
    const { free } = req.body
    const { videoPath } = req.body
    const { pregunta } = req.body

    const video = await videoModel.findByIdAndUpdate(
      _id,
      {
        name, 
        slug: slugify(name),
        description,
        duration,
        free,
        videoPath,
        pregunta
      },
      { new: true }
    )
    res.status(200).send({
      success: true,
      messsage: "Video Updated Successfully",
      video,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while Updating video",
    });
  }
}

//Es para crear preguntas
export const updateVideoPreguntaController = async (req, res) => {
  try{
    const { _id } = req.body
    const { preguntas } = req.body

    // Validar si se proporcionaron preguntas
    if (!preguntas || !Array.isArray(preguntas) || preguntas.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty preguntas array provided' });
    }

    // Crear las preguntas y guardar sus IDs
    const preguntasIds = [];
    for (const preguntaData of preguntas) {
        const nuevaPregunta = new questionModel(preguntaData);
        const preguntaGuardada = await nuevaPregunta.save();
        preguntasIds.push(preguntaGuardada._id);
    }
    
    // Agregar los IDs de las preguntas al video utilizando findByIdAndUpdate
    const video = await videoModel.findByIdAndUpdate(
      _id,
      { $push: { preguntas: { $each: preguntasIds } } },
      { new: true }
    );
    
    // Verificar si el video existe
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.status(200).send({
      success: true,
      messsage: "Video Updated Successfully",
      video,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while Updating video",
    });
  }
}

//Borrar Video falta el borrar el video de la memoria
export const deleteVideoController = async (req, res) => {
  try {
    const { id } = req.params
    await videoModel.findByIdAndDelete( id )
    res.status(200).send({
      success: true,
      message: "Video Deleted Successfully"
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while deleting clase",
      error
    })
  }
}

export { upload } // Exportar upload para usar en las rutas