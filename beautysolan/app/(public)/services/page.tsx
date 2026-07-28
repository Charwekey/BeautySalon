import { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Our Services | Beauty Technicians',
  description: 'Explore our premium beauty services including hair styling, braiding, nail care, and facial grooming at our luxury salon in Accra, Ghana.',
};

export default function ServicesPage() {
  return <ServicesClient />;
}
