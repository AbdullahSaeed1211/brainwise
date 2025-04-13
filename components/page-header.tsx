import { cn } from "@/lib/utils";

interface PageHeaderProps {
  heading: string;
  subheading?: string;
  className?: string;
}

export function PageHeader({
  heading,
  subheading,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("bg-muted py-10 border-b", className)}>
      <div className="container">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{heading}</h1>
        {subheading && (
          <p className="mt-2 text-muted-foreground max-w-3xl">
            {subheading}
          </p>
        )}
      </div>
    </div>
  );
} 