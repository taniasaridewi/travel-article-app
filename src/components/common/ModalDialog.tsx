import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface ModalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
}

const ModalDialog: React.FC<ModalDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  trigger,
  className,
}) => {
  const dialogContentClasses = `bg-brand-surface text-brand-text border-brand-muted/30 ${className || "sm:max-w-[425px]"}`;

  if (trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className={dialogContentClasses}>
          {(title || description) && (
            <DialogHeader>
              {title && (
                <DialogTitle className="font-heading text-brand-text text-xl">
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription className="text-brand-muted">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>
          )}
          <div className="py-4">{children}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClasses}>
        {(title || description) && (
          <DialogHeader>
            {title && (
              <DialogTitle className="font-heading text-brand-text text-xl">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-brand-muted">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className="py-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDialog;
