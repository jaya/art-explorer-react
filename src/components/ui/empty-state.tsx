import Icon, { IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: IconName;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon = "image",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      <div className="rounded-full bg-muted p-6 mb-4">
        <Icon name={icon} className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium text-foreground mt-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default EmptyState;
