import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Role } from '../store/slices/authSlice';

interface RequirePermissionProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

const RequirePermission: React.FC<RequirePermissionProps> = ({ children, allowedRoles }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default RequirePermission;
