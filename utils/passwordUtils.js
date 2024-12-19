const bcrypt = require("bcryptjs");

const hashPassword = async (pass) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pass, salt);
  } catch (error) {
    console.log(error.message);
    throw new Error("Ошибка при хешировании пароля!");
  }
};

const comparePassword = async (pass, hash) => {
  return await bcrypt.compare(pass, hash);
};

module.exports = { hashPassword, comparePassword };
