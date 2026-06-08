import { TopNav } from "./TopNav";
import { WorkspaceProvider } from "@/lib/workspace";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <div className="app-shell flex min-h-screen flex-col font-sans">
        <TopNav />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </WorkspaceProvider>
  );
}
