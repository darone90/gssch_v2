import {Router} from 'express';
import UserController from '../controllers/User.controller';
import userDataValidation from '../middlewares/userValidationMiddleware';

const userRouter = Router()

userRouter
  .get('/', UserController.isLoggedIn)
  .post('/', UserController.login)
  .get('/logout', UserController.logout)
  .patch('/password'/* auth middleware*/,userDataValidation("password"), UserController.passwordChange)
  .patch('/login',/*auth middleware*/userDataValidation("login"), UserController.logginChange)
  .get('/users', /*auth md */UserController.usersList)
  .post('/user', /*auth middleware wit admin competence*/userDataValidation() , UserController.addUser)
  .delete('/user'/*auth middleware */, UserController.deleteUser)

export default userRouter;