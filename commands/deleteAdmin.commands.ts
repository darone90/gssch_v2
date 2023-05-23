import vorpalService from "../services/vorpalService";
import UserController  from "../controllers/User.controller";
import gsschDataSource from '../database/connection';


export default {
  name: 'user:delete',
  description: 'Delete user account by login',
  action: async function (_: any, callback: any) {
    const login = (await vorpalService.getValueFromInput(this, 'login', 'login of user to delete:')) as string;
    try {
      await gsschDataSource.initialize();
      const id = await UserController.deleteUser(login);
      vorpalService.log(`User with id: ${id} was deleted from database`, 'succes');
      await gsschDataSource.destroy();
      callback();
    } catch (error) {
      vorpalService.log(`${error.message}`, 'error');
      await gsschDataSource.destroy();
      callback();
    }
  },
};