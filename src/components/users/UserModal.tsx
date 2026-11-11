import { useEffect, useState, type SubmitEvent } from "react";
import { Eye, EyeOff, UserPlus, UserRoundPen, X } from "lucide-react";
import { toast } from "react-toastify";

import type { SelectOption } from "../ui/CustomSelect";
import CustomSelect from "../ui/CustomSelect";
import type { UserRequest } from "../../types/requests/userRequest";
import { createUser, updateUser } from "../../services/userService";
import type { User } from "../../types/user";

interface UserModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void | Promise<void>;
   userToEdit: User | null;
}

interface FormInputProps {
   id: string;
   label: string;
   value: string;
   onChange: (value: string) => void;
   placeholder: string;
   type?: string;
   maxLength?: number;
   required?: boolean;
   disabled?: boolean;
   rightElement?: React.ReactNode;
}

const roleOptions: SelectOption<number>[] = [
   {
      value: 1,
      label: "Administrador"
   },
   {
      value: 2,
      label: "Colaborador"
   }
]

function FormInput({
   id,
   label,
   value,
   onChange,
   placeholder,
   type = "text",
   maxLength,
   required = true,
   disabled = false,
   rightElement,
}: Readonly<FormInputProps>) {
   return (
      <div className="space-y-1.5">
         <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
         </label>

         <div className="relative">
            <input
               id={id}
               type={type}
               value={value}
               onChange={(event) => onChange(event.target.value)}
               placeholder={placeholder}
               maxLength={maxLength}
               required={required}
               disabled={disabled}
               className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500"
            />

            {rightElement}
         </div>
      </div>
   );
}

export default function UserModal({ isOpen, onClose, onSuccess, userToEdit }: Readonly<UserModalProps>) {
   const isEditing = userToEdit !== null;

   const initialForm: UserRequest = {
      name: "",
      lastname: "",
      user: "",
      password: "",
      role: 2,
   };

   const [form, setForm] = useState<UserRequest>(initialForm);

   const [confirmPassword, setConfirmPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [submitting, setSubmitting] = useState(false);

   useEffect(() => {
      if(!isOpen) return;

      if(userToEdit) {
         setForm({
            name: userToEdit.name,
            lastname: userToEdit.lastname,
            user: userToEdit.user,
            password: "",
            role: userToEdit.role.id
         });
      } else {
         setForm(initialForm);
      }

      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);
   }, [isOpen, userToEdit]);

   if (!isOpen) return null;

   const updateField = (field: keyof UserRequest, value: string | number) => {
      setForm((previous) => ({ ...previous, [field]: value }));
   };

   const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!isEditing && form.password !== null) {
         if (form.password.length < 6 || form.password.length > 72) {
            toast.error("La contraseña debe tener entre 6 y 72 caracteres");
            return;
         }

         if (form.password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
         }
      }

      try {
         setSubmitting(true);

         if(isEditing && userToEdit) {
            await updateUser(userToEdit.id, {
               name: form.name.trim(),
               lastname: form.lastname.trim(),
               user: form.user.trim(),
               password: null,
               role: form.role
            });

            toast.success('Usuario editado correctamente');
         } else {
            await createUser({
               name: form.name.trim(),
               lastname: form.lastname.trim(),
               user: form.user.trim(),
               password: form.password,
               role: form.role
            });

            toast.success("Usuario registrado correctamente");
         }

         await onSuccess();
         onClose();
      } catch (error) {
         const message = error instanceof Error ? error.message : "No se pudo registrar el usuario";

         toast.error(message);
      } finally {
         setSubmitting(false);
      }
   };

   const passwordToggle = ( visible: boolean, onToggle: () => void ) => (
      <button
         type="button"
         onClick={onToggle}
         disabled={submitting}
         className="cursor-pointer absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition hover:text-purple-600 dark:hover:text-purple-400"
         aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
         {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
   );

   return (
      <div
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
         onClick={(event) => {
            if (event.target === event.currentTarget && !submitting) {
               onClose();
            }
         }}
      >
         <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-user-title"
            className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
         >
            {/* Encabezado */}
            <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-slate-800">
               <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2 text-purple-600 dark:bg-slate-800 dark:text-purple-400">
                     { isEditing ? <UserRoundPen size={21} /> : <UserPlus size={21} /> }
                  </div>

                  <div>
                     <h2 id="register-user-title" className="font-semibold text-gray-900 dark:text-white">
                        { isEditing ? "Editar usuario" : "Nuevo usuario" }
                     </h2>

                     <p className="text-xs text-gray-500 dark:text-gray-400">
                        { isEditing ? "Modifica los datos del usuario." : "Registrar nuevo colaborador del sistema." }
                     </p>
                  </div>
               </div>

               <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
                  aria-label="Cerrar modal"
               >
                  <X size={20} />
               </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4 p-5">
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                     id="name"
                     label="Nombre"
                     value={form.name}
                     onChange={(value) => updateField("name", value)}
                     placeholder="Ej. Juan"
                     maxLength={100}
                     disabled={submitting}
                  />

                  <FormInput
                     id="lastname"
                     label="Apellido"
                     value={form.lastname}
                     onChange={(value) => updateField("lastname", value)}
                     placeholder="Ej. Pérez"
                     maxLength={100}
                     disabled={submitting}
                  />
               </div>

               <FormInput
                  id="user"
                  label="Nombre de usuario"
                  value={form.user}
                  onChange={(value) => updateField("user", value)}
                  placeholder="Ej. jperez"
                  maxLength={20}
                  disabled={submitting}
               />

               <div className="space-y-1.5">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                     Rol
                  </label>

                  <CustomSelect
                     value={form.role}
                     options={roleOptions}
                     onChange={(value) => updateField("role", value)}
                     disabled={submitting}
                     ariaLabel="Tema de pantalla"
                     className="w-full"
                  />
               </div>

               {
                  (!isEditing && form.password !== null) &&
                  <>
                     <FormInput
                        id="password"
                        label="Contraseña"
                        value={form.password}
                        onChange={(value) => updateField("password", value)}
                        placeholder="Mínimo 6 caracteres"
                        type={showPassword ? "text" : "password"}
                        maxLength={72}
                        disabled={submitting}
                        rightElement={passwordToggle(showPassword, () => setShowPassword((previous) => !previous))}
                     />

                     <FormInput
                        id="confirmPassword"
                        label="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        placeholder="Repite la contraseña"
                        type={showConfirmPassword ? "text" : "password"}
                        maxLength={72}
                        disabled={submitting}
                        rightElement={passwordToggle(showConfirmPassword, () => setShowConfirmPassword((previous) => !previous))}
                     />

                     <p className="text-xs text-gray-500 dark:text-gray-400">
                        La contraseña debe tener entre 6 y 72 caracteres.
                     </p>
                  </>
               }

               {/* Acciones */}
               <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end dark:border-slate-800">
                  <button
                     type="button"
                     onClick={onClose}
                     disabled={submitting}
                     className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
                  >
                     Cancelar
                  </button>

                  <button
                     type="submit"
                     disabled={submitting}
                     className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                     {submitting ? (
                        <>
                           <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />{" "}
                           { isEditing ? "Guardando..." : "Registrando..." }
                        </>
                     ) : (
                        <>
                           { isEditing ? <UserRoundPen size={17} /> : <UserPlus size={17} /> }
                           { isEditing ? "Guardar cambios" : "Registrar usuario" }
                        </>
                     )}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}