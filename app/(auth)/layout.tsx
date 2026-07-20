import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 md:p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl tracking-tight text-primary transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <span>ResumeIQ AI</span>
          </Link>
        </div>

        {/* Auth Forms (Login, Signup, Forgot Password, etc.) render here */}
        {children}
      </div>
    </div>
  );
}