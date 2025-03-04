import React from 'react';
import { Container } from '../../components/layout/Container';
import { AdminNav } from '../../components/admin/AdminNav';
import { BookingSummary } from '../../components/admin/BookingSummary';
import { RecentBookings } from '../../components/admin/RecentBookings';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <BookingSummary type="flight" />
          <BookingSummary type="cargo" />
          <BookingSummary type="revenue" />
        </div>

        <RecentBookings />
      </Container>
    </div>
  );
}