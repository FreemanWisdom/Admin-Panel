"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";

import { ToastMessage } from "@/types";
import { cn } from "@/lib/utils";

type ToastRecord = ToastMessage & { id: string; open: boolean };

interface ToastContextValue {
  pushToast: (message: ToastMessage) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface AppToastProviderProps {
  children: ReactNode;
}

export function AppToastProvider({ children }: AppToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const pushToast = useCallback((message: ToastMessage) => {
    const id = crypto.randomUUID();

    setToasts((previous) => [
      ...previous,
      {
        id,
        open: true,
        ...message,
      },
    ]);
  }, []);

  const handleOpenChange = useCallback((id: string, open: boolean) => {
    setToasts((previous) =>
      previous.map((toast) => (toast.id === id ? { ...toast, open } : toast)),
    );

    if (!open) {
      setTimeout(() => {
        setToasts((previous) => previous.filter((toast) => toast.id !== id));
      }, 150);
    }
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right" duration={3500}>
        {children}
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            open={toast.open}
            onOpenChange={(open) => handleOpenChange(toast.id, open)}
            className={cn(
              "group relative grid w-[360px] grid-cols-[1fr_auto] items-start gap-x-3 rounded-md border border-border bg-surface p-4 shadow-card",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              toast.variant === "success" && "border-success/40",
              toast.variant === "warning" && "border-warning/40",
              toast.variant === "danger" && "border-danger/40",
            )}
          >
            <div>
              <ToastPrimitive.Title className="font-semibold">
                {toast.title}
              </ToastPrimitive.Title>
              {toast.description ? (
                <ToastPrimitive.Description className="mt-1 text-sm text-muted-foreground">
                  {toast.description}
                </ToastPrimitive.Description>
              ) : null}
            </div>
            <ToastPrimitive.Close className="focus-ring rounded p-1 text-muted-foreground transition-colors hover:text-foreground">
              <X className="size-4" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex max-h-screen w-[390px] flex-col gap-2 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function Toaster() {
  return null;
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside AppToastProvider");
  }

  return context;
}
