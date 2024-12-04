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
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Маршруты для регистрации, авторизации и получения информации о пользователе
 */

router.post("/register", validationMiddleware(registerSchema), register);
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Имя пользователя
 *               email:
 *                 type: string
 *                 description: Адрес электронной почты
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *               phone:
 *                 type: string
 *                 description: Телефонный номер
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Пользователь уже существует
 *       500:
 *         description: Ошибка сервера
 */


router.post("/login", validationMiddleware(loginSchema), login);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *       404:
 *         description: Неверный email или пароль
 *       500:
 *         description: Ошибка сервера
 */


router.get("/me", authMiddleware, getCurrentUser); 
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получить данные текущего пользователя
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный ответ с данными пользователя
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */

module.exports = router;
