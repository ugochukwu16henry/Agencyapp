import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost";
};

export function Button({
  className,
  variant = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition",
        variant === "default" && "bg-slate-900 text-white hover:bg-slate-800",
        variant === "secondary" &&
          "bg-amber-500 text-slate-900 hover:bg-amber-400",
        variant === "ghost" && "bg-transparent text-slate-700 hover:bg-slate-100",
        className,
      )}
      {...props}
    />
  );
}
