import { StoreProvider } from "@/lib/store";
import { ToastProvider } from "@/components/terminal/Toast";

export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <ToastProvider>{children}</ToastProvider>
    </StoreProvider>
  );
}
