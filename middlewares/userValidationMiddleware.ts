import { NextFunction, Request, Response } from "express"
import ValidationError from "../errors/validationError";
import { UserDTO } from "../ts"

type ToValidate = "password" | "login" | null;

const userDataValidation = (toValidate: ToValidate = null) => {
  return (req: Request, res: Response, next: NextFunction):void => {
    const { login, password, newValue } = req.body as UserDTO
  
    if(login.length < 4) {
      throw new ValidationError("login must have at least 4 characters", "USER VALIDATOR")
    }
    if(password.length < 6) {
      throw new ValidationError("password must have at least 6 characters", "USER VALIDATOR")
    }
    if(toValidate) {
      if(toValidate === "password" && (!newValue || newValue.length < 6)) {
        throw new ValidationError("new password must have at least 6 characters", "USER VALIDATOR")
      }
      if(toValidate === "login" && (!newValue || newValue.length < 4)) {
        throw new ValidationError("new login must have at least 4 characters", "USER VALIDATOR")
      }
    }
    next()
  }
}

export default userDataValidation;