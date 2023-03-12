import { User } from '../Entities/User.entity';
import { Role } from '../Entities/Role.entity';
import { hashPassword } from '../services/cryptoService';

class UserController {
  
  async addAdminUser(name: string, password: string):Promise<string> {
    const hash = await hashPassword(password);
    const role = await Role.findOne({
      where: {
        role: "ADMIN"
      }
    })
    const admin = new User();
    admin.login = name;
    admin.hash = hash;
    admin.role = role as Role;

    await admin.save();

    return admin.id;
  }

}

export default new UserController;