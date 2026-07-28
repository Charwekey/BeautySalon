import { getAdminServices } from '@/actions/serviceActions';
import ServicesClient from './ServicesClient';

export const metadata = {
  title: 'Services Management | Admin Dashboard',
};

export default async function ServicesPage() {
  const services = await getAdminServices();

  return (
    <div className="pt-24 min-h-screen bg-background">
      <ServicesClient initialServices={services as any} />
    </div>
  );
}
