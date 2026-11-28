"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Check, X } from "lucide-react";

// Client Component: toasts appear and disappear over time (state + timers).

interface Toast {
  id: number;
  message: string;
  action?: { label: string; href: string };
}

interface ToastContextValue {
  notify: (message: string, action?: Toast["action"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, action?: Toast["action"]) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev.slice(-2), { id, message, action }]);
      window.setTimeout(() => dismiss(id), 4500);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="no-print pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex w-full max-w-md animate-rise items-center gap-3 rounded-full bg-ink py-2.5 pl-4 pr-2 text-sm text-snow shadow-lift"
          >
            <Check className="size-4 shrink-0 text-apricot-bright" aria-hidden />
            <span className="flex-1">{toast.message}</span>
            {toast.action && (
              <Link
                href={toast.action.href}
                className="rounded-full px-3 py-1 font-medium text-apricot-soft underline-offset-4 hover:underline"
              >
                {toast.action.label}
              </Link>
            )}
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="grid size-7 place-items-center rounded-full text-snow/70 hover:bg-snow/10 hover:text-snow"
              aria-label="Dismiss notification"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
