import { Button } from "@/app/lib/@frontend/ui/component";
import { ContactModal, SearchContactModal } from "@/app/lib/@frontend/ui/modal";

interface Props {
  searchParams: {
    accountId?: string;
  };
}

export default async function Page(props: Props) {
  const { searchParams } = props;

  return (
    <div className="flex gap-4 w-full justify-end">
      <Button onClick={() => {}}>Buscar contato</Button>
      <Button onClick={() => {}}>Novo</Button>
      <SearchContactModal open={false} closeModal={() => {}} contacts={[]} />
      <ContactModal open={false} closeModal={() => {}} />
    </div>
  );
}
