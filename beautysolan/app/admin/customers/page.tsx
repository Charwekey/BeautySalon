'use client';

import { useEffect, useState } from 'react';
import { getAllCustomers } from '@/actions/dashboardActions';
import { Search, Mail, Phone, Calendar as CalendarIcon } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-display font-bold text-orchid">Customers</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-rose/50 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface">
              <tr className="border-b border-border text-muted">
                <th className="p-4 font-medium">Customer Info</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Join Date</th>
                <th className="p-4 font-medium text-center">Total Bookings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted animate-pulse">Loading customers...</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted">No customers found.</td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-black/[0.02] transition-colors cursor-pointer group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orchid/10 text-orchid flex items-center justify-center font-bold font-display">
                          {customer.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="font-semibold text-foreground group-hover:text-orchid transition-colors">
                          {customer.name || 'Unknown User'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Mail size={14} />
                        <span>{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <Phone size={14} />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <CalendarIcon size={14} />
                        <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center bg-rose/10 text-rose-deep font-semibold px-3 py-1 rounded-full text-sm">
                        {customer._count?.appointments || 0}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
