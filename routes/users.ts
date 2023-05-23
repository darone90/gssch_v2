import {Router} from 'express';
import UserController from '../controllers/User.controller';
import userDataValidation from '../middlewares/userValidationMiddleware';
import authMiddleware from '../middlewares/userAuthMiddleware';

const userRouter = Router()

userRouter
  .get('/', UserController.isLoggedIn)
  .post('/', UserController.login)
  .get('/logout', UserController.logout)
  .patch('/password', authMiddleware(), userDataValidation("password"), UserController.passwordChange)
  .patch('/login', authMiddleware(), userDataValidation("login"), UserController.logginChange)

export default userRouter;