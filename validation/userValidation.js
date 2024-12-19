const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(16).required().messages({
    "string.base": "Имя пользователя должно быть строкой",
    "string.empty": "Имя пользователя не может быть пустым",
    "string.min": "Имя пользователя должно содержать не менее 3-х символов",
    "string.max": "Имя пользователя должно содержать не более 16-ти символов",
    "any.required": "Имя пользователя обязательно для заполнения",
  }),
  email: Joi.string().min(6).max(64).email().required().messages({
    "string.base": "E-mail должен быть строкой",
    "string.empty": "E-mail не может быть пустым",
    "string.email": "E-mail должен быть валидным",
    "string.min": "E-mail должен содержать не менее 6-ти символов",
    "string.max": "E-mail должен содержать не более 64-ти символов",
    "any.required": "E-mail обязательно для заполнения",
  }),
  password: Joi.string().min(6).max(16).required().messages({
    "string.base": "Пароль должен быть строкой",
    "string.empty": "Пароль не может быть пустым",
    "string.min": "Пароль должен содержать не менее 6-ти символов",
    "string.max": "Пароль должен содержать не более 16-ти символов",
    "any.required": "Пароль обязательно для заполнения",
  }),
  phone: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Телефон должен содержать только цифры и быть длиной от 10 до 15 символов",
      "any.required": "Телефон обязателен для заполнения",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email должен быть строкой",
    "string.email": "Некорректный формат email",
    "any.required": "Email обязателен для заполнения",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Пароль должен быть строкой",
    "string.min": "Пароль должен содержать минимум 6 символов",
    "any.required": "Пароль обязателен для заполнения",
  }),
});

module.exports = { registerSchema, loginSchema };
