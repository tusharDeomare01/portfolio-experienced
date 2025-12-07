import * as React from "react";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportRef?: React.RefObject<HTMLDivElement>;
  maxHeight?: number | string;
  showScrollbars?: boolean;
  scrollable?: boolean;
  orientation?: "vertical" | "horizontal" | "both";
  smooth?: boolean;
  theme?: "default" | "minimal" | "none";
}

export declare const ScrollArea: React.ForwardRefExoticComponent<
  ScrollAreaProps & React.RefAttributes<HTMLDivElement>
>;

