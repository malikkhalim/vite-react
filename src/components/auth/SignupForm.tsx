import React, { useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { FormInput } from './FormInput';
import { PasswordInput } from './PasswordInput';

export function SignupForm({ onSuccess }: { onSuccess?: () => void }) {
  const { signUp, loading } = useUserStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Call signUp but don't automatically sign in
      await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      
      // Show success message instead of auto sign-in
      setSuccess(true);
      
      // If a success callback is provided, call it
      if (onSuccess) {
        setTimeout(onSuccess, 2000); // Wait 2 seconds before executing callback
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
          <h3 className="text-green-800 font-medium mb-2">Registration Successful!</h3>
          <p className="text-green-700">
            Your account has been created. Please sign in with your credentials.
          </p>
        </div>
        <button
          type="button"
          onClick={onSuccess}
          className="bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-sky-700 transition-colors"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-4">
        <FormInput
          label="First Name"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Enter first name"
          required
        />
        <FormInput
          label="Last Name"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Enter last name"
          required
        />
      </div>

      <FormInput
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <PasswordInput
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
          placeholder="Create a password"
        />
        <p className="mt-1 text-sm text-gray-500">
          Must be at least 8 characters
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}