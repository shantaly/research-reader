'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase, signOut } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push('/auth/signin');
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 border-solid bottom-2 mb-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Research Reader
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
                <span className="text-sm text-gray-500">
                  {user.email}
                </span>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 