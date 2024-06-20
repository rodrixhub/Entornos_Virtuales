import mongoose from "mongoose";

const opcionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
}, { _id: false });

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [opcionSchema],
    validate: v => Array.isArray(v) && v.length > 0
  },
  time:{//Esta en segundos
    type: String,
    required: true,
    default: "0"
  },
  pista:{
    type:String,
    required: true,
    default: ""
  },
  intentosPermitidos: {
    type: Number,
    required: true,
    default: 1 // número predeterminado de intentos permitidos, si es necesario
  }
}, { timestamps: true });

export default mongoose.model("question", questionSchema);
