import React from 'react';
import { Container } from '../../components/layout/Container';
import { AdminNav } from '../../components/admin/AdminNav';
import { CustomerList } from '../../components/admin/CustomerList';

export default function AdminCustomers() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <Container className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Customers</h1>
        <CustomerList />
      </Container>
    </div>
  );
}