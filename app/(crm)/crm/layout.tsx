import {
  BackButton,
  CrmLayout,
  Toaster,
} from "@/app/lib/@frontend/ui/component";
import "../../globals.css";

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
