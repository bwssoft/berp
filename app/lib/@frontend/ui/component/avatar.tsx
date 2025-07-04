"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import { tailwindColors } from "../../../constant";

import { cn } from "../../../util";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("rounded-full h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, children, ...props }, ref) => {
  function getInitials() {
    if (typeof children === "string") {
      const splittedName = children.split(" ");

      const firstName = splittedName[0];
      const lastName = splittedName.at(-1);

      let initials = "";

      if (firstName === lastName || !lastName) {
        initials = `${firstName[0]}`;
      } else {
        initials = `${firstName[0]}${lastName[0]}`;
      }

      return initials.toUpperCase();
    } else {
      return children;
    }
  }

  function getRandomColor() {
    const tailwindColorKeys = Object.keys(tailwindColors) as Array<
      keyof typeof tailwindColors
    >;

    const randomColor =
      tailwindColorKeys[Math.floor(Math.random() * tailwindColorKeys.length)];

    return tailwindColors[randomColor]["600"];
  }

  const backgroundColor = React.useMemo(() => {
    if (typeof children === "string") {
      const stringHash = Array.from(children).reduce(
        (acc, char) => acc + char.charCodeAt(0),
        0
      );

      const tailwindColorKeys = Object.keys(tailwindColors) as Array<
        keyof typeof tailwindColors
      >;

      const colorIndex = stringHash % tailwindColorKeys.length;
      const color = tailwindColorKeys[colorIndex];

      return tailwindColors[color]["600"];
    }

    return getRandomColor();
  }, [children]);

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full text-white text-sm",
        className
      )}
      {...props}
      style={{
        ...props.style,
        backgroundColor,
      }}
    >
      {getInitials()}
    </AvatarPrimitive.Fallback>
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
