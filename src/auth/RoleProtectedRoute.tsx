import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthContext";

interface RoleProtectedRouteProps {
   allowedRoles: string[];
}

export default function RoleProtectedRoute({ allowedRoles }: Readonly<RoleProtectedRouteProps>) {
   const { user } = useAuth();

   if (!user || !allowedRoles.includes(user.role.role)) {
      return <Navigate to="/pos" replace />;
   }

   return <Outlet />;
}