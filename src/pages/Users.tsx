import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Users } from "lucide-react";
import { toast } from "react-toastify";
import UserStats from "../components/users/UserStats";
import UserFilters, { type UserStatusFilter } from "../components/users/UserFilters";
import { changeUserStatus, getUsers } from "../services/userService";
import type { User } from "../types/user";
import UserTable from "../components/users/UserTable";
import UserModal from "../components/users/UserModal";

export default function UsersPage() {
   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const [search, setSearch] = useState("");
   const [status, setStatus] = useState<UserStatusFilter>("all");

   const [showModal, setShowModal] = useState(false);
   const [selectedUser, setSelectedUser] = useState<User | null>(null);
   const [changingStatusId, setChangingStatusId] = useState<number | null>(null);

   const loadUsers = useCallback(async () => {
      try {
         setLoading(true);
         setError(null);

         const data = await getUsers();
         setUsers(data);
      } catch (error) {
         const message = error instanceof Error ? error.message : "No se pudieron cargar los usuarios";

         setError(message);
         toast.error(message);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      void loadUsers();
   }, []);

   const filteredUsers = useMemo(() => {
      const normalizedSearch = search.trim().toLowerCase();

      return users.filter((user) => {
         const matchesSearch = !normalizedSearch || `${user.name} ${user.lastname}`.toLowerCase().includes(normalizedSearch) || user.user.toLowerCase().includes(normalizedSearch);

         const matchesStatus = status === "all" || (status === "active" && user.active) || (status === "inactive" && !user.active);

         return matchesSearch && matchesStatus;
      });
   }, [users, search, status]);

   const handleCreateUser = () => {
      setSelectedUser(null);
      setShowModal(true);
   };

   const handleEditUser = (user: User) => {
      setSelectedUser(user);
      setShowModal(true);
   };

   const handleCloseModal = () => {
      setSelectedUser(null);
      setShowModal(false);
   };

   const handleToggleStatus = async (user: User) => {
      const nextStatus = !user.active;
      const action = nextStatus ? 'activar' : 'desactivar';

      if(!window.confirm(`Estás seguro de ${action} al usuario ${user.user}?`)) return;

      try {
         setChangingStatusId(user.id);

         const updatedUser = await changeUserStatus(user.id, nextStatus);

         setUsers((currentUsers) => currentUsers.map((currentUser) => currentUser.id === updatedUser.id ? updatedUser : currentUser));

         toast.success(`Usuario ${nextStatus ? "activado" : "desactivado"} correctamente`);
      } catch (error) {
         const message = error instanceof Error ? error.message : "No se pudo cambiar el estado del usuario";
         toast.error(message);
      } finally {
         setChangingStatusId(null);
      }
   }

   return (
      <div className="h-full space-y-6 overflow-y-auto p-6">
         {/* Encabezado */}
         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
               <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Gestión de usuarios
               </h1>

               <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Administra los colaboradores registrados en el sistema.
               </p>
            </div>

            <button
               type="button"
               onClick={handleCreateUser}
               className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
               <Plus size={18} />
               Nuevo usuario
            </button>
         </div>

         {/* Estadísticas */}
         <UserStats totalUsers={users.length} />

         {/* Listado */}
         <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-gray-200 p-5 dark:border-slate-800">
               <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                     <h2 className="font-semibold text-gray-900 dark:text-white">
                        Usuarios registrados
                     </h2>

                     <p className="text-sm text-gray-500 dark:text-gray-400">
                        Consulta y administra las cuentas del sistema.
                     </p>
                  </div>

                  <button
                     type="button"
                     onClick={() => void loadUsers()}
                     disabled={loading}
                     className="cursor-pointer inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-gray-300 dark:hover:bg-slate-800 sm:self-auto"
                  >
                     <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                     Actualizar
                  </button>
               </div>

               <UserFilters
                  search={search}
                  onSearchChange={setSearch}
                  status={status}
                  onStatusChange={setStatus}
               />
            </div>

            {/* Tabla de usuarios */}
            <div className="overflow-x-auto">
               {loading ? (
                  <div className="flex flex-col items-center gap-3 p-12">
                     <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
                     <p className="text-sm text-gray-500 dark:text-gray-400">
                        Cargando usuarios...
                     </p>
                  </div>
               ) : error ? (
                  <div className="space-y-3 p-12 text-center">
                     <p className="text-sm text-red-500">{error}</p>

                     <button
                        type="button"
                        onClick={() => void loadUsers()}
                        className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                     >
                        Reintentar
                     </button>
                  </div>
               ) : filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 p-12">
                     <Users size={32} className="text-gray-400" />

                     <p className="font-medium text-gray-700 dark:text-gray-300">
                        No se encontraron usuarios
                     </p>

                     <p className="text-sm text-gray-500 dark:text-gray-400">
                        Prueba modificando los filtros de búsqueda.
                     </p>
                  </div>
               ) : (
                  <UserTable users={filteredUsers} onEdit={handleEditUser} onToggleStatus={handleToggleStatus} changingStatusId={changingStatusId} />
               )}
            </div>
         </section>

         <UserModal
            isOpen={showModal}
            onClose={handleCloseModal}
            onSuccess={loadUsers}
            userToEdit={selectedUser}
         />
      </div>
   );
}