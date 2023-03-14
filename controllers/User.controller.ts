import { User } from '../Entities/User.entity';
import { Request, Response } from 'express';
import { Role } from '../Entities/Role.entity';
import { hashPassword, comparePassword, createJWT } from '../services/cryptoService';
import { verify } from 'jsonwebtoken';
import { en } from '../locale/controllers/User.disctionary'

import { Token, UserDTO } from '../ts';
import HTTPError from '../errors/httpError';

class UserController {
  async addUser(req: Request, res: Response): Promise<void> {
    const { login, password } = req.body as UserDTO;
    try {
      const checkUser = await User.findOne({
        where: {
          login,
        },
      });

      if (checkUser) {
        res.status(409).json({ info: en.userExist });
        return;
      }
      const hash = await hashPassword(password);
      const role = await Role.findOne({
        where: {
          role: 'USER',
        },
      });
      const newUser = new User();
      newUser.login = login;
      newUser.hash = hash;
      newUser.role = role as Role;
      await newUser.save();
      res.status(201).json({ info: en.userAdded, id: newUser.id }); // json z wszystkimi informacjami
    } catch (error) {
      throw new HTTPError(500, error.message, en.CONTROLLER, 'add user');
    }
  }

  async login(req: Request, res: Response): Promise<void> {
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
      res.json({ info: en.loginOK, id: user.id });
    } catch (error) {
      throw new HTTPError(500, error.message, en.CONTROLLER, 'login');
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const jwt = req.cookies.jwt;
      if (!jwt) {
        res.json({ info: en.loginNoUser });
        return;
      }
      const token = verify(jwt, process.env.TOKEN as string) as Token;
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

  async deleteUser(req: Request, res: Response): Promise<void> {
    const { login } = req.body as UserDTO;
    try {
      const user = await User.findOne({
        where: {
          login,
        },
      });
      if (!user) {
        res.status(404).json({ info: en.loginNotFound });
        return;
      }
      await user.remove();
      res.json({ info: en.userDeleted });
    } catch (error) {
      throw new HTTPError(500, error.message, en.CONTROLLER, 'delete user');
    }
  }

  async passwordChange(req: Request, res: Response): Promise<void> {
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

  async logginChange(req: Request, res: Response): Promise<void> {
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

  async isLoggedIn(req: Request, res: Response): Promise<void> {
    const jwt = req.cookies.jwt;
    try {
      if (!jwt) {
        res.status(401).json({ info: en.loginFalse });
        return;
      }
      const token = verify(jwt, process.env.TOKEN as string) as Token; 
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

  async addAdminUser(name: string, password: string): Promise<string> {
    const hash = await hashPassword(password);
    const role = await Role.findOne({
      where: {
        role: 'ADMIN',
      },
    });
    const admin = new User();
    admin.login = name;
    admin.hash = hash;
    admin.role = role as Role;

    await admin.save();

    return admin.id;
  }

  async checkLoginAndPassword(res: Response, password: string, login: string): Promise<User | null> {
    const checkUser = await User.findOne({
      where: {
        login,
      },
    });
    if (!checkUser) {
      res.json({ info: en.loginNoExist });
      return null;
    }
    const checkPassword = await comparePassword(password, checkUser.hash);
    if (checkPassword) {
      res.json({ info: en.passwordNotCorrect });
      return null;
    }
    return checkUser;
  }
}

export default new UserController();
