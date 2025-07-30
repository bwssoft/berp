import { useAuth } from "../context";
import NavBar from "../ui/component/nav-bar";
import { NavItem, SideBar } from "../ui/component/sidebar";

interface Props {
  children: React.ReactNode;
  navigation: (NavItem & { code?: string })[];
}

export function Layout(props: Props) {
  const { navBarItems } = useAuth();

  const { children, navigation } = props;
  return (
    <div>
      <SideBar navigation={navigation} menuListItem={navBarItems} />
      <div className="lg:pl-72">
        <div className="hidden lg:block">
          <NavBar menuListItem={navBarItems} />
        </div>
        <main>
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
