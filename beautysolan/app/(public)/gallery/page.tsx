import { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Gallery | Beauty Technicians',
  description: 'View our portfolio of stunning hairstyles, beautiful braids, flawless nail art, and our luxurious salon environment in Accra.',
};

export default function GalleryPage() {
  return <GalleryClient />;
}
