import { hash, compare } from 'bcrypt';
import { User } from '../Entities/User.entity';
import {v4 as uuid} from 'uuid';
import { sign } from "jsonwebtoken";

export const hashPassword = async (password: string):Promise<string> => {
  const hashedPassword: string = await hash(password, 10);
  return hashedPassword
}

export const comparePassword = async (userPassword: string, databasePassword: string):Promise<boolean> => {
  const result: boolean = await compare(userPassword, databasePassword);
  return result;
}

export const generateToken = async ():Promise<string> => {
  let token:string;
  let tokenExist: User | null
  do {
    token = uuid();
    tokenExist = await User.findOne({
      where: {
        token
      }
    })
  } while (!!tokenExist)

  return token
}

export const createJWT = async () => {
  const token = await generateToken();
  const payload = {token};
  const expiresIn = 1000 * 60 * 60 * 24;
  const access = sign(payload, process.env.TOKEN as string, {expiresIn})
  return {
    token,
    jwt: {
      access,
      expiresIn
    }
  }

}

