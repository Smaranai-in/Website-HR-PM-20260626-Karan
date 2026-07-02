import * as React from "react";
import { cn } from "../../lib/utils";

export function Avatar({
    initials,
    colorClass,
    className,
    ...props
}) {
    return (
        <div
            className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white",
                colorClass ?? "bg-blue-500",
                className
            )}
            {...props}
        >
            {initials}
        </div>
    );
}
