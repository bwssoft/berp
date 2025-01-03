import { cn } from '@/app/lib/util'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

interface Props {
    className?: string
    label: string
    items: React.ReactNode[]
}

export function ButtonGroup({ className, label, items }: Props) {
    return (
        <div className={cn("inline-flex rounded-md shadow-sm", className)}>
            <button
                type="button"
                className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            >
                {label}
            </button>
            <Menu as="div" className="relative -ml-px block">
                <MenuButton className="relative inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
                    <span className="sr-only">Open options</span>
                    <ChevronDownIcon aria-hidden="true" className="size-5" />
                </MenuButton>
                <MenuItems
                    className="absolute right-0 z-10 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                    <div className="py-1">
                        {items.map((item, idx) => (
                            <MenuItem key={idx}>
                                {item}
                            </MenuItem>
                        ))}
                    </div>
                </MenuItems>
            </Menu>
        </div>
    )
}
