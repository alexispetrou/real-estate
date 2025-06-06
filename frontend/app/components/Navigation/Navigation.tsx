"use client";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import { User as CustomUser } from "../../types/types";
import {
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../../firebase/config"; // Add this import

export default function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<FirebaseUser | null>(null); // Use Firebase's User type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // This is a Firebase User, not your custom User
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-blue-500">
            Real Estate
          </Link>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <NavLink href="/" label="Home" current={pathname === "/"} />
          <NavLink
            href="/properties"
            label="Properties"
            current={pathname === "/properties"}
          />
          <NavLink
            href="/about"
            label="About"
            current={pathname === "/about"}
          />
          <NavLink
            href="/career"
            label="Career"
            current={pathname === "/career"}
          />

          {!loading &&
            (user ? (
              <div className="flex items-center space-x-4">
                <NavLink
                  href="/dash"
                  label={<FaUser />}
                  current={pathname === "/dashboard"}
                />
              </div>
            ) : (
              <NavLink
                href="/authentication"
                label={<FaUser />}
                current={pathname === "/authentication"}
              />
            ))}
        </div>

        <div className="md:hidden">
          <button className="p-2 rounded-md text-gray-500 hover:text-blue-500 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  label,
  current,
}: {
  href: string;
  label: string | JSX.Element;
  current: boolean;
}) {
  return (
    <Link
      href={href}
      className={`text-lg font-medium transition-colors duration-200 ${
        current
          ? "text-blue-500 border-b-2 border-blue-500"
          : "text-gray-600 hover:text-blue-500"
      }`}
    >
      {label}
    </Link>
  );
}
