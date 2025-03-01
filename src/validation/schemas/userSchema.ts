import Joi from 'joi';

export const userSchema = Joi.object({
   email: Joi.string()
      .email({ tlds: { allow: false } }) 
      .required()
      .messages({
         'string.email': 'Invalid email format',
         'any.required': 'Email is required'
      }),
   password: Joi.string()
      .min(6)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      .required()
      .messages({
         'string.min': 'Password must be at least 6 characters',
         'string.pattern.base': 'Password must contain uppercase, lowercase, numbers, and special characters',
         'any.required': 'Password is required'
      }),
   username: Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
         'string.min': 'Username must be at least 3 characters',
         'string.max': 'Username cannot exceed 30 characters',
         'any.required': 'Username is required'
      }),
   profilePicture: Joi.string().uri().optional(),
   profession: Joi.string().max(50).optional(),
   bio: Joi.string().max(500).optional()
});