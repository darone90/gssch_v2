import { User } from '../Entities/User.entity';

interface UserData {
  hash?: string
  login?: string
}

export class UserRepository {

  static async getUserByLogin(login: string):Promise<User | null> {
    const user = await User.findOne({
      where: {
        login
      }
    });
    return user;
  }

  static async addUser(login: string, hash: string):Promise<User> {
    const user = new User();
    user.login = login;
    user.hash = hash;
    await user.save();

    return user;
  }

  static async getUserByToken(token: string):Promise<User> {
    const user = await User.findOne({
      where: {
        token
      }
    })
    return user;
  }

  static async deleteUser(id:string):Promise<string> {
    await User.delete(id);
    return id;
  }

  static async updateUser(login: string, userData: UserData):Promise<string | null> {
    const user = await User.findOne({
      where: {
        login
      }
    })
    if(!user) return null
    if(userData.login) user.login = userData.login;
    if(userData.hash) user.hash = userData.hash;
    return login;
  }

  static async login(id: string, token: string | null): Promise<string> {
    await User.update({id}, {token});
    return id;
  }

  static async findAllUsers (): Promise<User[]> {
    return await User.find();
  }
}