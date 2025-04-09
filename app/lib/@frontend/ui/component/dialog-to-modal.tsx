import { cn } from "@/app/lib/util"
import { XMarkIcon } from "@heroicons/react/24/outline"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import * as React from "react"
import { tv as cva, type VariantProps } from "tailwind-variants"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal

const DialogVariants = cva({
	base: `fixed z-50 gap-4 bg-white p-6 shadow-lg transition-all ease-in-out
    data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300
    data-[state=open]:duration-500`,
	variants: {
		position: {
			center: `m-auto w-fit h-fit inset-0 gap-4 border border-border p-6 shadow-lg duration-200 data-[state=open]:animate-in
			data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
			data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[48%]
			data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg bg-background`,
			right:
				"border-l border-border bg-background w-full lg:w-1/2 inset-y-0 right-0 h-full data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
			left: "dark:border-r dark:border-border bg-background w-1/2 inset-y-0 left-0 h-full data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
		},
	},
	defaultVariants: {
		position: "right",
	},
})

export type DialogVariantsProps = VariantProps<typeof DialogVariants>

const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
		children?: React.ReactNode
	}
>(({ children, className, ...props }, ref) => (
	<DialogPrimitive.Overlay
		className={cn(
			"fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in",
			"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
			className
		)}
		{...props}
		ref={ref}
	>
		{children}
	</DialogPrimitive.Overlay>
))

export interface DialogContentProps
	extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
		DialogVariantsProps {
	classNameForeground?: string
}

const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	DialogContentProps
>(
	(
		{ position = "right", className, children, classNameForeground, ...props },
		ref
	) => (
		<DialogPortal>
			<DialogOverlay className={cn("bg-background/50", classNameForeground)}>
				<DialogPrimitive.Content
					ref={ref}
					className={cn(DialogVariants({ position }), className)}
					{...props}
				>
					{children}
				</DialogPrimitive.Content>
			</DialogOverlay>
		</DialogPortal>
	)
)

const DialogHeader = ({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"relative flex h-10 items-center space-x-4 border-b border-border pb-4 text-center sm:text-left",
			className
		)}
		{...props}
	>
		{children}
	</div>
)

type DialogCloseButtonProps = {
	className?: string
}

const DialogClose = DialogPrimitive.Close

const DialogCloseButton = ({ className }: DialogCloseButtonProps) => (
	<DialogPrimitive.Close
		className={cn(
			"focus:ring-ring rounded-sm text-foreground opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none",
			className
		)}
	>
		<XMarkIcon className="h-6 w-6" />
		<span className="sr-only">Close</span>
	</DialogPrimitive.Close>
)

const DialogFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
			className
		)}
		{...props}
	/>
)

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName
DialogContent.displayName = DialogPrimitive.Content.displayName
DialogHeader.displayName = "DialogHeader"
DialogFooter.displayName = "DialogFooter"
DialogClose.displayName = "DialogClose"
DialogCloseButton.displayName = "DialogCloseButton"

export {
	Dialog,
	DialogClose,
	DialogCloseButton,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTrigger,
}
