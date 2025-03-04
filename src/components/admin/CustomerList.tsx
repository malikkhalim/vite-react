import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, AlertCircle, UserX } from 'lucide-react';
import { supabase } from '../../services/supabase/config';
import { Profile } from '../../types/user';

export function CustomerList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false); // New state to toggle between all users and non-admin only

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching customers...");
        
        // Fetch users based on the current filter setting
        const query = supabase
          .from('profiles')
          .select('*');
          
        // Only apply the admin filter if we're not showing all users
        if (!showAllUsers) {
          query.filter('is_admin', 'not.eq', true);
        }
        
        const { data: profiles, error: profilesError } = await query;
        
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          throw new Error(`Database error: ${profilesError.message}`);
        }
        
        console.log(`Found ${profiles?.length || 0} profiles matching criteria`);
        
        // Set the customers state with the fetched data
        setCustomers(profiles || []);
      } catch (err) {
        console.error('Error in customer fetch process:', err);
        setError(err instanceof Error ? err.message : 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [showAllUsers]); // Re-fetch when the filter changes

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (customer.firstName?.toLowerCase() || '').includes(searchLower) ||
      (customer.lastName?.toLowerCase() || '').includes(searchLower) ||
      (customer.email?.toLowerCase() || '').includes(searchLower) ||
      (customer.phone?.toLowerCase() || '').includes(searchLower)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 mr-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showAllUsers}
                onChange={() => setShowAllUsers(!showAllUsers)}
                className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              <span>Show all users (including admins)</span>
            </label>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customers...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading customers</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="p-16 text-center">
          <UserX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No customers found</p>
          <p className="text-gray-500 text-sm">
            {showAllUsers 
              ? "There are no users in the system yet." 
              : "There are no non-admin users in the system yet. Try enabling 'Show all users' to see admin accounts."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Booking
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-2" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-2" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                      {customer.is_admin ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    0
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    $0
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    N/A
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