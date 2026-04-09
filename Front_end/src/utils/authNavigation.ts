import type { User } from '../store/slices/authSlice';

const permissionLandingOrder: Array<{ permission: string; path: string }> = [
  { permission: 'MANAGE_USERS', path: '/admin/users' },
  { permission: 'MANAGE_BOOKINGS', path: '/admin/bookings/manage' },
  { permission: 'MANAGE_BOOKINGS', path: '/admin/vouchers' },
  { permission: 'MANAGE_INVOICES', path: '/admin/invoices' },
  { permission: 'MANAGE_SERVICES', path: '/admin/orders' },
  { permission: 'MANAGE_ROOMS', path: '/admin/rooms' },
  { permission: 'MANAGE_INVENTORY', path: '/admin/inventory' },
  { permission: 'MANAGE_CONTENT', path: '/admin/cms' },
  { permission: 'MANAGE_ROLES', path: '/admin/roles' },
  { permission: 'VIEW_DASHBOARD', path: '/admin' },
];

export const getAuthorizedHomePath = (user: User | null | undefined): string => {
  if (!user) {
    return '/login';
  }

  const role = (user.role || '').toLowerCase();

  if (role === 'user' || role === 'guest' || role === 'customer') {
    return '/';
  }

  if (role === 'housekeeping') {
    return '/staff/cleaning';
  }

  if (role === 'receptionist') {
    return '/staff/bookings/manage';
  }

  const permissions = user.permissions ?? [];
  const matched = permissionLandingOrder.find((item) => permissions.includes(item.permission));

  return matched?.path ?? '/admin';
};

export const canAccessPath = (user: User | null | undefined, path: string | null | undefined): boolean => {
  if (!user || !path) {
    return false;
  }

  if (path === '/' || path.startsWith('/rooms') || path.startsWith('/services') || path.startsWith('/about') || path.startsWith('/contact')) {
    return true;
  }

  if (path.startsWith('/profile') || path.startsWith('/booking/')) {
    return true;
  }

  const permissions = user.permissions ?? [];

  if (path === '/admin') {
    return permissions.includes('VIEW_DASHBOARD');
  }

  if (path.startsWith('/admin/users')) {
    return permissions.includes('MANAGE_USERS');
  }

  if (
    path.startsWith('/admin/rooms') ||
    path.startsWith('/admin/room-types') ||
    path.startsWith('/admin/cleaning') ||
    path.startsWith('/admin/amenities')
  ) {
    return permissions.includes('MANAGE_ROOMS');
  }

  if (path.startsWith('/admin/bookings')) {
    return permissions.includes('MANAGE_BOOKINGS');
  }

  if (path.startsWith('/admin/vouchers')) {
    return permissions.includes('MANAGE_BOOKINGS');
  }

  if (path.startsWith('/admin/invoices')) {
    return permissions.includes('MANAGE_INVOICES');
  }

  if (path.startsWith('/admin/orders')) {
    return permissions.includes('MANAGE_SERVICES') || permissions.includes('MANAGE_ROOMS');
  }

  if (path.startsWith('/admin/inventory')) {
    return permissions.includes('MANAGE_INVENTORY');
  }

  if (path.startsWith('/admin/roles')) {
    return permissions.includes('MANAGE_ROLES');
  }

  if (path.startsWith('/admin/cms') || path.startsWith('/admin/attractions')) {
    return permissions.includes('MANAGE_CONTENT');
  }

  if (path.startsWith('/staff/cleaning')) {
    return (user.role || '').toLowerCase() === 'housekeeping';
  }

  if (path.startsWith('/staff/bookings')) {
    return permissions.includes('MANAGE_BOOKINGS');
  }

  if (path.startsWith('/staff/invoices')) {
    return permissions.includes('MANAGE_INVOICES');
  }

  if (path.startsWith('/staff/orders')) {
    return permissions.includes('MANAGE_SERVICES') || permissions.includes('MANAGE_ROOMS');
  }

  return true;
};
