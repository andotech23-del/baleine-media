import "../styles/globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Cordia",
  description: "Healthcare automation for modern practices"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
