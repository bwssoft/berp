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
      <div className="px-4 sm:px-6 lg:px-8">
        <BackButton />
      </div>
      {children}
      <Toaster />
    </CrmLayout>
  );
}
