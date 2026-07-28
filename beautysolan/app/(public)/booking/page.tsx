import { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BookingClient from './BookingClient';

export const metadata: Metadata = {
  title: 'Book Appointment | Beauty Technicians',
  description: 'Book your luxury beauty service online.',
};

export default async function BookingPage() {
  const session = await getSession();

  // Strict Admin Boundary Protection: Admins cannot access the booking page
  if (session && session.role !== 'CUSTOMER') {
    redirect('/admin/dashboard');
  }

  return (
    <div className="pt-24 min-h-screen bg-background">
      <BookingClient />
    </div>
  );
}
