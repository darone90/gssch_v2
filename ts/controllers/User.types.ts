import { JwtPayload } from "jsonwebtoken";

export interface UserDTO {
  login: string;
  password: string;
  newValue?: string;
}

export interface Token extends JwtPayload {
  token: string;
}