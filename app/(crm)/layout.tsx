import { CrmLayout } from '@/frontend/layout/crm-layout';
import { Toaster } from '@/frontend/ui/component/toaster';

import "../globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CrmLayout>
      {children}
      <Toaster />
    </CrmLayout>
  );
}
