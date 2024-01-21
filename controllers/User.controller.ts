import { User } from '../Entities/User.entity';
import { Request, Response } from 'express';
import { hashPassword, comparePassword, createJWT } from '../services/cryptoService';
import { verify } from 'jsonwebtoken';
import { en } from '../locale/controllers/User.disctionary'
import { Token, UserDTO } from '../ts';
import HTTPError from '../errors/httpError';
import vorpalService from '../services/vorpalService';
import UserValidator from '../validators/User.validator';
import { UserRepository } from '../repository/User.repository';

interface standardResponse {
  info: string,
  login?: string,
}

class UserController {
  addUser = async (user: UserDTO):Promise<User> => {
    const { login, password } = user;
    const dataCheck = UserValidator(login, password);
    try {
      if(!dataCheck) throw new Error(en.incorrectData);
      const checkUser = await UserRepository.getUserByLogin(login);
      if (checkUser) {
        throw new Error(en.userExist)
      }
      const hash = await hashPassword(password);
      const newUser = await UserRepository.addUser(login, hash);
      return newUser;
    } catch (error) {
      vorpalService.log(error, 'error');
    }
  }

  login = async (req: Request, res: Response):Promise<void> => {
    const { login, password } = req.body as UserDTO;
    try {
      const user = await this.checkLoginAndPassword(password, login);
      if (!user) {
        res.json(this.standardResponse(en.wrongPasswordOrLogin))
        return
      };
      const token = await createJWT();
      await UserRepository.login(user.id, token.token);
      res.cookie('jwt', token.jwt, {
        secure: false,
        domain: process.env.DOMAIN, 
        httpOnly: true,
      });
      res.json(this.standardResponse(en.loginOK, user.login));
    } catch (error) {
      throw new HTTPError(500, error.message, en.CONTROLLER, 'login');
    }
  }

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const jwt = req.cookies.jwt;
      if (!jwt) {
        res.json(this.standardResponse(en.loginNoUser));
        return;
      }
      const token = verify(jwt.access, process.env.TOKEN as string) as Token;
      const user = await UserRepository.getUserByToken(token.token);
      if (!user) {
        res.cookie('jwt', '').json(this.standardResponse(en.logout));
        return;
      }
      await UserRepository.login(user.id, null);

      res.cookie('jwt', '').json(this.standardResponse(en.logout));
    } catch (error) {
      throw new HTTPError(500, error.message, en.CONTROLLER, 'logout');
    }
  }

  deleteUser = async (login:string): Promise<string> => {
    try {
      const user = await UserRepository.getUserByLogin(login);
      if (!user) {
        throw new Error(en.loginNotFound)
      }
      const id = await UserRepository.deleteUser(user.id);
      return id;
    } catch (error) {
      vorpalService.log(error, 'error');
    }
  }

  passwordChange = async (req: Request, res: Response): Promise<void> => {
    const { password, login, newValue } = req.body as UserDTO;
    try {
      const user = await this.checkLoginAndPassword(password, login);
      if (!user) {
        res.json(this.standardResponse(en.wrongPasswordOrLogin));
        return;
      };
      const hash = await hashPassword(newValue as string);
      await UserRepository.updateUser(user.login, {hash});
      res.json(this.standardResponse(en.passwordChange, user.login));
    } catch (error) {
      throw new HTTPError(500, error.message, en.CONTROLLER, 'password change');
    }
  }

  logginChange = async (req: Request, res: Response): Promise<void> => {
    const { password, login } = req.body as UserDTO;
    try {
      const user = await this.checkLoginAndPassword(password, login);
      if (!user) {
        res.json(this.standardResponse(en.wrongPasswordOrLogin));
        return;
      };
      await UserRepository.updateUser(user.login, {login});
      res.json(this.standardResponse(en.loginChanged, user.login));
    } catch (error) {
      throw new HTTPError(500, error.message, en.CONTROLLER, 'password change');
    }
  }

  isLoggedIn = async (req: Request, res: Response): Promise<void> => {
    const jwt = req.cookies.jwt;
    
    try {
      if (!jwt) {
        res.json(this.standardResponse(en.loginFalse));
        return;
      }
      const token = verify(jwt.access, process.env.TOKEN as string) as Token;
       
      const user = await UserRepository.getUserByToken(token.token);
      if (!user) {
        res.json(this.standardResponse(en.loginFalse));
        return;
      }
      res.json(this.standardResponse(en.loginUser, user.login));
    } catch (error) {
      throw new HTTPError(500, error.message, en.CONTROLLER, 'login check');
    }
  }

  usersList = async ():Promise<User[]> => {
    try {
      const userList = await UserRepository.findAllUsers();
      return userList
    }catch(error) {
      vorpalService.log(error, 'error');
    }
  }

  checkLoginAndPassword = async (password: string, login: string): Promise<User | null> => {
    const checkUser = await UserRepository.getUserByLogin(login);
    if (!checkUser) {
      return null;
    }
    const checkPassword = await comparePassword(password, checkUser.hash);
    if (!checkPassword) {
      return null;
    }
    return checkUser;
  }

  standardResponse(info: string, login?: string):standardResponse {
    return {
      info,
      login: login ? login : null,
    }
  }
}

export default new UserController();
