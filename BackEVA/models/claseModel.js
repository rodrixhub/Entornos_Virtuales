import mongoose from "mongoose"

 const claseSchema = new mongoose.Schema({
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
      default: "clase"
    },
    videos: [{ 
      type: String
    }]
  },
  { timestamps: true }
);

export default mongoose.model("clase", claseSchema);
