import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelpers.js";
import JWT from "jsonwebtoken";

// Controlador para registrar usuario
export const registerUserController = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Validaciones
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered. Please login",
      });
    }

    // Registrar usuario
    const hashedPassword = await hashPassword(password);
    const user = new userModel({
      email,
      name,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

// Controlador para login de usuario
export const loginController = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Validaciones
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }
  
      // Verificar usuario
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Email is not registered",
        });
      }
  
      // Generar token JWT
      const token = JWT.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.status(200).json({
        success: true,
        token,
        userId: user._id,
        role: user.role,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error in login",
        error: error.message,
      });
    }
  };

// Controlador para obtener usuario por ID
export const getUserByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (id.length === 24) {
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).json({
          message: "No user found with that ID",
        });
      }

      const { password, __v, ...rest } = user._doc;
      res.status(200).json({
        success: true,
        message: "User found successfully",
        user: rest,
      });
    } else {
      res.status(400).json({ message: "Invalid ID format" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving user",
      error: error.message,
    });
  }
};

// Controlador para obtener usuario por email
export const getUserByEmailController = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error retrieving user",
      error: error.message,
    });
  }
};

// Controlador para actualizar usuario
export const updateUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { id } = req.params;

    const updates = { name, email };
    if (password) {
      updates.password = await hashPassword(password);
    }

    const user = await userModel.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};
