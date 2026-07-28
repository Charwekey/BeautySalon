'use client';

import { useEffect, useState } from 'react';
import { 
  getAllAppointments, 
  approveAppointment, 
  rejectAppointment, 
  completeAppointment 
} from '@/actions/dashboardActions';
import { Search, CheckCircle, XCircle, CheckSquare } from 'lucide-react';

const TABS = ['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED'];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAllAppointments(activeTab);
      setAppointments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [activeTab]);

  const handleAction = async (id: string, actionFn: (id: string) => Promise<void>) => {
    try {
      await actionFn(id);
      fetchAppointments();
    } catch (error) {
      console.error("Action failed", error);
    }
  };

  const filteredAppointments = appointments.filter(app => 
    app.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-display font-bold text-orchid">Appointments</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text"
            placeholder="Search customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-rose/50"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-orchid text-white' 
                : 'bg-surface text-muted hover:bg-wisteria hover:text-foreground'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface">
              <tr className="border-b border-border text-muted">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Service</th>
                <th className="p-4 font-medium">Date & Time</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted animate-pulse">Loading appointments...</td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted">No appointments found.</td>
                </tr>
              ) : (
                filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-foreground">{app.customer?.name}</p>
                      <p className="text-xs text-muted">{app.customer?.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-foreground">{app.service?.name}</p>
                      <p className="text-xs text-muted">₵{app.service?.price}</p>
                    </td>
                    <td className="p-4 text-sm text-foreground">
                      {new Date(app.date).toLocaleDateString()} <br />
                      <span className="text-muted">{app.time}</span>
                    </td>
                    <td className="p-4">
                      <span className={`badge-${app.status.toLowerCase()} px-3 py-1 rounded-full text-xs font-semibold capitalize inline-block`}>
                        {app.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        {app.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handleAction(app.id, approveAppointment)}
                              className="p-2 text-success hover:bg-success/10 rounded-md transition-colors"
                              title="Approve"
                            >
                              <CheckCircle size={20} />
                            </button>
                            <button 
                              onClick={() => handleAction(app.id, rejectAppointment)}
                              className="p-2 text-error hover:bg-error/10 rounded-md transition-colors"
                              title="Reject"
                            >
                              <XCircle size={20} />
                            </button>
                          </>
                        )}
                        {app.status === 'APPROVED' && (
                          <button 
                            onClick={() => handleAction(app.id, completeAppointment)}
                            className="p-2 text-info hover:bg-info/10 rounded-md transition-colors"
                            title="Mark Completed"
                          >
                            <CheckSquare size={20} />
                          </button>
                        )}
                      </div>
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
