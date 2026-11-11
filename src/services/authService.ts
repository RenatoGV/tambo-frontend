import { http } from "../api/http";
import type { ChangePasswordRequest, LoginRequest, LoginResponse } from "../types/auth";
import type { User } from "../types/user";

export async function login(request: LoginRequest): Promise<LoginResponse> {
   try {
      return await http<LoginResponse>('/auth/login', {
         method: "POST",
         body: JSON.stringify(request),
      })
   } catch (error) {
      throw new Error("No se pudo iniciar sesión. Inténtalo nuevamente.");
   }
}

export async function getMe(accessToken: string, tokenType: string): Promise<User> {
   try {
      return await http<User>('/auth/me', {
         method: "GET",
         headers: {
            Authorization: `${tokenType} ${accessToken}`,
         }
      })
   } catch (error) {
      throw new Error("No se pudo recuperar el usuario autenticado.");
   }
}

export async function changePassword(request: ChangePasswordRequest): Promise<void> {
   const accessToken = sessionStorage.getItem("accessToken");
   
   if (!accessToken) {
      throw new Error(
         "No hay una sesión activa. Inicia sesión nuevamente."
      );
   }

   try {
      await http<void>("/auth/change-password", {
         method: "PATCH",
         body: JSON.stringify(request),
      });
   } catch (error) {
      if (error instanceof Error && error.message.includes("400")) {
         throw new Error("Verifica los datos ingresados.");
      }

      if (error instanceof Error && error.message.includes("401")) {
         throw new Error("No tienes autorización para cambiar la contraseña.");
      }

      if (error instanceof Error && error.message.includes("403")) {
         throw new Error("No tienes autorización para cambiar la contraseña.");
      }

      throw new Error("No se pudo actualizar la contraseña.");
   }
}