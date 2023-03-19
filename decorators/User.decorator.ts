import { User } from "../Entities/User.entity";

interface ListDecorator {
  login: string;
  id: string;
}

export const userListDecorate = (users: User[]):ListDecorator[] => {
  const decoratedUserList = users.map((user) => {
    return {
      login: user.login,
      id:user.id
    }
  })

  return decoratedUserList;
}