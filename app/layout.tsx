import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { Providers } from "@/app/providers";
import { AuthSessionHydrator } from "@/components/shared/auth/auth-session-hydrator";
import { PolicyHelpWidget } from "@/components/shared/policy-help-widget";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BRaket",
  description: "Talent discovery and commission platform for Bicol University students.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn("h-full", "antialiased", plusJakartaSans.variable, geistMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <TooltipProvider>
            <AuthSessionHydrator
              initialSession={{
                accessToken: null,
                refreshToken: null,
                userId: user?.id ?? null,
                email: user?.email ?? null,
              }}
            />
            {children}
            <PolicyHelpWidget />
            <Toaster position="top-center" />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
