import vorpalService from "../services/vorpalService";
import UserController  from "../controllers/User.controller";
import gsschDataSource from '../database/connection';


export default {
  name: 'user:add',
  description: 'Create user account',
  action: async function (_: any, callback: any) {
    const login = (await vorpalService.getValueFromInput(this, 'login', 'new login:')) as string;
    const password = (await vorpalService.getValueFromInput(this, 'password', 'new password:')) as string;
    const confirmPassword = await vorpalService.getValueFromInput(this, 'confirmPassword', 'confirm password:');

    try {
      if(password !== confirmPassword) {
        throw new Error('Password and conformation have a different value')
      }
      await gsschDataSource.initialize();
      const user = await UserController.addUser({login, password});
      vorpalService.log(`User ${user.login} was created in database wit id: ${user.id}`, 'success');
      await gsschDataSource.destroy();
      callback();
    } catch (error) {
      vorpalService.log(`${error.message}`, 'error');
      await gsschDataSource.destroy();
      callback();
    }
  },
};