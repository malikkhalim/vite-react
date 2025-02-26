import React from 'react';
import { Container } from '../../components/layout/Container';
import { ProfileForm } from './ProfileForm';

export default function Profile() {
  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>
        <ProfileForm />
      </div>
    </Container>
  );
}