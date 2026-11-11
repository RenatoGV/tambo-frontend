import { Pencil, UserCheck, UserRound, UserX } from "lucide-react";
import type { User } from "../../types/user";
import { RoleFormatter } from "../../helpers/roleHelper";

interface UserTableProps {
   users: User[];
   onEdit: (user: User) => void;
   onToggleStatus: (user: User) => void;
   changingStatusId: number | null;
}

export default function UserTable({ users, onEdit, onToggleStatus, changingStatusId }: Readonly<UserTableProps>) {
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
                  <th className="px-6 py-4 text-center font-semibold">Acciones</th>
               </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
               {users.map((user) => {
                  const isChangingStatus = changingStatusId === user.id;

                  return (
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
                        <td className="px-6 py-4">
                           <div className="flex items-center justify-center gap-2">
                              <button
                                 type="button"
                                 onClick={() => onEdit(user)}
                                 title="Editar usuario"
                                 aria-label={`Editar usuario ${user.user}`}
                                 className="cursor-pointer rounded-lg p-2 text-gray-500 transition hover:bg-purple-50 hover:text-purple-600 dark:text-gray-400 dark:hover:bg-purple-500/10 dark:hover:text-purple-400"
                              >
                                 <Pencil size={17} />
                              </button>

                              <button
                                 type="button"
                                 onClick={() => onToggleStatus(user)}
                                 disabled={isChangingStatus}
                                 title={user.active ? "Desactivar usuario" : "Activar usuario"}
                                 aria-label={`${user.active ? "Desactivar" : "Activar"} usuario ${user.user}`}
                                 className="cursor-pointer rounded-lg p-2 text-gray-500 transition hover:bg-purple-50 hover:text-purple-600 dark:text-gray-400 dark:hover:bg-purple-500/10 dark:hover:text-purple-400"
                              >
                                 {isChangingStatus ? (
                                    <span className="block h-4.25 w-4.25 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                 ) : user.active ? (
                                    <UserX size={17} />
                                 ) : (
                                    <UserCheck size={17} />
                                 )}
                              </button>
                           </div>
                        </td>
                     </tr>
                  )
               })}
            </tbody>
         </table>
      </div>
   );
}