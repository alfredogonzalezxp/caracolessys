import React, { useState, useEffect, useRef } from "react";
import { updateUser, getUser, depositSnailPay, getPaymentHistory, deleteSnailPayTransaction } from "@/api/api";
import { useAuth } from "@/app/context/AuthContext";

interface User {
  id: number;
  name: string;
  email: string;
}

const UserSpace = () => {
  const { role } = useAuth(); // Keep role if context still provides it, otherwise it can be ignored
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Profile State
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [profileMessage, setProfileMessage] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [showProfileConfig, setShowProfileConfig] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  // SnailPay State
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositMessage, setDepositMessage] = useState("");
  const [depositForm, setDepositForm] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    fullName: "",
    amount: 500
  });

  const modalEndRef = useRef<HTMLDivElement>(null);

  const [depositReport, setDepositReport] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    if ((depositMessage || depositReport || isGeneratingReport) && modalEndRef.current) {
      modalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [depositMessage, depositReport, isGeneratingReport]);

  // Simulated Dashboard Data
  const [dashData, setDashData] = useState({
    balance: 1250.00,
    betsWon: 4,
    betsLost: 2,
    snailWins: [
      { id: 1, name: "Turbo Shell", wins: 2, bg: "bg-fuchsia-500", shadow: "shadow-[0_0_15px_rgba(217,70,239,0.5)]", text: "text-fuchsia-400" },
      { id: 2, name: "Slime Lightning", wins: 1, bg: "bg-cyan-500", shadow: "shadow-[0_0_15px_rgba(6,182,212,0.5)]", text: "text-cyan-400" },
      { id: 3, name: "Slowpoke Steve", wins: 0, bg: "bg-amber-500", shadow: "shadow-[0_0_15px_rgba(245,158,11,0.5)]", text: "text-amber-400" },
      { id: 4, name: "Neon Crawler", wins: 2, bg: "bg-emerald-500", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.5)]", text: "text-emerald-400" },
      { id: 5, name: "Cyber Slug", wins: 1, bg: "bg-violet-500", shadow: "shadow-[0_0_15px_rgba(139,92,246,0.5)]", text: "text-violet-400" },
      { id: 6, name: "Plasma Glider", wins: 0, bg: "bg-rose-500", shadow: "shadow-[0_0_15px_rgba(244,63,94,0.5)]", text: "text-rose-400" }
    ]
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        let userId = 0;
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.userId || payload.id;
        }

        if (userId) {
          // 1. Load or initialize per-user dashboard data (random balance for new users)
          const storageKey = `snailDashDataV4_user_${userId}`;
          const storedData = localStorage.getItem(storageKey);
          if (storedData) {
            setDashData(JSON.parse(storedData));
          } else {
            const randomStartingBalance = Math.floor(Math.random() * 2000) + 500;

            const snailNames = [
              "Turbo Shell", "Slime Lightning", "Slowpoke Steve", "Neon Crawler", "Cyber Slug",
              "Plasma Glider", "Velocity Vortex", "Quantum Quake", "Atomic Goo", "Nitro Nomad",
              "Cosmic Creeper", "Galactic Gastropod", "Zenith Zoomer", "Hyper Helix", "Mecha Mollusk",
              "Apex Accelerator", "Slipstream", "Warp Weaver", "Pulse Pacer", "Phantom Trail"
            ];

            const shuffledNames = snailNames.sort(() => 0.5 - Math.random()).slice(0, 6);

            const colors = [
              { bg: "bg-fuchsia-500", shadow: "shadow-[0_0_15px_rgba(217,70,239,0.5)]", text: "text-fuchsia-400" },
              { bg: "bg-cyan-500", shadow: "shadow-[0_0_15px_rgba(6,182,212,0.5)]", text: "text-cyan-400" },
              { bg: "bg-amber-500", shadow: "shadow-[0_0_15px_rgba(245,158,11,0.5)]", text: "text-amber-400" },
              { bg: "bg-emerald-500", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.5)]", text: "text-emerald-400" },
              { bg: "bg-violet-500", shadow: "shadow-[0_0_15px_rgba(139,92,246,0.5)]", text: "text-violet-400" },
              { bg: "bg-rose-500", shadow: "shadow-[0_0_15px_rgba(244,63,94,0.5)]", text: "text-rose-400" }
            ];

            let totalWins = 0;
            const randomizedSnails = shuffledNames.map((name, index) => {
              const wins = Math.floor(Math.random() * 6);
              totalWins += wins;
              return {
                id: index + 1,
                name,
                wins,
                ...colors[index]
              };
            });

            const initialDashData = {
              balance: randomStartingBalance,
              betsWon: totalWins,
              betsLost: Math.floor(Math.random() * 15),
              snailWins: randomizedSnails
            };
            localStorage.setItem(storageKey, JSON.stringify(initialDashData));
            setDashData(initialDashData);
          }

          // 2. Fetch real DB user data
          const userData = await getUser(userId);
          setCurrentUser(userData);
          setProfileForm(prev => ({
            ...prev,
            name: userData.name || "",
            email: userData.email || ""
          }));

          try {
            const history = await getPaymentHistory(userId);
            setPaymentHistory(history);
          } catch (err) {
            console.error("Failed to fetch payment history", err);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDepositing(true);
    setDepositMessage("");

    try {
      const token = localStorage.getItem('accessToken');
      let userId = 0;
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userId || payload.id || 0;
      }

      let reportResponse;
      try {
        reportResponse = await depositSnailPay({ ...depositForm, userId, payerEmail: currentUser?.email });

        // Success case: Update balances
        const storageKey = `snailDashDataV4_user_${userId}`;
        const newData = { ...dashData, balance: dashData.balance + Number(depositForm.amount) };
        setDashData(newData);
        localStorage.setItem(storageKey, JSON.stringify(newData));

        if (userId) {
          const history = await getPaymentHistory(userId);
          setPaymentHistory(history);
        }

        setDepositMessage(`Success: Deposit processed`);
      } catch (error: any) {
        reportResponse = error.response?.data;
        setDepositMessage(`Error: ${reportResponse?.status_detail || 'Transaction failed'}`);
      }

      // Generate Report process
      setIsGeneratingReport(true);
      setTimeout(() => {
        setIsGeneratingReport(false);
        setDepositReport(reportResponse);
        setDepositMessage("");
      }, 3000);

    } catch (error: any) {
      console.error("SnailPay deposit failed", error);
      setDepositMessage("Failed to process SnailPay deposit.");
      setIsGeneratingReport(false);
    } finally {
      setIsDepositing(false);
    }
  };

  const handleDeleteTransaction = async (txId: number) => {
    if (!confirm("Are you sure you want to delete this transaction from your history?")) return;
    try {
      await deleteSnailPayTransaction(txId);
      setPaymentHistory(prev => prev.filter(tx => tx.id !== txId));
    } catch (error) {
      console.error("Failed to delete transaction", error);
      alert("Error deleting transaction.");
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileMessage("");

    if (profileForm.password && profileForm.password !== profileForm.confirmPassword) {
      setProfileMessage("Error: Passwords do not match.");
      setUpdatingProfile(false);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      let userId = 0;
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userId || payload.id || 0;
      }

      if (userId === 0) {
        setProfileMessage("Error: Could not determine user ID from token to update profile.");
        setUpdatingProfile(false);
        return;
      }

      const updateData: { name?: string; email?: string; password?: string; confirm_password?: string } = {};
      if (profileForm.name && profileForm.name !== currentUser?.name) updateData.name = profileForm.name;
      if (profileForm.email && profileForm.email !== currentUser?.email) updateData.email = profileForm.email;
      if (profileForm.password) {
        updateData.password = profileForm.password;
        updateData.confirm_password = profileForm.confirmPassword;
      }

      if (Object.keys(updateData).length === 0) {
        setProfileMessage("No changes to update.");
        setUpdatingProfile(false);
        return;
      }

      const updatedUser = await updateUser(userId, updateData);
      setCurrentUser(updatedUser);
      setProfileMessage("Profile updated successfully!");
      setProfileForm(prev => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (error: any) {
      console.error("Profile update failed", error);
      setProfileMessage(error.response?.data?.error || "Failed to update profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse flex space-x-4 p-12">
      <div className="flex-1 space-y-6 py-1">
        <div className="h-8 bg-slate-800 rounded w-3/4"></div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-4 bg-slate-800 rounded col-span-2"></div>
            <div className="h-4 bg-slate-800 rounded col-span-1"></div>
          </div>
          <div className="h-4 bg-slate-800 rounded w-5/6"></div>
        </div>
      </div>
    </div>;
  }

  return (
    <div className="animate-fade-in-up w-full mt-4 pb-12 font-sans">
      {/* Header Section */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6 border-b border-fuchsia-900/30 pb-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(217,70,239,0.3)]">
            Welcome, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Bettor'}
          </h2>
          <p className="text-fuchsia-400 mt-2 text-sm uppercase tracking-widest font-bold">Manage your credentials and aliases</p>
        </div>

        {/* Toggle Profile Button */}
        <button
          onClick={() => setShowProfileConfig(!showProfileConfig)}
          className="group relative px-6 py-3 text-xs font-black text-white bg-transparent border border-fuchsia-600 rounded-xl overflow-hidden transition-all shadow-[0_0_15px_rgba(217,70,239,0.2)] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest"
        >
          <div className="absolute inset-0 bg-fuchsia-600/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative z-10 text-shadow-sm">{showProfileConfig ? 'Close Config' : 'My Profile'}</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Dashboard Overview */}
        {!showProfileConfig && (
          <div className="w-full space-y-8 animate-fade-in-up">
            {/* Top Row: Balance & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Balance Card */}
              <div className="md:col-span-2 bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] p-8 border border-emerald-900/50 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl mix-blend-screen pointer-events-none -mr-20 -mt-20"></div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Available Balance</h3>
                <div className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <span className="text-emerald-400 mr-1">$</span>{Math.floor(dashData.balance).toLocaleString()}<span className="text-2xl text-emerald-500/70">.{(dashData.balance % 1).toFixed(2).substring(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="group relative w-full flex-1 rounded-[1.5rem] bg-emerald-600 text-white font-black text-sm uppercase tracking-widest overflow-hidden transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 flex items-center justify-center p-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    SnailPay Deposit
                  </span>
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('accessToken');
                    window.location.href = '/';
                  }}
                  className="group relative w-full flex-1 rounded-[1.5rem] bg-red-950/50 text-red-400 border border-red-500/30 font-black text-sm uppercase tracking-widest overflow-hidden transition-all shadow-inner active:scale-95 flex items-center justify-center p-4 hover:bg-red-900/80 hover:text-white"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Disconnect
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Row: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Donut Chart: Win/Loss */}
              <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] p-8 border border-slate-700/50 shadow-[0_8px_30px_rgba(0,0,0,0.5)] lg:col-span-1">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 text-center">Bet History (Won / Lost)</h3>
                <div className="flex justify-center items-center relative mb-6">
                  {/* CSS Donut Chart */}
                  <div className="w-48 h-48 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(#10b981 0% ${(dashData.betsWon / (dashData.betsWon + dashData.betsLost)) * 100}%, #ef4444 ${(dashData.betsWon / (dashData.betsWon + dashData.betsLost)) * 100}% 100%)` }}>
                    <div className="w-32 h-32 bg-slate-900 rounded-full flex flex-col items-center justify-center shadow-inner">
                      <span className="text-2xl font-black text-white">{dashData.betsWon + dashData.betsLost}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bets</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                    <span className="text-xs font-black text-white uppercase tracking-wider">Won ({dashData.betsWon})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                    <span className="text-xs font-black text-white uppercase tracking-wider">Lost ({dashData.betsLost})</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart: Snail Victories */}
              <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] p-8 border border-slate-700/50 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col lg:col-span-2">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Daily Snail Victories</h3>
                <p className="text-xs text-slate-500 text-center mb-2 uppercase tracking-widest">Total Snail Wins: {dashData.betsWon}</p>
                <div className="text-xs sm:text-sm text-white font-bold text-center mb-8 flex flex-col xl:flex-row justify-center items-center gap-4 xl:gap-6 drop-shadow-md">
                  <span className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                    <span className="text-white font-black text-base">#</span>
                    <span className="tracking-wide">Races Won</span>
                  </span>
                  <span className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                    <span className="w-3 h-3 bg-white inline-block rounded-sm shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                    <span className="tracking-wide">Height = % Relative to Best Snail</span>
                  </span>
                </div>
                <div className="flex-1 flex items-end justify-around gap-4 pt-4 border-b border-slate-800 relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
                    <div className="border-t border-slate-600 w-full"></div>
                    <div className="border-t border-slate-600 w-full"></div>
                    <div className="border-t border-slate-600 w-full"></div>
                    <div className="border-t border-slate-600 w-full"></div>
                  </div>

                  {dashData.snailWins.map(snail => {
                    const maxWins = Math.max(...dashData.snailWins.map(s => s.wins), 1);
                    return (
                      <div key={snail.id} className="flex flex-col items-center gap-3 w-1/6 z-10">
                        <span className="text-lg font-black text-white drop-shadow-md">{snail.wins}</span>
                        <div className="w-full max-w-16 bg-slate-800 rounded-t-lg h-48 relative group">
                          <div className={`absolute bottom-0 w-full ${snail.bg} rounded-t-lg transition-all duration-1000 ${snail.shadow}`} style={{ height: `${Math.max((snail.wins / maxWins) * 100, 5)}%` }}></div>
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-t-lg"></div>
                        </div>
                        <span className={`text-[10px] sm:text-xs font-black ${snail.text} uppercase tracking-widest text-center leading-tight h-8 flex items-center justify-center`}>{snail.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* SnailPay Transaction History */}
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] p-8 border border-slate-700/50 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Recent SnailPay Transactions</h3>
              {paymentHistory.length === 0 ? (
                <p className="text-slate-500 text-sm text-center font-bold tracking-wider">No transaction history found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest">
                        <th className="pb-3 px-2">Date</th>
                        <th className="pb-3 px-2">Card</th>
                        <th className="pb-3 px-2">Amount</th>
                        <th className="pb-3 px-2 text-center">Status</th>
                        <th className="pb-3 px-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((tx) => (
                        <tr key={tx.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                          <td className="py-4 px-2 text-slate-400 text-xs sm:text-sm">{new Date(tx.created_at).toLocaleDateString()}</td>
                          <td className="py-4 px-2 text-slate-400 text-xs sm:text-sm font-mono tracking-widest">{tx.card_last4}</td>
                          <td className="py-4 px-2 font-black text-emerald-400 text-sm">${Number(tx.amount).toFixed(2)}</td>
                          <td className="py-4 px-2 text-center">
                            <span className="inline-block bg-emerald-900/50 text-emerald-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-emerald-500/30">
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <button
                              onClick={() => handleDeleteTransaction(tx.id)}
                              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors group"
                              title="Delete Transaction"
                            >
                              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Profile Card */}
        {showProfileConfig && (
          <div className="w-full lg:w-1/2 space-y-8 relative group animate-fade-in-up">
            <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600 to-cyan-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-700/50 p-8 md:p-10">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 rounded-2xl bg-slate-950 flex items-center justify-center text-white text-3xl font-black shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-500/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20"></div>
                  <span className="relative z-10">{currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "♠"}</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wider">Identity Config</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Update your underground alias</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">New Alias</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition-all text-white font-bold shadow-inner placeholder-slate-600"
                    placeholder="Leave blank to keep unchanged"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">New Comms Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition-all text-white font-bold shadow-inner placeholder-slate-600"
                    placeholder="Leave blank to keep unchanged"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">New Access Code</label>
                  <input
                    type="password"
                    value={profileForm.password}
                    onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition-all text-white font-bold shadow-inner placeholder-slate-600"
                    placeholder="Leave blank to keep unchanged"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Confirm New Access Code</label>
                  <input
                    type="password"
                    value={profileForm.confirmPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition-all text-white font-bold shadow-inner placeholder-slate-600"
                    placeholder="Confirm new code"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingProfile}
                  className={`group relative w-full py-4 mt-6 rounded-xl text-white font-black text-sm uppercase tracking-widest overflow-hidden transition-all ${updatingProfile ? 'bg-fuchsia-900/50 cursor-not-allowed border border-fuchsia-500/30' : 'bg-fuchsia-600 shadow-[0_0_20px_rgba(217,70,239,0.3)] active:scale-[0.98]'}`}
                >
                  {!updatingProfile && <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-cyan-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                  <span className="relative z-10">{updatingProfile ? 'Overwriting...' : 'Execute Changes'}</span>
                </button>

                {profileMessage && (
                  <div className={`mt-6 p-4 rounded-xl text-xs font-black uppercase tracking-widest text-center border backdrop-blur-sm ${profileMessage.includes('Error') || profileMessage.includes('Failed') ? 'bg-red-950/50 text-red-400 border-red-500/50' : 'bg-emerald-950/50 text-emerald-400 border-emerald-500/50'}`}>
                    {profileMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>

      {/* SnailPay Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-[2rem] p-8 w-full max-w-md shadow-[0_0_40px_rgba(16,185,129,0.2)] relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setShowDepositModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] shrink-0">
                <span className="text-2xl">💸</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider">SnailPay</h3>
                <p className="text-xs text-emerald-400 uppercase tracking-widest">Secure Deposit Gateway</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 mb-6 font-medium leading-relaxed">
              Add balance securely to bet on your favorite races.
              Make sure to fill all fields with valid information.
            </p>

            {depositReport ? (
              <div className="space-y-4 animate-fade-in text-slate-300">
                <div className={`p-4 rounded-xl border mb-6 ${depositReport.status === 'approved' ? 'bg-emerald-950/50 border-emerald-500/50' : 'bg-red-950/50 border-red-500/50'}`}>
                  <h4 className="font-black uppercase tracking-widest text-center text-sm mb-1">{depositReport.status === 'approved' ? 'Transaction Successful' : 'Transaction Rejected'}</h4>
                  <p className="text-xs text-center">{depositReport.status_detail}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block uppercase tracking-widest text-[10px] mb-1">Operation ID</span>
                    {depositReport.id}
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block uppercase tracking-widest text-[10px] mb-1">Status</span>
                    <span className={depositReport.status === 'approved' ? 'text-emerald-400' : 'text-red-400'}>{depositReport.status}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block uppercase tracking-widest text-[10px] mb-1">Amount</span>
                    ${depositReport.transaction_amount}
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block uppercase tracking-widest text-[10px] mb-1">Authorization</span>
                    {depositReport.authorization_code || 'N/A'}
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 col-span-2">
                    <span className="text-slate-500 block uppercase tracking-widest text-[10px] mb-1">Reference</span>
                    {depositReport.reference || 'N/A'}
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 col-span-2">
                    <span className="text-slate-500 block uppercase tracking-widest text-[10px] mb-1">Date</span>
                    {new Date(depositReport.date_created).toLocaleString()}
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block uppercase tracking-widest text-[10px] mb-1">Payer ID</span>
                    {depositReport.payer_id || 'N/A'}
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 truncate" title={depositReport.payer_email}>
                    <span className="text-slate-500 block uppercase tracking-widest text-[10px] mb-1">Payer Email</span>
                    {depositReport.payer_email || 'N/A'}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowDepositModal(false);
                    setDepositReport(null);
                  }}
                  className="w-full py-4 mt-6 bg-slate-800 rounded-xl text-white font-black text-sm uppercase tracking-widest hover:bg-slate-700 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                >
                  Close Report
                </button>
              </div>
            ) : (
              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
                  <input
                    required type="text"
                    value={depositForm.fullName}
                    onChange={(e) => setDepositForm({ ...depositForm, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 text-white"
                    placeholder="John Doe"
                    disabled={isDepositing || isGeneratingReport}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Card Number</label>
                  <input
                    required type="text"
                    value={depositForm.cardNumber}
                    onChange={(e) => setDepositForm({ ...depositForm, cardNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 text-white"
                    placeholder="0000 0000 0000 0000"
                    disabled={isDepositing || isGeneratingReport}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Expiry</label>
                    <input
                      required type="text"
                      value={depositForm.expirationDate}
                      onChange={(e) => setDepositForm({ ...depositForm, expirationDate: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 text-white"
                      placeholder="MM/YY"
                      disabled={isDepositing || isGeneratingReport}
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">CVV</label>
                    <input
                      required type="text"
                      value={depositForm.cvv}
                      onChange={(e) => setDepositForm({ ...depositForm, cvv: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 text-white"
                      placeholder="123"
                      disabled={isDepositing || isGeneratingReport}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-emerald-400 uppercase tracking-widest mb-1">Deposit Amount ($)</label>
                  <input
                    required type="number" min="1"
                    value={depositForm.amount}
                    onChange={(e) => setDepositForm({ ...depositForm, amount: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl focus:ring-2 focus:ring-emerald-500 text-emerald-400 font-black text-lg"
                    disabled={isDepositing || isGeneratingReport}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isDepositing || isGeneratingReport}
                  className="w-full py-4 mt-4 bg-emerald-600 rounded-xl text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 relative overflow-hidden"
                >
                  {isGeneratingReport ? (
                    <span className="flex items-center justify-center gap-2 animate-pulse">
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25"></circle>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75"></path>
                      </svg>
                      Generating Report...
                    </span>
                  ) : isDepositing ? 'Processing...' : 'Confirm Deposit'}
                </button>

                {depositMessage && (
                  <div className={`mt-4 p-3 rounded-lg text-xs font-black uppercase text-center border ${depositMessage.includes('Failed') || depositMessage.includes('Error') || depositMessage.includes('rejected') ? 'bg-red-950/50 text-red-400 border-red-500/50' : 'bg-emerald-950/50 text-emerald-400 border-emerald-500/50'}`}>
                    {depositMessage}
                  </div>
                )}
                <div ref={modalEndRef} className="h-1" />
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSpace;
