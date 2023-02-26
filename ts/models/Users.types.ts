export interface UserAttributes {
  id: number;
  salt: string;
  hash: string;
  login: string;
  token: string;
  role: string;
}