"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, signup } from '@/api/api';
import { isAxiosError } from 'axios';
import { useAuth } from '@/app/context/AuthContext';

interface LoginFormProps {
  initialIsLogin?: boolean;
}

const LoginForm = ({ initialIsLogin = true }: LoginFormProps) => {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  
  // Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        // Login Flow
        const response = await login({ email, password });
        authLogin(response.token || response.accessToken);
        setLoginSuccess(true);
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        // Registration Flow
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await signup({ name, email, password, confirm_password: confirmPassword });
        // Automatically switch to login on success
        setIsLogin(true);
        setError("Registration successful! Please sign in.");
      }
    } catch (err: any) {
      if (err instanceof Error && err.message === "Passwords do not match") {
        setError(err.message);
      } else if (isAxiosError(err)) {
        const responseData = err.response?.data;
        let errorMessage = 'System error. Please verify your data.';
        if (typeof responseData === 'string' && responseData) errorMessage = responseData;
        else if (responseData?.message) errorMessage = responseData.message;
        else if (responseData?.error) errorMessage = responseData.error;
        setError(errorMessage);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10 animate-fade-in-up">
      <div className="bg-slate-900/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-fuchsia-900/50 relative overflow-hidden">
        {/* Decorative Internal Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

        {loginSuccess ? ( 
          <div className="text-center py-12 relative z-10">
            <div className="w-20 h-20 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-500">
              <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Success!</h2>
            <p className="text-fuchsia-400 font-bold uppercase tracking-widest text-sm">Entering the pit...</p>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(217,70,239,0.4)] border border-fuchsia-500 text-3xl">
                🐌
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-wider drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">
                {isLogin ? 'Pit Access' : 'New Bettor'}
              </h2>
              <p className="text-slate-400 font-medium mt-2 text-sm uppercase tracking-widest">
                {isLogin ? 'Authenticate to place bets' : 'Register for the underground circuit'}
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className={`p-4 text-sm font-bold rounded-xl flex items-start gap-3 backdrop-blur-sm border ${error.includes('successful') ? 'text-emerald-400 bg-emerald-950/50 border-emerald-500/50' : 'text-red-400 bg-red-950/50 border-red-500/50'}`}>
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              <div className="space-y-5">
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Alias / Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-950 border border-slate-700 rounded-xl focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all placeholder-slate-600 text-white font-bold shadow-inner"
                      placeholder="High Roller"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Comms Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-950 border border-slate-700 rounded-xl focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all placeholder-slate-600 text-white font-bold shadow-inner"
                    placeholder="bettor@underground.net"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                      Access Code
                    </label>
                    {isLogin && (
                      <a href="#" className="text-xs font-black text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider">
                        Override?
                      </a>
                    )}
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-950 border border-slate-700 rounded-xl focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all placeholder-slate-600 text-white font-bold shadow-inner"
                    placeholder="••••••••"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Confirm Access Code
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required={!isLogin}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-950 border border-slate-700 rounded-xl focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all placeholder-slate-600 text-white font-bold shadow-inner"
                      placeholder="••••••••"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.3)] text-sm font-black text-white bg-fuchsia-600 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] transition-all mt-8 uppercase tracking-widest"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-cyan-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                {loading ? (
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Decrypting...
                  </span>
                ) : (
                  <span className="relative z-10">{isLogin ? 'Enter Pit' : 'Register'}</span>
                )}
              </button>

              <div className="pt-6 mt-6 border-t border-slate-800 text-center text-xs font-black tracking-widest text-slate-500 uppercase">
                {isLogin ? (
                  <>
                    No account?{' '}
                    <button type="button" onClick={() => setIsLogin(false)} className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">
                      Create one
                    </button>
                  </>
                ) : (
                  <>
                    Already registered?{' '}
                    <button type="button" onClick={() => setIsLogin(true)} className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">
                      Authenticate
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;