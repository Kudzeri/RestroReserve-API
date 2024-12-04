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

// Получить доступные столы
router.get("/tables", authMiddleware, getAvailableTables);

// Создать бронирование
router.post("/", authMiddleware, createBooking);

// Получить бронирования пользователя
router.get("/", authMiddleware, getUserBookings);

// Отменить бронирование
router.delete("/:id", authMiddleware, cancelBooking);

// Изменить бронирование
router.put("/:id", authMiddleware, updateBooking);

module.exports = router;
