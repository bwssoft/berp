interface Props {
  searchParams: {
    id: string;
  };
}

export default async function Page({ searchParams }: Props) {
  const { id: accountId } = searchParams;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      página principal de conta
    </div>
  );
}
