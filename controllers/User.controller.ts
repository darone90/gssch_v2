import { User } from '../Entities/User.entity';
import { Request, Response } from 'express';
import { hashPassword, comparePassword, createJWT } from '../services/cryptoService';
import { verify } from 'jsonwebtoken';
import { en } from '../locale/controllers/User.disctionary'
import { Token, UserDTO } from '../ts';
import HTTPError from '../errors/httpError';
import vorpalService from '../services/vorpalService';
import UserValidator from '../validators/User.validator';

class UserController {
  addUser = async (user: UserDTO):Promise<User> => {
    const { login, password } = user;
    const dataCheck = UserValidator(login, password);
    if(!dataCheck) throw new Error(en.incorrectData);
    try {
      const checkUser = await User.findOne({
        where: {
          login,
        },
      });
      if (checkUser) {
        throw new Error(en.userExist)
      }
      const hash = await hashPassword(password);
      const newUser = new User();
      newUser.login = login;
      newUser.hash = hash;
      await newUser.save();
      return newUser;
    } catch (error) {
      vorpalService.log(error, 'error');
    }
  }

  login = async (req: Request, res: Response):Promise<void> => {
    const { login, password } = req.body as UserDTO;
    try {
      const user = await this.checkLoginAndPassword(res, password, login);
      if (!user) return;
      const token = await createJWT();
      user.token = token.token;
      await user.save();
      res.cookie('jwt', token.jwt, {
        secure: false,
        domain: process.env.DOMAIN, 
        httpOnly: true,
      });
      res.json({ info: en.loginOK, login: user.login });
    } catch (error) {
      throw new HTTPError(500, error.message, en.CONTROLLER, 'login');
    }
  }

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const jwt = req.cookies.jwt;
      if (!jwt) {
        res.json({ info: en.loginNoUser });
        return;
      }
      const token = verify(jwt.access, process.env.TOKEN as string) as Token;
      const user = await User.findOne({
        where: {
          token: token.token,
        },
      });
      if (!user) {
        res.cookie('jwt', '').json({ info: en.logout });
        return;
      }
      user.token = null;
      await user.save();

      res.cookie('jwt', '').json({ info: en.logout });
    } catch (error) {
      throw new HTTPError(500, error.message, en.CONTROLLER, 'logout');
    }
  }

  deleteUser = async (login:string): Promise<string> => {
    try {
      const user = await User.findOne({
        where: {
          login,
        },
      });
      if (!user) {
        throw new Error(en.loginNotFound)
      }
      const id = user.id
      await user.remove();
      return id
    } catch (error) {
      vorpalService.log(error, 'error');
    }
  }

  passwordChange = async (req: Request, res: Response): Promise<void> => {
    const { password, login, newValue } = req.body as UserDTO;
    try {
      const user = await this.checkLoginAndPassword(res, password, login);
      if (!user) return;
      const hash = await hashPassword(newValue as string);
      user.hash = hash;
      await user.save();
      res.json({ info: en.passwordChange });
    } catch (error) {
      throw new HTTPError(500, error.message, en.CONTROLLER, 'password change');
    }
  }

  logginChange = async (req: Request, res: Response): Promise<void> => {
    const { newValue, password, login } = req.body as UserDTO;
    try {
      const user = await this.checkLoginAndPassword(res, password, login);
      if (!user) return;
      user.login = newValue as string;
      await user.save();
      res.json({ info: en.loginChanged });
    } catch (error) {
      throw new HTTPError(500, error.message, en.CONTROLLER, 'password change');
    }
  }

  isLoggedIn = async (req: Request, res: Response): Promise<void> => {
    const jwt = req.cookies.jwt;
    
    try {
      if (!jwt) {
        res.status(401).json({ info: en.loginFalse });
        return;
      }
      const token = verify(jwt.access, process.env.TOKEN as string) as Token; 
      const user = await User.findOne({
        where: {
          token: token.token,
        },
      });
      if (!user) {
        res.status(401).json({ info: en.loginFalse });
        return;
      }
      res.json({ info: en.loginUser, login: user.login });
    } catch (error) {
      throw new HTTPError(500, error.message, en.CONTROLLER, 'login check');
    }
  }

  usersList = async ():Promise<User[]> => {
    try {
      const userList = await User.find();
      return userList
    }catch(error) {
      vorpalService.log(error, 'error');
    }
  }

  checkLoginAndPassword = async (res: Response, password: string, login: string): Promise<User | null> => {
    const checkUser = await User.findOne({
      where: {
        login,
      },
    });
    if (!checkUser) {
      res
        .status(401)
        .json({ info: en.loginNoExist });
      return null;
    }
    
    const checkPassword = await comparePassword(password, checkUser.hash);
    if (!checkPassword) {
      res
        .status(401)
        .json({ info: en.passwordNotCorrect });
      return null;
    }
    return checkUser;
  }
}

export default new UserController();
