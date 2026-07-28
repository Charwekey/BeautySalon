import { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | Beauty Technicians',
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    if (session.role === 'CUSTOMER') {
      redirect('/dashboard');
    } else {
      redirect('/admin/dashboard');
    }
  }

  return <LoginForm />;
}
