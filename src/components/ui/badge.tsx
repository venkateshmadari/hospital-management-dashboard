import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border-none px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        pending:
          "bg-blue-200/50 text-blue-700 hover:bg-blue-500 dark:bg-blue-800/80 dark:text-blue-200",
        cancelled: "bg-red-600 text-white hover:bg-red-500",
        secondary:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        success:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        warning:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-none",
        error: "bg-red-100 text-red-800 dark:bg-red-500/25 dark:text-red-400",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
        pink: "bg-pink-500 text-white hover:bg-pink-400",
        purple: "bg-purple-500 text-white hover:bg-purple-400",
        violet: "bg-violet-500 text-white hover:bg-violet-400",
        indigo: "bg-indigo-500 text-white hover:bg-indigo-400",
        pinkLight:
          "bg-pink-100 text-pink-800 hover:bg-pink-50 dark:bg-pink-700/40 dark:text-pink-400",
        purpleLight: "bg-purple-100 text-purple-800 hover:bg-purple-50",
        violetLight:
          "bg-violet-100 text-violet-800 hover:bg-violet-50 dark:bg-violet-700/50 dark:text-violet-300",
        indigoLight: "bg-indigo-100 text-indigo-800 hover:bg-indigo-50",
        lightOrange:
          "bg-orange-100 text-orange-900 hover:bg-orange-50 dark:bg-orange-600/50 dark:text-orange-300",
        brightRed: "bg-red-500 text-white hover:bg-red-400",
        deepRed: "bg-red-700 text-white hover:bg-red-600",
        emerald:
          "bg-emerald-100 text-emerald-800 hover:bg-emerald-50 dark:bg-emerald-600/50 dark:text-emerald-300",
        lightTeal:
          "bg-teal-100 text-teal-800 hover:bg-teal-50 dark:bg-teal-700/60 dark:text-teal-200",
        lightCyan:
          "bg-cyan-100 text-cyan-800 hover:bg-cyan-50 dark:bg-cyan-800/80 dark:text-cyan-200",
        lightMint: "bg-teal-50 text-teal-800 hover:bg-teal-100",
        lightLavender: "bg-lavender-100 text-lavender-800 hover:bg-lavender-50",
        lightPeach:
          "bg-orange-100 dark:bg-orange-500/25 dark:text-orange-500 text-peach-800 hover:bg-peach-50 text-orange-900",
        lightAmber: "bg-amber-100 text-amber-800 hover:bg-amber-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
