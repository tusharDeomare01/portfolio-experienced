import * as React from "react";

export interface DialogProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface DialogTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export declare const Dialog: React.FC<DialogProps>;
export declare const DialogTrigger: React.ForwardRefExoticComponent<
  DialogTriggerProps & React.RefAttributes<HTMLDivElement>
>;
export declare const DialogContent: React.ForwardRefExoticComponent<
  DialogContentProps & React.RefAttributes<HTMLDivElement>
>;
export declare const DialogHeader: React.ForwardRefExoticComponent<
  DialogHeaderProps & React.RefAttributes<HTMLDivElement>
>;
export declare const DialogTitle: React.ForwardRefExoticComponent<
  DialogTitleProps & React.RefAttributes<HTMLHeadingElement>
>;
export declare const DialogDescription: React.ForwardRefExoticComponent<
  DialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>
>;
export declare const DialogFooter: React.ForwardRefExoticComponent<
  DialogFooterProps & React.RefAttributes<HTMLDivElement>
>;

