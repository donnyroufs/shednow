import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth";

type Props = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: Props) => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  return children as any;
};
