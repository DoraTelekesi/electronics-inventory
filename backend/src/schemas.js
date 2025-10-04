import Joi from "joi";

const sparePartSchema = Joi.object({
  manufacturer: Joi.string().required(),
  model: Joi.string().required(),
  type: Joi.string().required(),
  depot: Joi.string().required(),
  amount: Joi.number().required().min(1),
  remarks: Joi.string(),
});

export default sparePartSchema;
