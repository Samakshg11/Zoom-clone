'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function JoinDirectCodePage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  useEffect(() => {
    if (resolvedParams.code) {
      router.replace(`/join?code=${encodeURIComponent(resolvedParams.code)}`);
    }
  }, [resolvedParams, router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans">
      <Loader2 className="w-8 h-8 text-[#2D8CFF] animate-spin mb-2" />
      <p className="text-xs text-gray-500 font-medium">Redirecting to join screen...</p>
    </div>
  );
}
