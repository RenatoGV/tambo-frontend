import { http } from "../api/http";
import type { UserRequest } from "../types/requests/userRequest";
import type { User } from "../types/user";

export const getUsers = () => {
   return http<User[]>('/users');
};

export function createUser(request: UserRequest) {
   return http<unknown>('/users', {
      method: 'POST',
      body: JSON.stringify(request)
   });
};

export async function updateUser(id: number, request: UserRequest): Promise<User> {
   return http<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request)
   });
};

export async function changeUserStatus(id: number, active: boolean): Promise<User> {
   return http<User>(`/users/${id}/status?active=${active}`, {
      method: 'PATCH'
   });
}