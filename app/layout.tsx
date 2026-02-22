import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Starter App",
  description: `Reusable starter application that will serve as a foundation for future projects and provide 
  authentication, user profiles, and proper database security out of the box.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
