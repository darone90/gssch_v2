import vorpalService from "../services/vorpalService";
import UserController  from "../controllers/User.controller";
import gsschDataSource from '../database/connection';
import { User } from "../Entities/User.entity";

export default {
  name: 'useradd:admin',
  description: 'Create admin user account',
  action: async function (_: any, callback: any) {
    const login = (await vorpalService.getValueFromInput(this, 'login', 'new login:')) as string;
    const password = (await vorpalService.getValueFromInput(this, 'password', 'new password:')) as string;
    const confirmPassword = await vorpalService.getValueFromInput(this, 'confirmPassword', 'confirm password:');

    try {
      if(password !== confirmPassword) {
        throw new Error('Password and conformation have a different value')
      }
      await gsschDataSource.initialize();
      const checkLogin = await User.find({
        where: {
          login
        }
      })
      if(checkLogin.length > 0) {
        throw new Error('User with give login already exist in database')
      }
      const id = await UserController.addAdminUser(login, password);
      vorpalService.log(`User ${login} was created in database wit id: ${id}`, 'succes');
      await gsschDataSource.destroy();
      callback();
    } catch (error) {
      vorpalService.log(`${error.message}`, 'error');
      await gsschDataSource.destroy();
      callback();
    }
  },
};