import { hash, compare } from 'bcrypt';

export const hashPassword = async (password: string):Promise<string> => {
  const hashedPassword: string = await hash(password, 10);
  return hashedPassword
}

export const comparePassword = async (userPassword: string, databasePassword: string):Promise<boolean> => {
  const result: boolean = await compare(userPassword, databasePassword);
  return result;
}

