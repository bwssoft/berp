import { BackButton } from '@/frontend/ui/component/back-button';


interface Props {
  children: React.ReactNode;
}

export function CrmLayout(props: Props) {
  const { children } = props;

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 mb-4">
        <BackButton />
      </div>
      {children}
    </div>
  );
}
