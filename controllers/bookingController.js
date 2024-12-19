const Table = require("../models/Table");
const Booking = require("../models/Booking");

// Получить доступные столы
exports.getAvailableTables = async (req, res) => {
  const { date, time } = req.query;

  // Валидация входных данных
  if (!date || !time) {
    return res
      .status(400)
      .json({ message: "Укажите дату и время для бронирования" });
  }

  const requestedTime = new Date(`${date}T${time}`);
  const startLimit = new Date(`${date}T12:00`);
  const endLimit = new Date(`${date}T22:00`);

  if (requestedTime < startLimit || requestedTime >= endLimit) {
    return res
      .status(400)
      .json({ message: "Бронирование возможно только с 12:00 до 22:00" });
  }

  try {
    // Находим все активные бронирования на указанное время
    const bookings = await Booking.find({
      startTime: { $lte: requestedTime },
      endTime: { $gt: requestedTime },
    }).select("table");

    const bookedTableIds = bookings.map((booking) => booking.table.toString());

    // Находим доступные столы
    const availableTables = await Table.find({
      _id: { $nin: bookedTableIds },
    });

    const result = availableTables.map((table) => ({
      table: table.number,
      seats_count: table.capacity,
    }));

    res.json({ booking: result });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

exports.createBooking = async (req, res) => {
  const { tableNumber, date, time } = req.body;
  const userId = req.user.id; // Получаем ID пользователя из токена

  const startTime = new Date(`${date}T${time}`);
  const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

  const startLimit = new Date(`${date}T12:00`);
  const endLimit = new Date(`${date}T22:00`);

  // Проверяем, что время в пределах допустимого интервала
  if (startTime < startLimit || endTime > endLimit) {
    return res
      .status(400)
      .json({ message: "Бронирование возможно только с 12:00 до 22:00" });
  }

  try {
    // Проверяем, существует ли стол
    const table = await Table.findOne({ number: tableNumber });
    if (!table) {
      return res.status(404).json({ message: "Указанный стол не найден" });
    }

    // Проверяем наличие пересекающихся бронирований
    const overlappingBooking = await Booking.findOne({
      table: table._id,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (overlappingBooking) {
      return res
        .status(400)
        .json({ message: "Стол уже забронирован на это время" });
    }

    // Создаем бронирование
    const booking = new Booking({
      table: table._id,
      user: userId,
      startTime,
      endTime,
    });

    await booking.save();

    res.status(201).json({
      message: "Бронирование успешно создано",
      bookingId: booking._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  const userId = req.user.id;

  try {
    const bookings = await Booking.find({ user: userId })
      .populate("table", "number")
      .select("startTime endTime");

    const result = bookings.map((booking) => ({
      id: booking._id,
      table: booking.table.number,
      date: booking.startTime.toISOString().split("T")[0],
      time: `${booking.startTime
        .toISOString()
        .split("T")[1]
        .slice(0, 5)}-${booking.endTime
        .toISOString()
        .split("T")[1]
        .slice(0, 5)}`,
    }));

    res.json({ booking: result });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Бронирование не найдено" });
    }

    if (booking.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Вы не можете отменить это бронирование" });
    }

    const now = new Date();
    const oneHourBefore = new Date(
      booking.startTime.getTime() - 60 * 60 * 1000
    );

    if (now > oneHourBefore) {
      return res.status(400).json({
        message: "Бронирование можно отменить не позднее, чем за час до начала",
      });
    }

    await booking.deleteOne();
    res.json({ message: "Бронирование успешно отменено" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body;

  const newStartTime = new Date(`${date}T${time}`);
  const newEndTime = new Date(newStartTime.getTime() + 2 * 60 * 60 * 1000);

  try {
    const booking = await Booking.findById(id).populate("table");

    if (!booking) {
      return res.status(404).json({ message: "Бронирование не найдено" });
    }

    const overlappingBooking = await Booking.findOne({
      table: booking.table._id,
      _id: { $ne: booking._id },
      startTime: { $lt: newEndTime },
      endTime: { $gt: newStartTime },
    });

    if (overlappingBooking) {
      return res
        .status(400)
        .json({ message: "Новое время недоступно для бронирования" });
    }

    booking.startTime = newStartTime;
    booking.endTime = newEndTime;

    await booking.save();
    res.json({ message: "Бронирование успешно изменено" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};
