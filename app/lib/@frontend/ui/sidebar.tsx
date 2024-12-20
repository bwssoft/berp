"use client";
import { cn } from "@/app/lib/util";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  BriefcaseIcon,
  ChevronRightIcon,
  ClipboardIcon,
  CloudArrowUpIcon,
  CommandLineIcon,
  CpuChipIcon,
  FolderIcon,
  HomeIcon,
  RectangleGroupIcon,
  RectangleStackIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  SVGProps,
  useState,
} from "react";
import { useIsOnPathname } from "../hook/is-on-pathname";

type NavItem = {
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
const navigation: NavItem[] = [
  { name: "Dashboard", icon: HomeIcon, pathname: "/" },
  {
    name: "Times",
    icon: UsersIcon,
    children: [
      { name: "Software" },
      { name: "Engenharia" },
      { name: "Recursos Humanos" },
      { name: "Suporte" },
    ],
  },
  {
    name: "Engenharia",
    icon: RectangleStackIcon,
    children: [
      {
        name: "Insumos",
        icon: FolderIcon,
        children: [
          { name: "Gestão", pathname: "/input/management" },
          {
            name: "Categorias",
            pathname: "/input/category",
          },
          { name: "Entradas e Saídas", pathname: "/input/enter-exit" },
          { name: "Estoque", pathname: "/input/stock" },
          { name: "Análise", pathname: "/input/analysis" },
        ],
      },
      {
        name: "Produtos",
        icon: RectangleGroupIcon,
        children: [
          { name: "Gestão", pathname: "/product/management" },
          { name: "Entradas e Saídas", pathname: "/product/enter-exit" },
          { name: "Estoque", pathname: "/product/stock" },
          { name: "Análise", pathname: "/product/analysis" },
          { name: "Fichas técnicas", pathname: "/technical-sheet/management" },
        ],
      },
      {
        name: "Equipamentos",
        icon: CpuChipIcon,
        pathname: "/device/management",
      },
      {
        name: "Firmware",
        icon: CloudArrowUpIcon,
        children: [
          { name: "Gestão", pathname: "/firmware/management" },
          {
            name: "Requisições para atualização",
            pathname: "/firmware/request-to-update",
          },
        ],
      },
      {
        name: "Comandos",
        icon: CommandLineIcon,
        children: [
          { name: "Gestão", pathname: "/command/management" },
          { name: "Agendamento", pathname: "/command/schedule" },
        ],
      },
    ],
  },
  {
    name: "Produção",
    icon: ClipboardIcon,
    children: [
      {
        name: "Ordens de produção",
        children: [
          { name: "Dashboard", pathname: "/production-order/dashboard" },
          { name: "Gestão", pathname: "/production-order/management" },
          { name: "Kanban", pathname: "/production-order/kanban" },
          { name: "Processos", pathname: "/production-process/management" },
        ],
      },
      // {
      //   name: "Ordens de configuração",
      //   children: [
      //     { name: "Gestão", pathname: "/production-order/management" },
      //     { name: "Kanban", pathname: "/production-order/kanban" },
      //   ],
      // },
    ],
  },
  {
    name: "Comercial",
    icon: BriefcaseIcon,
    children: [
      { name: "Clientes", pathname: "/sale/client" },
      { name: "Oportunidades", pathname: "/sale/opportunity" },
      { name: "Propostas", pathname: "/sale/proposal" },
    ],
  },
  // {
  //   name: "Ferramentas",
  //   icon: WrenchIcon,
  //   children: [
  //     { name: "Configurador", pathname: "#" },
  //     { name: "Calculadora de Estoque", pathname: "#" },
  //   ],
  // },
  // { name: "Calendário", icon: CalendarIcon },
  // { name: "Relatórios", icon: ChartPieIcon },
];

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

export function SideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isOnPathname = useIsOnPathname();

  const renderNavItem = (item: NavItem, depth = 0) => {
    const paddingLeft = getPaddingClass(depth); // Calcula o padding-left baseado na profundidade
    return (
      <li key={item.name}>
        {!item?.children ? (
          <Link
            href={item.pathname ?? "#"}
            className={cn(
              isOnPathname(item.pathname)
                ? "bg-gray-50"
                : "hover:bg-gray-50 pl-",
              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700",
              paddingLeft // Adiciona padding-left baseado na profundidade
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
                <DisclosureButton
                  className={cn(
                    isOnPathname(item.pathname)
                      ? "bg-gray-50"
                      : "hover:bg-gray-50",
                    "flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-700",
                    paddingLeft // Adiciona padding-left baseado na profundidade
                  )}
                >
                  {item?.icon && (
                    <item.icon
                      className="h-6 w-6 shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                  {item.name}
                  <ChevronRightIcon
                    className={cn(
                      open ? "rotate-90 text-gray-500" : "text-gray-400",
                      "ml-auto h-5 w-5 shrink-0"
                    )}
                    aria-hidden="true"
                  />
                </DisclosureButton>
                <Disclosure.Panel as="ul" className="mt-1">
                  {item?.children?.map((subItem) =>
                    renderNavItem(subItem, depth + 1)
                  )}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        )}
      </li>
    );
  };

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
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="/logo-bws.png"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => renderNavItem(item))}
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
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="/logo-bws.png"
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => renderNavItem(item))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <a
                    href="#"
                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                  >
                    <img
                      className="h-8 w-8 rounded-full bg-gray-50"
                      src="/avatar.webp"
                      alt=""
                    />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">Oswaldo Conti-Bosso</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
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
          <a href="#">
            <span className="sr-only">Your profile</span>
            <img
              className="h-8 w-8 rounded-full bg-gray-50"
              src="/avatar.webp"
              alt=""
            />
          </a>
        </div>
      </div>
    </>
  );
}
