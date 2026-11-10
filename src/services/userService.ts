import { http } from "../api/http";
import type { User } from "../types/user";

export const getUsers = () => {
   return http<User[]>('/users');
};