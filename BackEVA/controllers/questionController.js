import questionModel from "../models/questionModel.js";

//Registrar Pregunta
export const createQuestionController = async (req, res) => {
    try {
        const { questionText, options, time, pista } = req.body;

        // Validaciones
        if (!questionText) {
            return res.status(401).send({ error: 'questionText is required' });
        }

        // Guardar
        const question = await new questionModel({
            questionText,
            options, 
            time,
            pista
        }).save();

        // Confirmación
        res.status(200).send({
            success: true,
            message: "Question registered successfully",
            question
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

//Obtener un pregunta
export const singleQuestionController = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await questionModel.findById(id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "Get Single Question Successfully",
            question
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While getting Single question"
        });
    }
}

//Obtener todas las preguntas
export const questionController = async (req, res) => {
    try {
        const questions = await questionModel.find({});
        res.status(200).send({
            success: true,
            message: "All Question List",
            questions
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting all questions",
        });
    }
}