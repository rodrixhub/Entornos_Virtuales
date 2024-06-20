import claseModel from "../models/claseModel.js"

import slugify from "slugify"

//registrar clase
export const createClaseController = async (req, res) => {
    try {

        const { name, description, videoIds } = req.body
        
        //validaciones
        if(!name){
          return res.send({ error: 'name is required' })
        } if(!description){
          return res.send({ error: 'description is required' })
        }if (!Array.isArray(videoIds)) {
          return res.status(400).send({ error: 'videoIds must be an array' });
        }

        //save
        const clase = await new claseModel({
          slug: slugify(name), name, description, videos: videoIds
        }).save()

        //confirmacion
        res.status(200).send({
          success: true,
          message: "Clase register successfully",
          clase
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

//Obtener una clase
export const singleClaseController = async (req, res) => {
  try {

    const { id } = req.params
    const clase = await claseModel.findById( id )

    if (!clase) { // Maneja el caso donde no se encuentra ninguna clase con el slug dado
      return res.status(404).json({
        success: false,
        message: "Clase not found"
      });
    }
    res.status(200).send({
      success: true,
      message: "Get Single Clase Successfully",
      clase
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single clase error",
    });
  }
}

//Obtener todas las clases 
export const claseController = async (req, res) => {
  try {
    const clase = await claseModel.find({});
    res.status(200).send({
      success: true,
      message: "All clase List",
      clase
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all clase"
    })
  }
}

//Actualizar clase
export const updateClaseController = async (req, res) => {
  try{
    const { _id } = req.body
    const { name } = req.body
    const { description } = req.body
    const { videos } = req.body

    const clase = await claseModel.findByIdAndUpdate(
      _id,
      {
        name,
        slug: slugify(name),
        description,
        videos
      },
      { new: true }
    )
    res.status(200).send({
      success: true,
      messsage: "Clase Updated Successfully",
      clase,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating clase",
    });
  }
}
