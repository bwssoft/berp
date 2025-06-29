"use client";

import { cn } from "@/app/lib/util";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  SVGProps,
  useState,
} from "react";
import { useIsOnPathname } from "../../hook/is-on-pathname";
import { useAuth } from "../../context";
import { ShowVersion } from "./show-version";

export type NavItem = {
  name: string;
  icon?: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & RefAttributes<SVGSVGElement>
  >;
  pathname?: string;
  children?: NavItem[];
};

const getPaddingClass = (depth: number) => {
  switch (depth) {
    case 0:
      return "";
    case 1:
      return "pl-5";
    case 2:
      return "pl-8";
    default:
      return `pl-${9 + (depth - 1) * 3}`;
  }
};

interface Props {
  navigation: any[];
  menuListItem: {
    name: string;
    onClick?: () => void;
    href?: string;
  }[];
}
const renderNavItem = (
  item: NavItem,
  isOnPathname: (href?: string) => boolean,
  depth = 0
) => {
  const paddingLeft = getPaddingClass(depth);

  return (
    <li key={item.name}>
      {!item?.children ? (
        <Link
          href={item.pathname ?? "#"}
          className={cn(
            isOnPathname(item.pathname) ? "bg-gray-50" : "hover:bg-gray-50",
            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700",
            paddingLeft
          )}
        >
          {item.icon && (
            <item.icon
              className="h-6 w-6 shrink-0 text-gray-400"
              aria-hidden="true"
            />
          )}
          {item.name}
        </Link>
      ) : (
        <Disclosure as="div">
          {({ open }) => (
            <>
              <div className="flex items-center">
                {/* Área clicável para redirecionamento */}
                <Link
                  href={item.pathname ?? "#"}
                  className={cn(
                    isOnPathname(item.pathname)
                      ? "bg-gray-50"
                      : "hover:bg-gray-50",
                    "flex flex-1 items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700",
                    paddingLeft
                  )}
                >
                  {item?.icon && (
                    <item.icon
                      className="h-6 w-6 shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                  {item.name}
                </Link>

                {/* Botão apenas para expandir/recolher */}
                <DisclosureButton className="p-2 rounded-md hover:bg-gray-50">
                  <ChevronRightIcon
                    className={cn(
                      open ? "rotate-90 text-gray-500" : "text-gray-400",
                      "h-5 w-5 shrink-0"
                    )}
                    aria-hidden="true"
                  />
                </DisclosureButton>
              </div>

              <Disclosure.Panel as="ul" className="mt-1">
                {item?.children?.map((subItem) =>
                  renderNavItem(subItem, isOnPathname, depth + 1)
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      )}
    </li>
  );
};
export function SideBar(props: Props) {
  const { navigation, menuListItem } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isOnPathname = useIsOnPathname();
  return (
    <>
      <div>
        <Transition show={sidebarOpen}>
          <Dialog className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <TransitionChild
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </TransitionChild>

            <div className="fixed inset-0 flex">
              <TransitionChild
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <TransitionChild
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </TransitionChild>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                    <Link href={"/home"}>
                      <div className="flex h-16 shrink-0 items-center">
                        <img
                          className="h-8 w-auto"
                          src="/bcube-logo.svg"
                          alt="Bcube"
                        />
                      </div>
                    </Link>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) =>
                              renderNavItem(item, isOnPathname)
                            )}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <Link href="/home">
              <div className="flex h-16 shrink-0 items-center">
                <img
                  className="h-8 w-auto"
                  src="/bcube-logo.svg"
                  alt="Your Company"
                />
              </div>
            </Link>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) =>
                      renderNavItem(item, isOnPathname)
                    )}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
          <ShowVersion />
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            Dashboard
          </div>
          <div className="sm:block sm:ml-6 sm:items-center">
            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3 block lg:hidden">
              <div>
                <MenuButton className="relative flex rounded-full bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src="/avatar.webp"
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
          <a href="#" className="hidden md:block">
            <span className="sr-only ">Your profile</span>
            <img
              className="h-8 w-8 rounded-full bg-gray-50 hidden lg:block"
              src="/avatar.webp"
              alt=""
            />
          </a>
        </div>
      </div>
    </>
  );
}
