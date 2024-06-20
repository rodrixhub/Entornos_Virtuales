import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  intentosActuales: {
    type: Number,
    default: 0
  },
  respuestasSeleccionadas: [{  // Cambiado a un array de strings
    type: String,
    required: true
  }]
}, { timestamps: true });

export default mongoose.model("Attempt", attemptSchema);
