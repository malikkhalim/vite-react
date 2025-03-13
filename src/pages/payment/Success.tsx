import React, { useEffect, useState } from 'react';
import { Check, Download, Mail, Loader2 } from 'lucide-react';
import { Container } from '../../components/layout/Container';
import { formatCurrency } from '../../utils/formatting';
import { sendPaymentConfirmationEmail } from '../../services/email/email';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  
  useEffect(() => {
    console.log("Payment Success page loaded");
    
    // First, extract the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    const sessionId = urlParams.get('session');
    const status = urlParams.get('status');
    const paymentMethod = urlParams.get('payment_method');
    
    console.log("Query params:", { reference, sessionId, status, paymentMethod });
    
    // Clean the URL by removing query parameters - do this immediately
    if (window.location.search) {
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({ path: newUrl }, '', newUrl);
      console.log("URL cleaned:", newUrl);
    }
    
    // Retrieve payment details from localStorage
    const getPaymentData = () => {
      // If we have a reference from URL, use it directly
      if (reference) {
        try {
          const paymentData = localStorage.getItem(`hitpay_payment_${reference}`);
          if (paymentData) {
            return JSON.parse(paymentData);
          }
        } catch (e) {
          console.error("Error parsing payment data:", e);
        }
      }
      
      // If not, check active session or reference
      const activeReference = localStorage.getItem('hitpay_active_reference');
      
      // If we have an active reference, try to get that payment
      if (activeReference) {
        try {
          const paymentData = localStorage.getItem(`hitpay_payment_${activeReference}`);
          if (paymentData) {
            return JSON.parse(paymentData);
          }
        } catch (e) {
          console.error("Error parsing active payment data:", e);
        }
      }
      
      // Last resort: search through all hitpay payments in localStorage
      return Object.keys(localStorage)
        .filter(key => key.startsWith('hitpay_payment_'))
        .map(key => {
          try {
            return JSON.parse(localStorage.getItem(key) || '{}');
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean)
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))[0]; // Get the most recent one
    };
    
    const data = getPaymentData();
    console.log("Payment data found:", data);
    
    if (data) {
      // Update payment data with completed status and payment method
      const updatedData = {
        ...data,
        status: status || 'completed',
        date: new Date().toISOString(),
        paymentMethod: paymentMethod || data.paymentMethod || 'card'
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
    } else {
      console.warn("No payment data found");
    }
    
    // Simulate loading for better UX
    setTimeout(() => setLoading(false), 1000);
  }, [emailSent]);

  // Helper function to get human-readable payment method
  function getPaymentMethodDisplay(method: string | undefined): string {
    if (!method) return 'Online Payment';
    
    const methodMap: Record<string, string> = {
      'card': 'Credit/Debit Card',
      'paynow': 'PayNow',
      'paynow_online': 'PayNow QR',
      'wallet': 'Digital Wallet'
    };
    
    return methodMap[method.toLowerCase()] || method;
  }

  // Generate PDF for download
  const handleDownloadItinerary = async () => {
    try {
      setGeneratingPdf(true);
      
      // Get the receipt element
      const receiptElement = document.getElementById('payment-receipt');
      if (!receiptElement) {
        throw new Error('Receipt element not found');
      }
      
      // Create a clone of the element to modify for PDF generation
      const printElement = receiptElement.cloneNode(true) as HTMLElement;
      printElement.style.padding = '20px';
      printElement.style.width = '595px'; // A4 width in pixels at 72 DPI
      
      // Add company logo and branding
      const logoDiv = document.createElement('div');
      logoDiv.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 24px; color: #0369a1;">Timor Pacific Logistics</h1>
        </div>
        <h2 style="margin-top: 0; margin-bottom: 20px; font-size: 18px;">Payment Receipt</h2>
      `;
      printElement.prepend(logoDiv);
      
      // Add footer
      const footerDiv = document.createElement('div');
      footerDiv.innerHTML = `
        <div style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px; font-size: 12px; color: #6b7280;">
          <p>Thank you for your business with Timor Pacific Logistics.</p>
          <p>For any inquiries, please contact support@timorpacificlogistics.com</p>
        </div>
      `;
      printElement.appendChild(footerDiv);
      
      // Append to body temporarily
      document.body.appendChild(printElement);
      
      // Generate PDF using html2canvas and jsPDF
      const canvas = await html2canvas(printElement, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true
      });
      
      document.body.removeChild(printElement);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });
      
      // Calculate dimensions
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Generate filename with reference number
      const filename = `TPL_Receipt_${paymentData.reference || 'Unknown'}.pdf`;
      
      // Download the PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF receipt. Please try again.');
    } finally {
      setGeneratingPdf(false);
    }
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
              disabled={generatingPdf}
              className="flex items-center gap-2 text-sky-600 hover:text-sky-700 disabled:opacity-50"
            >
              {generatingPdf ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Receipt
                </>
              )}
            </button>
          </div>

          <div id="payment-receipt" className="space-y-4">
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
              <span>{getPaymentMethodDisplay(paymentData.paymentMethod)}</span>
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