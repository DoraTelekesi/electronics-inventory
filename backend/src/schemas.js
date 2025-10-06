import Joi from "joi";

export const sparePartSchema = Joi.object({
  manufacturer: Joi.string().required(),
  model: Joi.string().required(),
  type: Joi.string().required(),
  depot: Joi.string().required(),
  amount: Joi.number().required().min(1),
  remarks: Joi.string(),
});

export const userRegisterSchema = Joi.object({
  username: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")).required(),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

