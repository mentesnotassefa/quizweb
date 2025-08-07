import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase/config";

function ProtectedRoute() {
  return auth.currentUser ? <Outlet /> : <Navigate to="/auth" replace />;
}

export default ProtectedRoute;