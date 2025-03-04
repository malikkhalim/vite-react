import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase/config';
import { useUserStore } from '../../stores/userStore';
import { Package, ExternalLink, Search, Filter, MessageCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface CargoBooking {
  id: string;
  reference: string;
  created_at: string;
  from_airport: string;
  to_airport: string;
  cargo_type: string;
  total_weight: number;
  total_volume: number;
  status: string;
  amount: number;
  currency: string;
  booking_date: string;
}

export function MyBookings() {
  const { user } = useUserStore();
  const [bookings, setBookings] = useState<CargoBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<CargoBooking | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // WhatsApp support number - this would be configured in your settings
  const WHATSAPP_SUPPORT_NUMBER = "+6587654321"; // Example number

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching bookings for user:", user.id);
        
        // Build the query
        let query = supabase
          .from('cargo_bookings')
          .select(`
            id,
            reference,
            created_at,
            from_airport,
            to_airport,
            cargo_type,
            total_weight,
            total_volume,
            status,
            amount
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) {
          throw new Error(`Database error: ${fetchError.message}`);
        }
        
        // Process the data
        const processedBookings = data?.map(booking => {
          // Determine currency based on origin
          const currency = booking.from_airport === 'SIN' ? 'SGD' : 'USD';
          
          return {
            id: booking.id,
            reference: booking.reference || `CARGO-${booking.id.substring(0, 8).toUpperCase()}`,
            created_at: booking.created_at,
            from_airport: booking.from_airport,
            to_airport: booking.to_airport,
            cargo_type: booking.cargo_type,
            total_weight: booking.total_weight,
            total_volume: booking.total_volume,
            status: booking.status,
            amount: booking.amount,
            currency,
            booking_date: format(parseISO(booking.created_at), 'yyyy-MM-dd')
          };
        }) || [];
        
        setBookings(processedBookings);
        console.log(`Found ${processedBookings.length} bookings`);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, statusFilter]);

  // Filter bookings by search term
  const filteredBookings = bookings.filter(booking => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.reference.toLowerCase().includes(searchLower) ||
      booking.from_airport.toLowerCase().includes(searchLower) ||
      booking.to_airport.toLowerCase().includes(searchLower) ||
      booking.cargo_type.toLowerCase().includes(searchLower) ||
      booking.status.toLowerCase().includes(searchLower)
    );
  });

  // Open booking details
  const viewBookingDetails = (booking: CargoBooking) => {
    setSelectedBooking(booking);
  };

  // Close booking details modal
  const closeBookingDetails = () => {
    setSelectedBooking(null);
  };

  // Open WhatsApp support
  const openWhatsAppSupport = () => {
    if (!selectedBooking) return;
    
    const bookingRef = selectedBooking.reference;
    const message = `Hello, I need help with my cargo booking: ${bookingRef}`;
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  // Open contact modal
  const openContactModal = () => {
    setShowContactModal(true);
  };

  // Close contact modal
  const closeContactModal = () => {
    setShowContactModal(false);
  };

  // Render booking status badge
  const renderStatusBadge = (status: string) => {
    let colorClass;
    
    switch (status.toLowerCase()) {
      case 'confirmed':
        colorClass = 'bg-green-100 text-green-800';
        break;
      case 'pending':
        colorClass = 'bg-yellow-100 text-yellow-800';
        break;
      case 'cancelled':
        colorClass = 'bg-red-100 text-red-800';
        break;
      case 'completed':
        colorClass = 'bg-blue-100 text-blue-800';
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Fixed WhatsApp Support Button */}
      <button
        onClick={openContactModal}
        className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 z-50"
        aria-label="Contact Support"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Package className="h-5 w-5 text-sky-600" />
            My Cargo Bookings
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search bookings..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-16 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No cargo bookings found</p>
          <p className="text-gray-500 text-sm mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? "Try adjusting your search or filters" 
              : "You haven't made any cargo bookings yet"}
          </p>
          <a 
            href="/cargo" 
            className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition-colors"
          >
            <Package className="h-4 w-4" />
            Book Cargo
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargo Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.booking_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.from_airport} → {booking.to_airport}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {booking.cargo_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.total_weight} kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.total_volume?.toFixed(3) || "0.000"} m³
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.currency === 'SGD' ? 'S$' : '$'}{booking.amount?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => viewBookingDetails(booking)}
                      className="text-sky-600 hover:text-sky-900 flex items-center gap-1 ml-auto"
                    >
                      View
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Booking Details: {selectedBooking.reference}
              </h3>
              <button
                onClick={closeBookingDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Booking Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600 font-medium">Reference:</span> {selectedBooking.reference}</p>
                  <p><span className="text-gray-600 font-medium">Date:</span> {selectedBooking.booking_date}</p>
                  <p><span className="text-gray-600 font-medium">Status:</span> {renderStatusBadge(selectedBooking.status)}</p>
                  <p><span className="text-gray-600 font-medium">Amount:</span> {selectedBooking.currency === 'SGD' ? 'S$' : '$'}{selectedBooking.amount.toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Cargo Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600 font-medium">Route:</span> {selectedBooking.from_airport} → {selectedBooking.to_airport}</p>
                  <p><span className="text-gray-600 font-medium">Cargo Type:</span> <span className="capitalize">{selectedBooking.cargo_type}</span></p>
                  <p><span className="text-gray-600 font-medium">Total Weight:</span> {selectedBooking.total_weight} kg</p>
                  <p><span className="text-gray-600 font-medium">Total Volume:</span> {selectedBooking.total_volume.toFixed(3)} m³</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="mb-3 text-gray-700">
                  Need to make changes to your booking? Contact our customer support:
                </p>
                <button
                  onClick={openWhatsAppSupport}
                  className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 mx-auto hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  Contact via WhatsApp
                </button>
              </div>
            </div>
            
            <div className="mt-6 text-gray-500 text-sm border-t pt-4">
              <p>
                Note: Cargo bookings cannot be modified directly from this page. Please contact customer support for any changes or special requirements.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Support Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Contact Customer Support
              </h3>
              <button
                onClick={closeContactModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Need assistance with your cargo booking? Our customer support team is ready to help!
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">WhatsApp Support</h4>
                    <p className="text-sm text-gray-600">Fast response during business hours</p>
                    <button
                      onClick={() => {
                        window.open(`https://wa.me/${WHATSAPP_SUPPORT_NUMBER}`, '_blank');
                        closeContactModal();
                      }}
                      className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Start Chat
                    </button>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email Support</h4>
                    <p className="text-sm text-gray-600">Response within 24 hours</p>
                    <a
                      href="mailto:cargo@timorpacificlogistics.com"
                      className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      onClick={closeContactModal}
                    >
                      Send Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              Business hours: Monday-Friday, 9:00 AM - 6:00 PM (GMT+8)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}