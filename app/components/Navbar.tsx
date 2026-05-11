'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on client side
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
    setUser(username);
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    router.push('/');
  };

  if (isLoading) {
    return <nav className="bg-blue-600 text-white p-4">Loading...</nav>;
  }

  return (
    <nav className="bg-blue-600 text-white p-4 mb-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold hover:opacity-80">
          📚 Student Manager
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/students" className="hover:opacity-80">
                👥 Students
              </Link>
              <Link href="/grades" className="hover:opacity-80">
                📊 Grades
              </Link>
              <span className="text-sm">Welcome, <strong>{user}</strong></span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:opacity-80">
                🔐 Login
              </Link>
              <Link href="/register" className="hover:opacity-80">
                ✍️ Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
