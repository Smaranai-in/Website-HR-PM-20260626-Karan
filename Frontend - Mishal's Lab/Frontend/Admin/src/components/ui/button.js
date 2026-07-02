import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 ring-offset-background",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-sm hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                ghost:
                    "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3",
                lg: "h-10 rounded-md px-6",
                icon: "h-8 w-8"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
);

const Button = React.forwardRef(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
