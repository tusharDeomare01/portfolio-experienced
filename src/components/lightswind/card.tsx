import * as React from "react";
import { cn } from "../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      hoverable = false,
      bordered = false,
      compact = false,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg bg-background/70 text-card-foreground shadow-sm",
        bordered ? "border" : "border  ",
        hoverable ? "transition-shadow duration-200 hover:shadow-md" : "",
        compact ? "p-3" : "p-0",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: "default" | "compact" | "relaxed";
}

// Hoisted to module scope — never re-allocated
const HEADER_SPACING = {
  compact: "flex flex-col space-y-1 p-3 sm:p-4",
  default: "flex flex-col space-y-1.5 p-4 sm:p-6",
  relaxed: "flex flex-col space-y-2 p-6 sm:p-8",
} as const;

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, spacing = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(HEADER_SPACING[spacing], className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "sm" | "default" | "lg";
}

// Hoisted to module scope
const TITLE_SIZE = {
  sm: "text-base sm:text-lg",
  default: "text-xl sm:text-2xl",
  lg: "text-2xl sm:text-3xl",
} as const;

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, as = "h3", size = "default", ...props }, ref) => {
    const Component = as;
    return (
      <Component
        ref={ref}
        className={cn(
          "font-semibold leading-none tracking-tight",
          TITLE_SIZE[size],
          className
        )}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle";

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "xs" | "sm" | "default";
}

// Hoisted to module scope
const DESC_SIZE = {
  xs: "text-xs",
  sm: "text-sm",
  default: "text-sm",
} as const;

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, size = "default", ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-muted-foreground", DESC_SIZE[size], className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  removeTopPadding?: boolean;
  padding?: "none" | "sm" | "default" | "lg";
}

// Hoisted to module scope
const CONTENT_PADDING = {
  none: "p-0",
  sm: "px-3 sm:px-4 py-2 sm:py-3",
  default: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
} as const;

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  (
    { className, removeTopPadding = true, padding = "default", ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        CONTENT_PADDING[padding],
        removeTopPadding && padding !== "none" ? "pt-0" : "",
        className
      )}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end" | "between" | "around";
  direction?: "row" | "column";
}

// Hoisted to module scope
const FOOTER_ALIGN = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
} as const;

const FOOTER_DIR = {
  row: "flex-row",
  column: "flex-col",
} as const;

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = "center", direction = "row", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-6 pt-0",
        FOOTER_ALIGN[align],
        FOOTER_DIR[direction],
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
