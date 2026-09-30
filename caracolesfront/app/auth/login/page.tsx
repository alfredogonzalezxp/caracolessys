"use client";
import React from 'react';
import LoginForm from '@/app/auth/LoginForm';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/*
React moved from classes to functions around 2019 
(with the introduction of Hooks). Functions are 
simpler, shorter, and more powerful. Classes still 
work but are considered legacy code.
*/
const LoginPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
/*
 Every time isAuthenticated changes — check if the user is 
 logged in. If yes, redirect them to /dashboard automatically."

 You can use many useEffect hooks as you want.
*/
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]); //Empty array means run only once
/*
 [isAuthenticated, router]
//      ↑              ↑
//  watch this    watch this
//  if it changes → run the effect again
//  if it doesn't change → skip it
*/
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-slate-950 pt-20 bg-[url('/snail_racing_hero.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-0"></div>
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-fuchsia-500/20 rounded-full blur-3xl opacity-60 mix-blend-screen animate-blob"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-cyan-500/20 rounded-full blur-3xl opacity-60 mix-blend-screen animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full px-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
