import { http } from "../api/http";
import type { UserRequest } from "../types/requests/userRequest";
import type { User } from "../types/user";

export const getUsers = () => {
   return http<User[]>('/users');
};

export function createUser(request: UserRequest) {
   return http<unknown>("/users", {
      method: 'POST',
      body: JSON.stringify(request)
   });
};