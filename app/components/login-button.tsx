'use client';

import { signIn, useSession } from 'next-auth/react';

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (session) {
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="font-body text-sm text-[#4A3B32]/60 animate-pulse tracking-wide">
        Verifying session...
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="font-body flex items-center justify-center gap-3 bg-white text-[#4A3B32] border border-[#4A3B32]/20 px-8 py-3.5 rounded-sm text-sm uppercase tracking-widest hover:bg-[#F6F5F4] transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 48 48"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="#4285F4"
          d="M43.611 20.083h-1.611V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#34A853"
          d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
          fill="#FBBC05"
          d="M4 24c0 2.953.597 5.772 1.679 8.315l6.583-4.819C11.745 26.336 11 24.228 11 24c0-.228.023-.453.067-.674L6.306 14.691C4.656 17.783 4 20.931 4 24z"
        />
        <path
          fill="#EA4335"
          d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.316-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        />
      </svg>
      Continue with Google
    </button>
  );
}
