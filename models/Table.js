const { number, required } = require("joi");
const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Table", TableSchema);
