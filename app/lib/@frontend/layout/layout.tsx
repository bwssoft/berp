import { NavItem, SideBar } from "../ui/component/sidebar";

interface Props {
  children: React.ReactNode;
  navigation: (NavItem & { code?: string })[];
}

export function Layout(props: Props) {
  const { children, navigation } = props;

  return (
    <div>
      <SideBar navigation={navigation} />
      <div className="lg:pl-72">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
