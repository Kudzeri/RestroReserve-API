const express = require("express");
const {
  getAvailableTables,
  createBooking,
  getUserBookings,
  cancelBooking,
  updateBooking,
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Управление бронированием столов
 */

router.get("/tables", authMiddleware, getAvailableTables);
/**
 * @swagger
 * /api/bookings/tables:
 *   get:
 *     summary: Получить доступные столы
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Дата бронирования в формате YYYY-MM-DD
 *       - in: query
 *         name: time
 *         schema:
 *           type: string
 *           format: time
 *         required: true
 *         description: Время бронирования в формате HH:mm
 *     responses:
 *       200:
 *         description: Список доступных столов
 *       400:
 *         description: Неверные параметры
 *       500:
 *         description: Ошибка сервера
 */

router.post("/", authMiddleware, createBooking);
/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Создать бронирование
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tableNumber:
 *                 type: integer
 *                 description: Номер стола
 *               date:
 *                 type: string
 *                 description: Дата бронирования (YYYY-MM-DD)
 *               time:
 *                 type: string
 *                 description: Время бронирования (HH:mm)
 *     responses:
 *       201:
 *         description: Бронирование успешно создано
 *       400:
 *         description: Ошибка валидации
 *       500:
 *         description: Ошибка сервера
 */

router.get("/", authMiddleware, getUserBookings);
/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Получить бронирования текущего пользователя
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список бронирований
 *       500:
 *         description: Ошибка сервера
 */

router.delete("/:id", authMiddleware, cancelBooking);
/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Отменить бронирование
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID бронирования
 *     responses:
 *       200:
 *         description: Бронирование успешно отменено
 *       404:
 *         description: Бронирование не найдено
 *       500:
 *         description: Ошибка сервера
 */

router.put("/:id", authMiddleware, updateBooking);
/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Изменить бронирование
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID бронирования
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 description: Новая дата бронирования (YYYY-MM-DD)
 *               time:
 *                 type: string
 *                 description: Новое время бронирования (HH:mm)
 *     responses:
 *       200:
 *         description: Бронирование успешно изменено
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Бронирование не найдено
 *       500:
 *         description: Ошибка сервера
 */

module.exports = router;
