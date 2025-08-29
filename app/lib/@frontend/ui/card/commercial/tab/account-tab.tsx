"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/app/lib/util";

interface Step {
  id: string;
  title: string;
  href: string;
  completed?: boolean;
  disabled?: boolean;
  isActive?: boolean;
}
interface StepNavigationProps {
  steps: Step[];
  className?: string;
}

export default function StepNavigation({
  steps,
  className,
}: StepNavigationProps) {
  const pathname = usePathname();

  // Use the currentStepIndex from steps if available, otherwise fallback to pathname detection
  const currentStepIndex =
    steps.findIndex((step) => step.isActive) !== -1
      ? steps.findIndex((step) => step.isActive)
      : steps.findIndex((step) => pathname.includes(step.id));

  // Calcula a porcentagem de progresso baseada nos steps completados
  const completedStepsCount = steps.filter((step) => step.completed).length;
  const progressPercentage =
    steps.length > 1 ? (completedStepsCount / steps.length) * 100 : 0;

  const getStepStatus = (index: number) => {
    const step = steps[index];
    // Use the isActive property from the step if available, otherwise fall back to index comparison
    const isActive =
      step.isActive !== undefined ? step.isActive : currentStepIndex === index;
    const isCompleted = step.completed && !isActive;

    // Updated logic: step is clickable if not disabled and if it's active, completed, or first step, or previous step is completed
    const isClickable =
      !step.disabled &&
      (isActive ||
        step.completed ||
        index === 0 ||
        (index > 0 && steps[index - 1].completed));

    return { isActive, isCompleted, isClickable };
  };
  return (
    <nav className={cn("w-full", className)} aria-label="Progresso das etapas">
      <div className="relative">
        {/* Progress line background */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 rounded-full">
          <div
            className="h-full bg-gradient-to-r bg-primary to-primary-foreground rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>

        {/* Steps container */}
        <div className="flex items-start justify-between relative">
          {steps.map((step, index) => {
            const { isActive, isCompleted, isClickable } = getStepStatus(index);
            const stepNumber = index + 1;

            const StepContent = (
              <div
                key={step.id}
                className="flex flex-col items-center group relative"
              >
                {/* Step circle */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 mb-3 relative z-10",
                    "border-2 shadow-sm",
                    // Completed state
                    isCompleted && "bg-primary  text-white shadow-blue-200",
                    // Active state
                    isActive &&
                      "bg-primary  bg-white text-primary shadow-blue-200 ring-4 ring-blue-100",
                    // Default/inactive state
                    !isCompleted &&
                      !isActive &&
                      "border-gray-300 bg-white text-gray-500",
                    // Hover effects for clickable steps
                    isClickable &&
                      !isActive &&
                      "hover:border-blue-400 hover:shadow-md hover:scale-105",
                    // Non-clickable steps
                    !isClickable && "opacity-60"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-xs font-bold">
                      {stepNumber.toString().padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* Step title */}
                <div className="text-center max-w-20 sm:max-w-none">
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-medium tracking-wide transition-colors duration-300 leading-tight uppercase",
                      isActive && "text-primary font-semibold",
                      isCompleted && "text-primary font-medium",
                      !isCompleted && !isActive && "text-gray-500"
                    )}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            );

            return isClickable ? (
              <Link
                key={step.id}
                href={step.href}
                className={cn(
                  "flex-1 flex justify-center transition-all duration-200",
                  "hover:scale-105 rounded-lg p-2 focus:border-none",
                  !isActive && "hover:opacity-80"
                )}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${step.title}${isCompleted ? " - Concluído" : ""}${isActive ? " - Atual" : ""}`}
              >
                {StepContent}
              </Link>
            ) : (
              <div
                key={step.id}
                className="flex-1 flex justify-center cursor-not-allowed focus:border-none"
                title="Complete a etapa anterior para acessar"
                aria-label={`${step.title} - Bloqueado`}
              >
                {StepContent}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
