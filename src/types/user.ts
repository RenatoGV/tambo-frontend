export interface User {
   id: number;
   name: string;
   lastname: string;
   user: string;
   role: Role;
   active: boolean;
}

export interface Role {
   id: number;
   role: string;
}