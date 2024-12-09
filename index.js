const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const setupSwagger = require("./swagger/swagger");

const routes = require("./routes/index").routes;

dotenv.config();
const app = express();
connectDB();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(bodyParser.json());

app.use("/api/auth", routes.authRoutes);
app.use("/api/bookings", routes.bookingRoutes);

setupSwagger(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
