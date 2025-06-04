"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"
import { 
  Legend, 
  LegendProps, 
  ResponsiveContainer, 
  Tooltip, 
  TooltipProps 
} from "recharts"

import { cn } from "@/lib/utils"

export interface ChartTheme {
  light: string
  dark: string
}

export interface ChartConfigItem {
  label: string
  icon?: LucideIcon
  color?: string
  theme?: ChartTheme
}

export type ChartConfig = Record<string, ChartConfigItem>

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: ChartConfig
  children: React.ReactNode
}

export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartContainerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    
    const container = containerRef.current
    if (!container || !config) return
    
    // Set CSS variables for colors
    Object.entries(config).forEach(([key, value]) => {
      if (value.color) {
        container.style.setProperty(`--color-${key}`, value.color)
      }
    })
    
    return () => {
      if (!container || !config) return
      
      // Cleanup CSS variables
      Object.keys(config).forEach((key) => {
        container.style.removeProperty(`--color-${key}`)
      })
    }
  }, [config])

  if (!mounted) {
    return <div ref={containerRef} className={cn("w-full", className)} {...props} />
  }

  return (
    <div ref={containerRef} className={cn("w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  )
}

interface ChartTooltipContentProps
  extends React.ComponentProps<"div"> {
  labelKey?: string
  nameKey?: string
  indicator?: "dot" | "line" | "dashed"
  hideLabel?: boolean
  hideIndicator?: boolean
}

type TooltipPayload = {
  dataKey: string;
  name: string;
  value: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: Record<string, any>;
  fill: string;
}

export function ChartTooltipContent({
  className,
  labelKey,
  nameKey,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  ...props
}: ChartTooltipContentProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-background px-3 py-2 shadow-sm",
        className
      )}
      {...props}
    >
      {(props as {payload?: TooltipPayload[]})?.payload?.map((payload: TooltipPayload, index: number) => {
        const value = payload.value || 0
        const name = nameKey
          ? payload.payload?.[nameKey] ?? payload.name
          : payload.name
        const payloadLabel = payload.payload?.[labelKey || "label"]
        const label = labelKey && payloadLabel ? payloadLabel : ""
        const fill = payload.fill || "currentColor"
        
        return (
          <React.Fragment key={`item-${index}`}>
            {!hideLabel && label ? (
              <div className="mb-1 text-sm font-medium">{label as React.ReactNode}</div>
            ) : null}
            <div className="flex items-center">
              {!hideIndicator ? (
                <div className="mr-2 flex items-center">
                  {indicator === "dot" ? (
                    <div
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: fill }}
                    />
                  ) : indicator === "line" ? (
                    <div
                      className="h-0.5 w-4"
                      style={{ backgroundColor: fill }}
                    />
                  ) : indicator === "dashed" ? (
                    <div className="h-px w-4 border-t-2" style={{ borderColor: fill }} />
                  ) : null}
                </div>
              ) : null}
              <div className="flex w-full items-center justify-between gap-2">
                <div className="font-medium">{name as React.ReactNode}</div>
                <div>{typeof value === "number" ? value.toLocaleString() : value}</div>
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ChartTooltip(props: TooltipProps<any, any>) {
  return <Tooltip {...props} />
}

type LegendPayload = {
  value: string;
  dataKey: string;
  color: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: Record<string, any>;
}

export function ChartLegendContent({ 
  nameKey, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { nameKey?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      {(props as {payload?: LegendPayload[]})?.payload?.map((payload: LegendPayload, index: number) => {
        const name = nameKey
          ? payload.payload?.[nameKey] ?? payload.value
          : payload.value
        const fill = payload.color || "currentColor"
        
        return (
          <div key={`item-${index}`} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: fill }}
            />
            <span>{name}</span>
          </div>
        )
      })}
    </div>
  )
}

export function ChartLegend(props: LegendProps) {
  // @ts-expect-error - Recharts has incompatible types for Legend
  return <Legend {...props} />
} 