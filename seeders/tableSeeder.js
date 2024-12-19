const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Table = require("../models/Table");

dotenv.config();

const tables = [
  { number: 1, capacity: 2 },
  { number: 2, capacity: 2 },
  { number: 3, capacity: 2 },
  { number: 4, capacity: 2 },
  { number: 5, capacity: 2 },
  { number: 6, capacity: 2 },
  { number: 7, capacity: 2 },
  { number: 8, capacity: 3 },
  { number: 9, capacity: 3 },
  { number: 10, capacity: 3 },
  { number: 11, capacity: 3 },
  { number: 12, capacity: 3 },
  { number: 13, capacity: 3 },
  { number: 14, capacity: 6 },
  { number: 15, capacity: 6 },
  { number: 16, capacity: 6 },
];

const seedTables = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB подключена");

    await Table.deleteMany();
    await Table.insertMany(tables);
    console.log("Таблицы добавлены в базу данных");
    process.exit();
  } catch (error) {
    console.error("Ошибка при добавлении таблиц:", error);
    process.exit(1);
  }
};

seedTables();
