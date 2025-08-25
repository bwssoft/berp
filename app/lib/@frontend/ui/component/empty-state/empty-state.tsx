"use client";

import React from "react";
import { AlertCircle, FileX, Search, User, Home } from "lucide-react";
import { Button } from "../button";

export interface EmptyStateProps {
  /**
   * The type of empty state - determines the icon and default styling
   */
  variant?: "default" | "not-found" | "no-data" | "account" | "search";
  
  /**
   * Custom icon to display (overrides variant icon)
   */
  icon?: React.ReactNode;
  
  /**
   * Main title text
   */
  title: string;
  
  /**
   * Optional description text
   */
  description?: string;
  
  /**
   * Optional action button
   */
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "secondary" | "outline" | "link" | "destructive" | "ghost";
  };
  
  /**
   * Custom className for additional styling
   */
  className?: string;
}

const variantConfig = {
  default: {
    icon: AlertCircle,
    iconColor: "text-gray-400",
    bgColor: "bg-gray-50",
  },
  "not-found": {
    icon: FileX,
    iconColor: "text-red-400",
    bgColor: "bg-red-50",
  },
  "no-data": {
    icon: Search,
    iconColor: "text-blue-400", 
    bgColor: "bg-blue-50",
  },
  account: {
    icon: User,
    iconColor: "text-orange-400",
    bgColor: "bg-orange-50",
  },
  search: {
    icon: Search,
    iconColor: "text-purple-400",
    bgColor: "bg-purple-50",
  },
};

export function EmptyState({
  variant = "default",
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 text-center ${className}`}>
      {/* Icon Container */}
      <div className={`
        w-20 h-20 rounded-full flex items-center justify-center mb-6
        ${config.bgColor}
      `}>
        {icon || (
          <IconComponent 
            className={`w-10 h-10 ${config.iconColor}`} 
            strokeWidth={1.5}
          />
        )}
      </div>

      {/* Content */}
      <div className="max-w-md space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-gray-500 leading-relaxed">
            {description}
          </p>
        )}

        {/* Action Button */}
        {action && (
          <div className="pt-4">
            <Button
              onClick={action.onClick}
              variant={action.variant || "outline"}
              className="inline-flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              {action.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Pre-configured variants for common use cases
export const AccountNotFoundState = (props: Omit<EmptyStateProps, "variant" | "icon">) => (
  <EmptyState 
    variant="account" 
    {...props}
  />
);

export const DataNotFoundState = (props: Omit<EmptyStateProps, "variant" | "icon">) => (
  <EmptyState 
    variant="not-found" 
    {...props}
  />
);

export const NoDataState = (props: Omit<EmptyStateProps, "variant" | "icon">) => (
  <EmptyState 
    variant="no-data" 
    {...props}
  />
);

export const SearchEmptyState = (props: Omit<EmptyStateProps, "variant" | "icon">) => (
  <EmptyState 
    variant="search" 
    {...props}
  />
);
