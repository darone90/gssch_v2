import vorpalService from "../services/vorpalService";
import UserController  from "../controllers/User.controller";
import gsschDataSource from '../database/connection';


export default {
  name: 'user:list',
  description: 'shows users list',
  action: async function (_: any, callback: any) {
    try {
      await gsschDataSource.initialize();
      const userList = await UserController.usersList();
      vorpalService.log(`---id------------------------------ : ----login---- : --------created---`, 'info')
      userList.forEach(user => vorpalService.log(`${user.id} : ${user.login} : ${user.created_at}`, 'info'))
      await gsschDataSource.destroy();
      callback();
    } catch (error) {
      vorpalService.log(`${error.message}`, 'error');
      await gsschDataSource.destroy();
      callback();
    }
  },
};