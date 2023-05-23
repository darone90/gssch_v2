import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Token } from '../ts';
import { User } from '../Entities/User.entity';

const authMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const jwt = req.cookies.jwt;
    if (!jwt) {
      res.status(401).json({ info: 'unauthorized' });
      return;
    }
    const token = verify(jwt.access, process.env.TOKEN as string) as Token;
    const user = await User.findOne({
      where: {
        token: token.token,
      },
    });
    if (!user) {
      res.status(401).json({ info: 'unauthorized' });
      return;
    }
    next();
  };
};

export default authMiddleware;
