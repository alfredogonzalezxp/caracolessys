"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const { isAuthenticated, logout, role } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
  // setScrolled changes the scrolled to true of false
  // window.scrollY > 10 means that if the user scrolls more than 
  // 10px the scrolled will be true if not is false
      setScrolled(window.scrollY > 10);
    };
  /*
  so this window.addEventListener('scroll', handleScroll); 
  tells tha the event sccroll is listen for the 
  applijcation and when that happends cal handlescroll 
  and executes  setScrolled(window.scrollY > 10); i mean 
  this useefffect passed once but this event scroll or 
  clic o whatever others events execurtes handlescroll
  */
    window.addEventListener('scroll', handleScroll)
  /*
  ok so. return () => window.removeEventListener('scroll', 
  handleScroll); works when whe close the window  or the 
  current page.  all the listeners needs to remove so with 
  return() => window.removeEventListener('scroll', 
  handleScroll);  do that.
  
  */ 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);// This means only do it once

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-white/50 py-3'
          : 'bg-transparent py-5'
      }`}
    >
  
      <nav className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-amber-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-green-500/30 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
            S
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-900 to-green-700">
            SnailSite
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 tracking-wide">
            <Link
              href="/"
              className={`hover:text-green-600 transition-colors ${pathname === '/' ? 'text-green-600' : ''}`}
            >
              Home
            </Link>
            {isAuthenticated && (// if the user is authenticated go to /dashboard
              <Link
                href="/dashboard"
                className={`hover:text-green-600 transition-colors ${pathname === '/dashboard' ? 'text-green-600' : ''}`}
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all shadow-sm active:scale-95"
              >
                Log Out
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="group relative px-6 py-2.5 text-sm font-bold text-white bg-green-900 rounded-xl overflow-hidden shadow-lg hover:shadow-green-500/30 transition-all active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-amber-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  Sign In
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;