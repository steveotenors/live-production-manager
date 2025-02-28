import { Metadata } from 'next';
import DesignSystemValidator from '@/app/design-system/validator';

export const metadata: Metadata = {
  title: 'Design System Validator',
  description: 'Tool to validate components against the design system guidelines',
};

export default function DesignSystemValidatorPage() {
  return <DesignSystemValidator />;
} 