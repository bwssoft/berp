import { cn } from "@/app/lib/util";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, children, className }: SectionCardProps) {
  return (
    <div className={cn("p-5 border border-gray-200 rounded-md", className)}>
      <h3 className="font-semibold mb-5">{title}</h3>
      {children}
    </div>
  );
}
