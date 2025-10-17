export interface RegisterUser {
  username: string;
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
}
