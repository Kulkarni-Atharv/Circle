import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Skeleton component for loading states
 * 
 * @component
 * @example
 * ```tsx
 * <Skeleton className="h-12 w-12 rounded-full" />
 * <Skeleton className="h-4 w-[250px]" />
 * ```
 */
function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted shimmer", className)}
            {...props}
        />
    )
}

export { Skeleton }
