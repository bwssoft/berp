import { CreateAccountFlowProvider } from '@/frontend/context/create-account-flow.context';


interface CreateAccountLayoutProps {
  children: React.ReactNode;
}

export default function CreateAccountLayout({
  children,
}: CreateAccountLayoutProps) {
  return (
    <CreateAccountFlowProvider resetOnMount={true}>
      {children}
    </CreateAccountFlowProvider>
  );
}
