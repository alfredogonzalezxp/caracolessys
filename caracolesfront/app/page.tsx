"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const raceFavorites = [
    { name: "Turbo Shell", odds: "2/1", status: "Racing Now", color: "text-emerald-400" },
    { name: "Slime Lightning", odds: "5/1", status: "Next Race", color: "text-fuchsia-400" },
    { name: "Slowpoke Steve", odds: "50/1", status: "Underdog", color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-fuchsia-500 selection:text-white pb-24 text-slate-300 font-sans">
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-black rounded-b-[4rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-b border-fuchsia-900/30">
        <div className="absolute inset-0 z-0">
          <img src="/snail_racing_hero.jpg" alt="Cyberpunk Neon Racing Snail" className="w-full h-full object-cover opacity-50 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950 z-0"></div>
        </div>
        
        {/* Neon Globs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none z-0"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/30 rounded-full blur-[150px] mix-blend-screen pointer-events-none z-0"></div>

        <div className="relative z-10 container mx-auto px-6 max-w-6xl flex flex-col lg:flex-row items-center gap-12 animate-fade-in-up">
          <div className="lg:w-3/5 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-[0.2em] uppercase mb-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Betting Open
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[1.1] uppercase drop-shadow-[0_0_20px_rgba(217,70,239,0.3)]">
              Turbo <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-500">
                Escargot
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
              The premier underground betting circuit for genetically enhanced racing snails. Place your bets, watch the slime trails glow, and win big in slow motion.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5 pt-6">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="group relative px-10 py-5 text-lg font-black text-white bg-fuchsia-600 rounded-xl overflow-hidden hover:scale-105 transition-all shadow-[0_0_30px_rgba(217,70,239,0.4)] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-emerald-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                  <span className="relative z-10 text-shadow-sm">View Your Bets</span>
                </Link>
              ) : (
                <Link
                  href="/auth/register"
                  className="group relative px-8 py-5 text-lg font-black text-white bg-fuchsia-600 rounded-xl overflow-hidden hover:scale-105 transition-all shadow-[0_0_30px_rgba(217,70,239,0.4)] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-cyan-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                  <span className="relative z-10 text-shadow-sm">Register</span>
                </Link>
              )}
            </div>
          </div>
          
          {/* Live Odds Board */}
          <div className="lg:w-2/5 w-full mt-12 lg:mt-0 relative group">
            <div className="absolute -inset-1 bg-gradient-to-b from-fuchsia-600 to-cyan-500 rounded-3xl blur opacity-40 group-hover:opacity-70 transition duration-1000"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                <h3 className="text-white font-black text-2xl uppercase tracking-wider">Live Odds</h3>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              
              <div className="space-y-4">
                {raceFavorites.map((snail, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-fuchsia-500/50 transition-colors cursor-pointer group/bet">
                    <div>
                      <div className={`font-bold ${snail.color} group-hover/bet:text-white transition-colors`}>{snail.name}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">{snail.status}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-2xl text-white">{snail.odds}</div>
                      <div className="text-[10px] text-fuchsia-400 uppercase">Payout</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tracks Section */}
      <div className="relative z-10 -mt-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Upcoming Tracks</h2>
             <p className="text-emerald-400 mt-2 font-medium tracking-wide">Where legends are made (very slowly).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Track 1 */}
            <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] group">
              <div className="h-40 bg-slate-800 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] z-0"></div>
                <h3 className="relative z-10 font-black text-3xl text-slate-700 group-hover:text-emerald-500 transition-colors uppercase italic tracking-tighter">Neon Garden</h3>
              </div>
              <div className="p-6">
                <div className="flex justify-between text-sm text-slate-400 mb-2"><span>Distance:</span><span className="text-white font-bold">10 Meters</span></div>
                <div className="flex justify-between text-sm text-slate-400 mb-6"><span>Surface:</span><span className="text-white font-bold">Wet Leaves</span></div>
                <button className="w-full py-3 bg-slate-800 text-emerald-400 font-bold rounded-xl hover:bg-emerald-500 hover:text-black transition-colors uppercase tracking-wider text-sm">View Race Card</button>
              </div>
            </div>

            {/* Track 2 */}
            <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-fuchsia-500/50 transition-all hover:shadow-[0_0_30px_rgba(217,70,239,0.15)] group">
              <div className="h-40 bg-slate-800 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] z-0"></div>
                <h3 className="relative z-10 font-black text-3xl text-slate-700 group-hover:text-fuchsia-500 transition-colors uppercase italic tracking-tighter">Cyber Puddle</h3>
              </div>
              <div className="p-6">
                <div className="flex justify-between text-sm text-slate-400 mb-2"><span>Distance:</span><span className="text-white font-bold">5 Meters</span></div>
                <div className="flex justify-between text-sm text-slate-400 mb-6"><span>Surface:</span><span className="text-white font-bold">Oily Tarmac</span></div>
                <button className="w-full py-3 bg-slate-800 text-fuchsia-400 font-bold rounded-xl hover:bg-fuchsia-500 hover:text-black transition-colors uppercase tracking-wider text-sm">View Race Card</button>
              </div>
            </div>

            {/* Track 3 */}
            <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group">
              <div className="h-40 bg-slate-800 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] z-0"></div>
                <h3 className="relative z-10 font-black text-3xl text-slate-700 group-hover:text-cyan-500 transition-colors uppercase italic tracking-tighter">The Salt Flats</h3>
              </div>
              <div className="p-6">
                <div className="flex justify-between text-sm text-slate-400 mb-2"><span>Distance:</span><span className="text-white font-bold">Danger (1m)</span></div>
                <div className="flex justify-between text-sm text-slate-400 mb-6"><span>Surface:</span><span className="text-white font-bold">Coarse Sand</span></div>
                <button className="w-full py-3 bg-slate-800 text-cyan-400 font-bold rounded-xl hover:bg-cyan-500 hover:text-black transition-colors uppercase tracking-wider text-sm">View Race Card</button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default HomePage;