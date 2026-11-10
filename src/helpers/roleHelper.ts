export class RoleFormatter {
   private constructor () {}

   public static format(role: string): string {
      return role === 'admin' ? 'Administrador' : 'Colaborador'
   }
}