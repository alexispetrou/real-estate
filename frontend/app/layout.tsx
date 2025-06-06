import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "./components/Navigation";
import { AuthProvider } from "./components/Context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Real Estate Website",
  description: "Find your dream property",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation></Navigation>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
