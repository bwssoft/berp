import { CreateAccountFlowProvider } from "@/app/lib/@frontend/context";

interface CreateAccountLayoutProps {
  children: React.ReactNode;
}

export default function CreateAccountLayout({
  children,
}: CreateAccountLayoutProps) {
  return (
    <CreateAccountFlowProvider resetOnMount={false}>
      {children}
    </CreateAccountFlowProvider>
  );
}
