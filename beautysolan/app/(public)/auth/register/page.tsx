import { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account | Beauty Technicians',
};

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    if (session.role === 'CUSTOMER') {
      redirect('/dashboard');
    } else {
      redirect('/admin/dashboard');
    }
  }

  return <RegisterForm />;
}
