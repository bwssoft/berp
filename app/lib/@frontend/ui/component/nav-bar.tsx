import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAuth } from "../../context";
import { userObjectRepository } from "../../../@backend/infra";

interface Props {
  menuListItem: {
    name: string;
    onClick?: () => void;
    href?: string;
  }[];
}

export default function NavBar({ menuListItem }: Props) {
  const { user } = useAuth();
  
  const userImageUrl = user?.image?.key 
    ? userObjectRepository.generateUrl(user.image.key)
    : "/avatar.webp";

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-16">
        <div className="flex h-16 justify-between">
          <div className="flex"></div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <img
                    alt=""
                    src={userImageUrl}
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-none">
                {menuListItem &&
                  menuListItem.map((item, index) => (
                    <MenuItem key={index}>
                      {({ active }) =>
                        item.href ? (
                          <Link
                            href={item.href}
                            onClick={item.onClick}
                            className={`block w-full px-4 py-2 text-left text-sm ${
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {item.name}
                          </Link>
                        ) : (
                          <button
                            onClick={item.onClick}
                            className={`block w-full px-4 py-2 text-left text-sm ${
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {item.name}
                          </button>
                        )
                      }
                    </MenuItem>
                  ))}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
