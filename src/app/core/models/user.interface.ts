import {RoleInterface} from "./role.interface";

export interface UserInterface {
  id: number
  name: string;
  username: string;
  password: string;
  email: string;
  roles?: RoleInterface[];
  rememberMe: boolean,
  registered: boolean,
}
