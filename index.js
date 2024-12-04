const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const routes = require("./routes/index").routes;

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", routes.authRoutes);
app.use("/api/bookings", routes.bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});

