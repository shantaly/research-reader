'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const handleHashBasedAuth = async () => {
      try {
        const hash = window.location.hash;
        if (!hash) return;

        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Error setting session:', error);
            router.push('/auth/auth-code-error?error=session_error');
            return;
          }

          // Clear the hash from the URL
          window.location.hash = '';
          router.refresh();
        }
      } catch (error) {
        console.error('Error handling hash-based auth:', error);
        router.push('/auth/auth-code-error?error=unexpected');
      }
    };

    handleHashBasedAuth();
  }, [router]);

  return <>{children}</>;
}  