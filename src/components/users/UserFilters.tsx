import { Search } from "lucide-react";
import type { SelectOption } from "../ui/CustomSelect";
import CustomSelect from "../ui/CustomSelect";

export type UserStatusFilter = "all" | "active" | "inactive";
const filterStatusOptions: SelectOption<UserStatusFilter>[] = [
   {
      value: "all",
      label: "Todos"
   },
   {
      value: "active",
      label: "Activos"
   },
   {
      value: "inactive",
      label: "Inactivos"
   }
]

export type UserRoleFilter = "all" | "admin" | "user";
const filterRoleOptions: SelectOption<UserRoleFilter>[] = [
   {
      value: "all",
      label: "Todos"
   },
   {
      value: "admin",
      label: "Administrador"
   },
   {
      value: "user",
      label: "Colaborador"
   }
]

interface UserFiltersProps {
   search: string;
   onSearchChange: (value: string) => void;
   status: UserStatusFilter;
   onStatusChange: (value: UserStatusFilter) => void;
   role: UserRoleFilter;
   onRoleChange: (value: UserRoleFilter) => void;
}

export default function UserFilters({ search, onSearchChange, status, onStatusChange, role, onRoleChange }: Readonly<UserFiltersProps>) {
   return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
         <div className="relative w-full sm:max-w-md">
            <Search size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"/>

            <input
               type="text"
               value={search}
               onChange={(event) => onSearchChange(event.target.value)}
               placeholder="Buscar por nombre, apellido o usuario..."
               className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400"
            />
         </div>

         <div className="flex gap-5 flex-col md:flex-row">
            <div className="flex items-center gap-2">
               <span className="text-sm text-gray-500 dark:text-gray-400">
                  Rol:
               </span>

               <CustomSelect
                  value={role}
                  options={filterRoleOptions}
                  onChange={onRoleChange}
                  ariaLabel="Rol de usuario"
                  className="w-full md:w-48"
               />
            </div>

            <div className="flex items-center gap-2">
               <span className="text-sm text-gray-500 dark:text-gray-400">
                  Estado:
               </span>

               <CustomSelect
                  value={status}
                  options={filterStatusOptions}
                  onChange={onStatusChange}
                  ariaLabel="Estado de usuario"
                  className="w-full md:w-48"
               />
            </div>
         </div>
      </div>
   );
}