import React, { useEffect, useState } from 'react';
import { Check, Download, Mail, Loader2 } from 'lucide-react';
import { Container } from '../../components/layout/Container';
import { formatCurrency } from '../../utils/formatting';
import { sendPaymentConfirmationEmail } from '../../services/email/email';

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [emailSent, setEmailSent] = useState(false);
  
  useEffect(() => {
    // First, check if we have URL parameters and clean them up
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    const reference = urlParams.get('reference');
    const status = urlParams.get('status');
    
    // If we have URL parameters, clean the URL by redirecting to the clean version
    if (sessionId || reference || status) {
      // Replace the current URL with the clean version (no query parameters)
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Retrieve payment details from localStorage
    const getPaymentData = () => {
      // First try to get the active session ID
      const activeSession = localStorage.getItem('hitpay_active_session');
      const activeReference = localStorage.getItem('hitpay_active_reference');
      
      // If we have a session ID from URL, use that
      const lookupReference = reference || activeReference;
      const lookupSessionId = sessionId || activeSession;
      
      if (!lookupReference && !lookupSessionId) return null;
      
      // Check localStorage for payment data
      const storedPayments = Object.keys(localStorage)
        .filter(key => key.startsWith('hitpay_payment_'))
        .map(key => {
          try {
            return JSON.parse(localStorage.getItem(key) || '{}');
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean);
      
      // Find matching payment - prioritize reference match
      return storedPayments.find(payment => 
        (lookupReference && payment.reference === lookupReference) ||
        (lookupSessionId && payment.id === lookupSessionId)
      );
    };
    
    const data = getPaymentData();
    
    if (data) {
      // Update payment data with completed status
      const updatedData = {
        ...data,
        status: status || 'completed',
        date: new Date().toISOString()
      };
      
      // Update in localStorage
      localStorage.setItem(`hitpay_payment_${data.reference}`, JSON.stringify(updatedData));
      
      // Update state
      setPaymentData(updatedData);
      
      // Clear the active session
      localStorage.removeItem('hitpay_active_session');
      localStorage.removeItem('hitpay_active_reference');
      
      // Send email with payment confirmation if we have an email
      if (!emailSent && data.email) {
        sendPaymentConfirmationEmail(updatedData)
          .then(() => setEmailSent(true))
          .catch((err: any) => console.error('Failed to send email:', err));
      }
    }
    
    // Simulate loading for better UX
    setTimeout(() => setLoading(false), 1000);
  }, [emailSent]);

  // Generate PDF for download
  const handleDownloadItinerary = () => {
    // In a real app, this would generate a PDF
    alert('Downloading itinerary...');
    // Placeholder for PDF generation
  };
  
  // Return to home page
  const handleReturnHome = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <Container className="py-16">
        <div className="max-w-lg mx-auto text-center">
          <Loader2 className="h-12 w-12 animate-spin text-sky-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Processing Your Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </Container>
    );
  }

  if (!paymentData) {
    return (
      <Container className="py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Information Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find details about your payment. If you have completed a payment,
            please check your email for confirmation or contact our support team.
          </p>
          <button
            onClick={handleReturnHome}
            className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-600">
            Your payment has been processed successfully. A confirmation email has been sent to your email address.
          </p>
        </div>

        {/* Itinerary/Receipt Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Payment Receipt</h3>
            <button
              onClick={handleDownloadItinerary}
              className="flex items-center gap-2 text-sky-600 hover:text-sky-700"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-600">Reference Number:</span>
              <span className="font-mono">{paymentData.reference}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-600">Date:</span>
              <span>{new Date(paymentData.timestamp).toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-600">Payment Method:</span>
              <span>Credit Card / PayNow</span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-lg font-bold text-sky-600">
                {formatCurrency(paymentData.amount || 0)}
              </span>
            </div>
          </div>

          {emailSent && (
            <div className="mt-6 p-3 bg-blue-50 rounded-lg flex items-start gap-2 text-sm text-blue-700">
              <Mail className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p>
                A confirmation email with your invoice and itinerary has been sent to your email address.
                Please check your inbox.
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={handleReturnHome}
            className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    </Container>
  );
}