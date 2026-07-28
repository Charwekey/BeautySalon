'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  getDashboardStats, 
  getMonthlyRevenue, 
  getRecentAppointments 
} from '@/actions/dashboardActions';
import { Users, Calendar as CalendarIcon, Clock, TrendingUp, UserCog, Calendar } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, chartData, appsData] = await Promise.all([
          getDashboardStats(),
          getMonthlyRevenue(),
          getRecentAppointments()
        ]);
        setStats(statsData);
        setRevenueData(chartData);
        setRecentApps(appsData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center animate-pulse-soft"><p className="text-xl font-display text-muted">Loading Dashboard...</p></div>;
  }

  const statCards = [
    { label: 'Total Customers', value: stats?.totalCustomers, icon: Users, color: 'text-orchid', bg: 'bg-orchid/10' },
    { label: 'Total Appointments', value: stats?.totalAppointments, icon: CalendarIcon, color: 'text-rose-deep', bg: 'bg-rose/20' },
    { label: 'Pending Bookings', value: stats?.pendingBookings, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Revenue (GHS)', value: `₵${stats?.totalRevenue?.toFixed(2)}`, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Quick Operations Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E8D5D8] pb-6">
        <div>
          <span className="font-script text-2xl text-[#B8737D]">Salon Intelligence</span>
          <h1 className="text-3xl font-display font-bold text-[#3D262B]">Admin Operations Dashboard</h1>
          <p className="text-xs uppercase tracking-widest text-[#6B4D54] mt-1">
            Real-time appointments, revenue streams, and staff management metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/appointments"
            className="btn-rose-gold px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md"
          >
            <Calendar className="w-4 h-4" /> Manage Appointments
          </Link>
          <Link
            href="/admin/staff"
            className="btn-outline-rose px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
          >
            <UserCog className="w-4 h-4" /> Staff Access (RBAC)
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card p-6 rounded-2xl flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <Icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-sm text-muted font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-display font-bold text-orchid mb-6">Revenue Over Time</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DAD4DF" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#88708E' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#88708E' }} dx={-10} tickFormatter={(val) => `₵${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#594364' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#CFA0AB" strokeWidth={3} dot={{ fill: '#CFA0AB', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#9E6876' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col">
          <h2 className="text-xl font-display font-bold text-orchid mb-6">Popular Services</h2>
          <div className="flex-1 space-y-4">
            {stats?.popularServices?.map((service: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
                <span className="font-medium text-foreground">{service.name}</span>
                <span className="text-sm bg-blush text-rose-deep px-3 py-1 rounded-full font-semibold">{service.count} Bookings</span>
              </div>
            ))}
            {(!stats?.popularServices || stats.popularServices.length === 0) && (
              <p className="text-muted text-center py-4">No data available yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-display font-bold text-orchid mb-6">Recent Appointments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Service</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentApps.map((app) => (
                <tr key={app.id} className="border-b border-border/50 last:border-0 hover:bg-black/5 transition-colors">
                  <td className="py-4 font-medium text-foreground">{app.customer?.name}</td>
                  <td className="py-4 text-muted">{app.service?.name}</td>
                  <td className="py-4 text-muted">{new Date(app.date).toLocaleDateString()}</td>
                  <td className="py-4">
                    <span className={`badge-${app.status.toLowerCase()} px-3 py-1 rounded-full text-xs font-semibold capitalize`}>
                      {app.status.toLowerCase()}
                    </span>
                  </td>
                </tr>
              ))}
              {recentApps.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted">No recent appointments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
