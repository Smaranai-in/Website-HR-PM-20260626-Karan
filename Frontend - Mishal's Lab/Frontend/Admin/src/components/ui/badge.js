import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200",
                outline: "text-muted-foreground border-border",
                success:
                    "border-transparent bg-emerald-700 text-white dark:bg-emerald-600 dark:text-white",
                warning:
                    "border-transparent bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200",
                danger:
                    "border-transparent bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
);

export function Badge({ className, variant, ...props }) {
    return (
        <div
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}
