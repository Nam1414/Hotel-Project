import type { User } from '../store/slices/authSlice';

const permissionLandingOrder: Array<{ permission: string; path: string }> = [
  { permission: 'MANAGE_USERS', path: '/admin/users' },
  { permission: 'MANAGE_ROOMS', path: '/admin/rooms' },
  { permission: 'MANAGE_INVENTORY', path: '/admin/inventory' },
  { permission: 'MANAGE_ROLES', path: '/admin/roles' },
  { permission: 'VIEW_DASHBOARD', path: '/admin' },
];

export const getAuthorizedHomePath = (user: User | null | undefined): string => {
  if (!user) {
    return '/login';
  }

  if ((user.role || '').toLowerCase() === 'housekeeping') {
    return '/staff/cleaning';
  }

  const permissions = user.permissions ?? [];
  const matched = permissionLandingOrder.find((item) => permissions.includes(item.permission));

  return matched?.path ?? '/admin';
};

export const canAccessPath = (user: User | null | undefined, path: string | null | undefined): boolean => {
  if (!user || !path) {
    return false;
  }

  const permissions = user.permissions ?? [];

  if (path === '/' || path === '/admin') {
    return permissions.includes('VIEW_DASHBOARD');
  }

  if (path.startsWith('/admin/users')) {
    return permissions.includes('MANAGE_USERS');
  }

  if (
    path.startsWith('/admin/rooms') ||
    path.startsWith('/admin/room-types') ||
    path.startsWith('/admin/cleaning')
  ) {
    return permissions.includes('MANAGE_ROOMS');
  }

  if (path.startsWith('/admin/inventory')) {
    return permissions.includes('MANAGE_INVENTORY');
  }

  if (path.startsWith('/admin/roles')) {
    return permissions.includes('MANAGE_ROLES');
  }

  if (path.startsWith('/staff/cleaning')) {
    return (user.role || '').toLowerCase() === 'housekeeping';
  }

  return true;
};
