import Link from "next/link";
import type { ReactNode } from "react";

interface ErrorLayoutProps {
  children: ReactNode;
}

export default function ErrorLayout({ children }: ErrorLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary text-text-primary">
      {/* Error content */}
      <div className="text-center">
        {children}
        <Link
          href="/"
          className="mt-4 inline-block rounded bg-accent px-4 py-2 text-white transition-opacity hover:opacity-80"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
