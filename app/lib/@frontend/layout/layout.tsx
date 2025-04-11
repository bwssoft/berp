import NavBar from "../ui/component/nav-bar";
import { NavItem, SideBar } from "../ui/component/sidebar";

interface Props {
  children: React.ReactNode;
  navigation: (NavItem & { code?: string })[];
  menuListItem: {
    name: string;
    onClick?: () => void;
    href?: string;
  }[];
}

export function Layout(props: Props) {
  const { children, navigation, menuListItem } = props;
  return (
    <div>
      <SideBar navigation={navigation} menuListItem={menuListItem} />
      <div className="lg:pl-72">
        <div className="hidden lg:block">
          <NavBar 
            menuListItem={menuListItem}
          />
        </div>
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
