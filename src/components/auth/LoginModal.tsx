import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const { error, clearError, user } = useUserStore();

  // Close modal when user is logged in
  useEffect(() => {
    if (user) {
      handleClose();
    }
  }, [user]);

  const handleClose = () => {
    clearError();
    onClose();
  };

  const switchToLogin = () => {
    setIsLogin(true);
    clearError();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600">
            {isLogin
              ? 'Sign in to access your account'
              : 'Sign up to get started'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-600">
            {error}
          </div>
        )}

        {isLogin ? <LoginForm /> : <SignupForm onSuccess={switchToLogin} />}

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sky-600 hover:text-sky-700 text-sm"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}