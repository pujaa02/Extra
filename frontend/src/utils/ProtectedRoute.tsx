import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import {
  ProtectedRouteProps,
  RoleProtectedRouteProps,
} from '../Types/protectedroute.types';
import { State_user } from '../Types/reducer.types';

export const ProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
  children, // Add this line
}) => {
  const location = useLocation();
  const user = useSelector((state: State_user) => state.user);

  if (!user?.id) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user?.role_id ?? -1)) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return <>{children}</>;
};

export const CheckUser: React.FC<ProtectedRouteProps> = ({
  component: Component,
}) => {
  const user = useSelector((state: State_user) => state.user);
  return user?.id ? <Navigate to="/" /> : <Component />;
};
