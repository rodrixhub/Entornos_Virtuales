import attemptModel from "../models/attemptModel.js";

// Registrar Intento
export const createAttemptController = async (req, res) => {
    try {
        const { userId, questionId } = req.body;

        // Validaciones
        if (!userId ) {
            return res.status(401).send({ error: 'userId are required' });
        }if(!questionId){
            return res.status(401).send({ error: 'questionIdare required' });
        }
        
        // Guardar
        const attempt = await new attemptModel({
            userId,
            questionId
        }).save();

        // Confirmación
        res.status(200).send({
            success: true,
            message: "Attempt registered successfully",
            attempt
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error
        });
    }
}

// Obtener un Intento por _id
export const singleAttemptController = async (req, res) => {
    try {
        const { id } = req.params;
        const attempt = await attemptModel.findById(id);

        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: "Attempt not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "Get Single Attempt Successfully",
            attempt
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting Single Attempt"
        });
    }
}

// Obtener un Intento por id user y id question
export const singleAttemptUserQuestionController = async (req, res) => {
    try {
        const { userId, questionId } = req.body;

        // Validaciones
        if (!userId || !questionId) {
            return res.status(400).send({ error: 'userId and questionId are required' });
        }

        // Buscar intento
        const attempt = await attemptModel.findOne({ userId, questionId });

        if (!attempt || attempt.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Attempt not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "Get Single Attempt Successfully",
            attempt
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting Single Attempt"
        });
    }
}

// Obtener un Intento por id pregunta
export const singleAttemptQuestionController = async (req, res) => {
    try {
        const { id } = req.params;
        const attempt = await attemptModel.find({ questionId: id });

        if (!attempt || attempt.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Attempt not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "Get Single Attempt Successfully",
            attempt
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting Single Attempt"
        });
    }
}

// Obtener todos los Intentos
export const attemptController = async (req, res) => {
    try {
        const attempts = await attemptModel.find({});
        res.status(200).send({
            success: true,
            message: "All Attempt List",
            attempts
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting all attempts",
        });
    }
}

//Cambiar la cantidad de intentos y guardar la respuesta seleccionada
export const attemptPutController = async (req, res) => {
    try {
        const { _id, respuestaSeleccionada } = req.body;

        // Validaciones
        if (!_id) {
            return res.status(400).send({ error: '_id is required' });
        }

        console.log( respuestaSeleccionada)
        // Actualización
        const attempt = await attemptModel.findByIdAndUpdate(
            _id,
            {
                $inc: { intentosActuales: 1 },
                $push: { respuestasSeleccionadas: respuestaSeleccionada }
            },
            { new: true }
        );

        if (!attempt) {
            return res.status(404).send({
                success: false,
                message: "Attempt not found"
            });
        }

        res.status(200).send({
            success: true,
            message: "Attempts Updated Successfully",
            attempt
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while Updating Attempts"
        });
    }
};