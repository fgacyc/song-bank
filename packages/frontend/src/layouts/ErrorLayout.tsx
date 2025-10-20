import Link from "next/link";
import type { ReactNode } from "react";

interface ErrorLayoutProps {
  children: ReactNode;
  theme: string;
  changeTheme: (theme: string) => void;
}

export default function ErrorLayout({
  children,
  theme,
  changeTheme,
}: ErrorLayoutProps) {
  return (
    <div className="bg-bg-primary text-text-primary flex min-h-screen flex-col items-center justify-center">
      {/* Error content */}
      <div className="text-center">
        {children}
        <Link
          href="/"
          className="bg-accent mt-4 inline-block rounded px-4 py-2 text-white transition-opacity hover:opacity-80"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
