import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Container } from '../../components/layout/Container';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <Container className="py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Cancelled</h2>
        <p className="text-gray-600 mb-6">
          Your payment has been cancelled. No charges have been made.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </Container>
  );
}