const bcrypt = require("bcryptjs");

const hashPassword = async (pass) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pass, salt);
  } catch (error) {
    console.log(error);
  }
};

const comparePassword = async (pass, hash) => {
  try {
    return await bcrypt.compare(pass, hash);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { hashPassword, comparePassword };
