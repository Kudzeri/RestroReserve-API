const express = require("express");
const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/authController");
const validationMiddleware = require("../validation/validationMiddleware");
const { registerSchema, loginSchema } = require("../validation/userValidation");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", validationMiddleware(registerSchema), register);
router.post("/login", validationMiddleware(loginSchema), login);
router.get("/me", authMiddleware, getCurrentUser); 

module.exports = router;
