import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
}

export function GlassCard({ className, children, gradient, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl",
        gradient && "bg-gradient-to-br from-white/5 to-white/0", // Optional shiny sheen
        className
      )}
      {...props}
    >
      {/* Optional: Add a subtle 'shine' effect to the top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {children}
    </div>
  );
}