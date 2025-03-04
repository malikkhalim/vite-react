// src/components/admin/WeeklyCargoReport.tsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase/config';
import { Calendar, Download, Filter, Printer } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addDays, parseISO } from 'date-fns';

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
  shipper_company: string;
  consignee_company: string;
  booking_date: string;
  is_manual: boolean;
}

export function WeeklyCargoReport() {
  const [bookings, setBookings] = useState<CargoBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [filters, setFilters] = useState({
    route: 'all',
    cargoType: 'all',
    status: 'all',
  });
  
  // Calculate week range for display
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 }); // Start on Monday
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 }); // End on Sunday
  const displayRange = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
  
  // Calculate if current date is Friday for report generation notice
  const today = new Date();
  const isFriday = today.getDay() === 5;
  const isSaturday = today.getDay() === 6;

  // Fetch cargo bookings for the selected week
  useEffect(() => {
    const fetchWeeklyBookings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Calculate the date range for the query
        const startDate = format(weekStart, 'yyyy-MM-dd');
        const endDate = format(addDays(weekEnd, 1), 'yyyy-MM-dd'); // Add 1 day to include the end date
        
        console.log(`Fetching bookings from ${startDate} to ${endDate}`);
        
        // Use a simpler query structure to avoid join issues
        let query = supabase
          .from('cargo_bookings')
          .select('*')
          .gte('created_at', startDate)
          .lt('created_at', endDate);
          
        // Apply any additional filters
        if (filters.route !== 'all') {
          const [from, to] = filters.route.split('-');
          query = query.eq('from_airport', from).eq('to_airport', to);
        }
        
        if (filters.cargoType !== 'all') {
          query = query.eq('cargo_type', filters.cargoType);
        }
        
        if (filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) {
          throw new Error(`Database error: ${fetchError.message}`);
        }
        
        // Now fetch related shipper/consignee details separately to avoid complex join issues
        const processedBookings = await Promise.all(data?.map(async (booking) => {
          // Get shipper details
          const { data: shipperData } = await supabase
            .from('cargo_contacts')
            .select('company_name, contact_person')
            .eq('cargo_booking_id', booking.id)
            .eq('contact_type', 'shipper')
            .single();
            
          // Get consignee details
          const { data: consigneeData } = await supabase
            .from('cargo_contacts')
            .select('company_name, contact_person')
            .eq('cargo_booking_id', booking.id)
            .eq('contact_type', 'consignee')
            .single();
            
          // Determine currency based on origin
          const currency = booking.from_airport === 'SIN' ? 'SGD' : 'USD';
          
          // Format the booking data
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
            shipper_company: shipperData?.company_name || 'N/A',
            consignee_company: consigneeData?.company_name || 'N/A',
            booking_date: format(parseISO(booking.created_at), 'yyyy-MM-dd'),
            is_manual: format(parseISO(booking.created_at), 'EEEE') === 'Saturday',
          };
        }) || []);
        
        setBookings(processedBookings);
        console.log(`Found ${processedBookings.length} bookings for the selected week`);
      } catch (err) {
        console.error('Error fetching weekly bookings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load weekly bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyBookings();
  }, [selectedWeek, filters, weekStart, weekEnd]);

  // Handle week navigation
  const previousWeek = () => {
    setSelectedWeek(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const nextWeek = () => {
    setSelectedWeek(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  // Handle filter changes
  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Generate CSV export
  const exportToCSV = () => {
    if (bookings.length === 0) return;
    
    // Create CSV headers
    const headers = [
      'Reference',
      'Date',
      'Route',
      'Cargo Type',
      'Weight (kg)',
      'Volume (m³)',
      'Status',
      'Amount',
      'Currency',
      'Shipper',
      'Consignee',
      'Manual Entry'
    ].join(',');
    
    // Create CSV rows
    const rows = bookings.map(booking => [
      booking.reference,
      booking.booking_date,
      `${booking.from_airport} → ${booking.to_airport}`,
      booking.cargo_type,
      booking.total_weight,
      booking.total_volume.toFixed(3),
      booking.status,
      booking.amount.toFixed(2),
      booking.currency,
      booking.shipper_company,
      booking.consignee_company,
      booking.is_manual ? 'Yes' : 'No'
    ].join(','));
    
    // Combine headers and rows
    const csv = [headers, ...rows].join('\n');
    
    // Create a Blob and download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cargo-bookings-${format(weekStart, 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle manual booking entry
  const addManualBooking = () => {
    // Redirect to the cargo booking form with a query param to indicate it's a manual entry
    window.location.href = '/cargo?manual=true';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Weekly Cargo Bookings Report</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 text-sky-600 hover:text-sky-700"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-sky-600 hover:text-sky-700"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-lg">
        <button
          onClick={previousWeek}
          className="text-sky-600 hover:text-sky-700"
        >
          &larr; Previous Week
        </button>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="font-medium">{displayRange}</span>
        </div>
        
        <button
          onClick={nextWeek}
          className="text-sky-600 hover:text-sky-700"
        >
          Next Week &rarr;
        </button>
      </div>

      {/* Notification for report compilation */}
      {isFriday && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Today is Friday. Weekly report compilation is scheduled for tonight.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notification for manual Saturday bookings */}
      {isSaturday && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Calendar className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Today is Saturday. Remember to enter any manual bookings.
              </p>
              <div className="mt-2">
                <button
                  onClick={addManualBooking}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  Add Manual Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700">Filters</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Route</label>
            <select
              value={filters.route}
              onChange={(e) => handleFilterChange('route', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="all">All Routes</option>
              <option value="SIN-DIL">Singapore → Dili</option>
              <option value="DIL-SIN">Dili → Singapore</option>
              <option value="DIL-DPS">Dili → Bali</option>
              <option value="DPS-DIL">Bali → Dili</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Cargo Type</label>
            <select
              value={filters.cargoType}
              onChange={(e) => handleFilterChange('cargoType', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="all">All Types</option>
              <option value="general">General</option>
              <option value="pharma">Pharmaceutical</option>
              <option value="perishable">Perishable</option>
              <option value="dangerous">Dangerous</option>
              <option value="special">Special</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-2">No bookings found for this week</p>
          <p className="text-sm text-gray-500">Try changing your filters or selecting a different week</p>
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
                  Type
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manual
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
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
                    {booking.total_volume.toFixed(3)} m³
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.currency} {booking.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.is_manual ? 'Yes' : 'No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}