import mongoose from "mongoose"

 const videoSchema = new mongoose.Schema({
    slug:{
      type: String,
      lowercase: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "video"
    },
    duration: {
      type: String,
      default: "00:00"
    },
    free:{//El true es porque no esta asociado a una clase y el false es porque esta asociado a un clase
      type: Boolean,
      required: true
    },
    videoPath: {
      type: String,
      required: true
    },
    preguntas: [{ //Son las preguntas con las diferentes respuestas y si es verdadero o falso
      type: mongoose.Schema.Types.ObjectId, // Tipo de referencia al ID del modelo pregunta
      ref: 'question' // Nombre del modelo al que hace referencia
    }]
  },
  { timestamps: true }
);

export default mongoose.model("video", videoSchema);
