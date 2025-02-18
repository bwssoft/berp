interface Props {
  children: React.ReactNode;
}

export function CrmLayout(props: Props) {
  const { children } = props;

  return <div>{children}</div>;
}
