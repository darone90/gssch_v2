import { NextFunction, Request, Response } from 'express';
import ValidationError from '../errors/validationError';
import { UserDTO } from '../ts';
import UserValidator from '../validators/User.validator';

type ToValidate = 'password' | 'login';

const userDataValidation = (toValidate: ToValidate) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { newValue } = req.body as UserDTO;
    try {
      if (!newValue) throw new ValidationError('new value is required', 'USER VALIDATOR');
      if (toValidate === 'password' && !UserValidator(null, newValue)) {
        throw new ValidationError('new password must have at least 6 characters', 'USER VALIDATOR');
      }
      if (toValidate === 'login' && !UserValidator(newValue, null)) {
        throw new ValidationError('new login must have at least 4 characters', 'USER VALIDATOR');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default userDataValidation;
