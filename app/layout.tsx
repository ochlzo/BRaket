import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/app/providers";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AuthSessionHydrator } from "@/components/shared/auth/auth-session-hydrator";

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
    data: { session },
  } = await supabase.auth.getSession();
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn("h-full", "antialiased", plusJakartaSans.variable, geistMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <AuthSessionHydrator
            initialSession={{
              accessToken: session?.access_token ?? null,
              refreshToken: session?.refresh_token ?? null,
              userId: session?.user?.id ?? null,
              email: session?.user?.email ?? null,
            }}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
