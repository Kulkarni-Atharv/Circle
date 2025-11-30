import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Label component for form inputs
 * 
 * @component
 * @example
 * ```tsx
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" type="email" />
 * ```
 */
const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            className
        )}
        {...props}
    />
))
Label.displayName = "Label"

export { Label }
