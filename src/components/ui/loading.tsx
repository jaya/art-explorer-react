import Icon, { IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LoadingProps {
  text?: string;
  icon?: IconName;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Loading({
  text = "Carregando...",
  icon = "loader",
  className,
  size = "md",
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-16 w-16",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className
      )}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <Icon name={icon} className={cn("text-primary", sizeClasses[size])} />
      </motion.div>
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

export default Loading;
