import { UserRound } from "lucide-react";
import type { User } from "../../types/user";
import { RoleFormatter } from "../../helpers/roleHelper";

interface UserTableProps {
   users: User[];
}

export default function UserTable({users}: Readonly<UserTableProps>) {
   return (
      <div className="overflow-x-auto">
         <table className="w-full min-w-187.5 text-left text-sm">
            <thead className="bg-gray-100 text-xs uppercase text-gray-500 dark:bg-slate-800/50 dark:text-gray-400">
               <tr>
                  <th className="px-6 py-4 font-semibold">Colaborador</th>
                  <th className="px-6 py-4 font-semibold">Usuario</th>
                  <th className="px-6 py-4 font-semibold">Rol</th>
                  <th className="px-6 py-4 font-semibold">Ventas</th>
                  <th className="px-6 py-4 font-semibold">Total vendido</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
               </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
               {users.map((user) => (
                  <tr key={user.id} className="transition hover:bg-gray-50 dark:hover:bg-slate-800/30">
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-purple-600 dark:bg-slate-800 dark:text-purple-400">
                              <UserRound size={18} />
                           </div>

                           <span className="font-medium text-gray-900 dark:text-white">
                              {user.name} {user.lastname}
                           </span>
                        </div>
                     </td>

                     <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {user.user}
                     </td>

                     <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {user.role?.role ? RoleFormatter.format(user.role.role) : "—"}
                     </td>

                     <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        —
                     </td>

                     <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        —
                     </td>

                     <td className="px-6 py-4">
                        <span
                           className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                              user.active
                                 ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                                 : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                           }`}
                        >
                           {user.active ? "Activo" : "Inactivo"}
                        </span>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}