"use client";
import { Slot } from "@radix-ui/react-slot";
import React, { ReactNode } from "react";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogVariantsProps,
  DialogHeader,
} from "./dialog-to-modal";
import { cn } from "@/app/lib/util";

export type ModalProps = DialogVariantsProps & {
  children: ReactNode;
  className?: string;
  title?: string;
  open: boolean;
  onClose: () => void;
  rightAction?: ReactNode;
  classNameHeader?: string;
  containerClassName?: string;
  classNameForeground?: string;
  headerContent?: ReactNode;
};

export function Modal({
  open,
  onClose,
  title,
  className,
  children,
  rightAction,
  position,
  classNameHeader,
  containerClassName,
  classNameForeground,
  headerContent,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent
        classNameForeground={classNameForeground}
        className={className}
        position={position}
      >
        <DialogHeader className={classNameHeader}>
          <DialogCloseButton />

          {title && (
            <span className="text-lg font-medium text-foreground">{title}</span>
          )}

          {rightAction && (
            <div className="flex flex-1 items-center justify-end">
              {rightAction}
            </div>
          )}
          {headerContent}
        </DialogHeader>

        <div
          className={cn(
            "h-[95%] max-h-[95%] overflow-y-auto",
            containerClassName
          )}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export interface ModalBodyProps
  extends React.AllHTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ asChild = false, className, ...rest }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        className={cn(
          "app-scrollbar flex flex-col gap-4 overflow-y-auto px-6 py-6 text-foreground",
          className
        )}
        {...rest}
      />
    );
  }
);
ModalBody.displayName = "ModalBody";

export interface ModalContentProps
  extends React.AllHTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ asChild = false, className, ...rest }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        className={cn(
          className,
          "app-scrollbar grid h-full grid-rows-[1fr_min-content] overflow-hidden"
        )}
        {...rest}
      />
    );
  }
);
ModalContent.displayName = "ModalContent";

export interface ModalFormContentProps
  extends React.AllHTMLAttributes<HTMLFormElement> {}

const ModalFormContent = React.forwardRef<
  HTMLFormElement,
  ModalFormContentProps
>(({ className, ...rest }, ref) => {
  return (
    <form
      ref={ref}
      className={cn(
        className,
        "app-scrollbar grid h-full grid-rows-[1fr_min-content] overflow-hidden"
      )}
      {...rest}
    />
  );
});

ModalFormContent.displayName = "ModalFormContent";

export interface ModalFooterProps
  extends React.AllHTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ asChild = false, className, ...rest }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        className={cn(
          "mx-6 flex items-center justify-start gap-2 border-t border-border py-6",
          className
        )}
        {...rest}
      />
    );
  }
);

ModalFooter.displayName = "ModalFooter";

export { ModalBody, ModalFormContent, ModalContent, ModalFooter };
