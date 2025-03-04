import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';

interface ProfileFormData {
  displayName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export function ProfileForm() {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: user?.firstName || '',
    email: user?.email || '',
    phoneNumber: user?.phone || '',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center">
          <User className="w-10 h-10 text-sky-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {user?.firstName || 'Your Profile'}
          </h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">Display Name</label>
              <p className="mt-1">{formData.displayName || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1">{formData.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Phone Number</label>
              <p className="mt-1">{formData.phoneNumber || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Address</label>
              <p className="mt-1">{formData.address || '-'}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}