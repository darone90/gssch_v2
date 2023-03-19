import {Router} from 'express';
import UserController from '../controllers/User.controller';

const userRouter = Router()

userRouter
  .get('/', UserController.isLoggedIn)
  .post('/', UserController.login)
  .get('/logout', UserController.logout)
  .patch('/password',/* auth middleware, validation*/ UserController.passwordChange)
  .patch('/login',/*auth middleware  validation*/ UserController.logginChange)
  .get('/users', /*auth md */UserController.usersList)
  .post('/user', /*auth middleware wit admin competence validation*/ UserController.addUser)
  .delete('/user'/*auth middleware */, UserController.deleteUser)

export default userRouter;