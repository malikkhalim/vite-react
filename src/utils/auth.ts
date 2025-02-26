import { User } from '../types/auth';

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

export const requireAdmin = (user: User | null): void => {
  if (!isAdmin(user)) {
    window.location.href = '/admin/login';
  }
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};