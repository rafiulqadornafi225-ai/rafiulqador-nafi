import React, { useState, useEffect } from 'react';
import { Copy, Check, ShoppingBag, Flame, Settings2, Lock, Unlock, PlusCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  bKashNumber: string;
  setBKashNumber: (num: string) => void;
  nagadNumber: string;
  setNagadNumber: (num: string) => void;
  activeOrderCount: number;
  scrollToSection: (id: string) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  onAddJerseyClick?: () => void;
}

export default function Header({
  bKashNumber,
  setBKashNumber,
  nagadNumber,
  setNagadNumber,
  activeOrderCount,
  scrollToSection,
  isAdmin,
  setIsAdmin,
  onAddJerseyClick,
}: HeaderProps) {
  const [copiedB, setCopiedB] = useState(false);
  const [copiedN, setCopiedN] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [tempB, setTempB] = useState(bKashNumber);
  const [tempN, setTempN] = useState(nagadNumber);

  useEffect(() => {
    setTempB(bKashNumber);
  }, [bKashNumber]);

  useEffect(() => {
    setTempN(nagadNumber);
  }, [nagadNumber]);

  const handleCopyB = () => {
    navigator.clipboard.writeText(bKashNumber);
    setCopiedB(true);
    setTimeout(() => setCopiedB(false), 2000);
  };

  const handleCopyN = () => {
    navigator.clipboard.writeText(nagadNumber);
    setCopiedN(true);
    setTimeout(() => setCopiedN(false), 2000);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setShowEdit(false);
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin2026') {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasscode('');
      setLoginError('');
    } else {
      setLoginError('Invalid Passcode! Please try again.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setBKashNumber(tempB.trim());
    setNagadNumber(tempN.trim());
    setShowEdit(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
      {/* Top Multi-wallet Payment Marquee */}
      <div className="w-full bg-gradient-to-r from-red-650 via-[#312e81] to-[#006a4e] text-white py-2 px-4 shadow-inner relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between text-xs font-semibold gap-3">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-center lg:text-left">
            <span className="bg-white text-indigo-950 font-mono font-extrabold text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider animate-pulse">
              Cash Direct (bKash/Nagad)
            </span>
            <span className="font-sans font-medium text-zinc-100 text-[11px]">
              Our active mobile payment number is fully compatible with both bKash and Nagad. You can complete your transaction directly using either of these platforms.
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* bKash Number */}
            <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-sm border border-white/10">
              <span className="text-[10px] font-bold text-pink-400 font-sans">bKash:</span>
              <span className="font-mono text-xs tracking-wider text-white">
                {bKashNumber}
              </span>
              <button
                id="header-copy-bKash"
                onClick={handleCopyB}
                className="p-0.5 hover:bg-white/10 rounded ml-1 transition-all"
                title="Copy Active bKash Number"
              >
                {copiedB ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-300" />}
              </button>
            </div>

            {/* Nagad Number */}
            <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-sm border border-white/10">
              <span className="text-[10px] font-bold text-orange-400 font-sans">Nagad:</span>
              <span className="font-mono text-xs tracking-wider text-white">
                {nagadNumber}
              </span>
              <button
                id="header-copy-nagad"
                onClick={handleCopyN}
                className="p-0.5 hover:bg-white/10 rounded ml-1 transition-all"
                title="Copy Active Nagad Number"
              >
                {copiedN ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-300" />}
              </button>
            </div>

            {/* Config Active numbers trigger (Visible only to Admin) */}
            {isAdmin && (
              <button
                id="header-edit-bKash"
                onClick={() => setShowEdit(!showEdit)}
                className="p-1 bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/50 rounded active:scale-95 transition-all text-white"
                title="Configure Numbers (Admin Only)"
              >
                <Settings2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-[#312e81] to-emerald-700 rounded-sm shadow-md">
            <Flame className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black font-sans tracking-tighter text-white uppercase">
              NAFI.JERSEY<span className="text-emerald-400">.HOUSE</span>
            </h1>
            <p className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase">Elite Sportswear 2026</p>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
          <button
            id="nav-shop"
            onClick={() => scrollToSection('shop')}
            className="hover:text-white hover:underline underline-offset-4 decoration-emerald-500 transition-all cursor-pointer font-bold tracking-tight uppercase text-xs"
          >
            Jersey Collection
          </button>
          <button
            id="nav-rules"
            onClick={() => scrollToSection('rules')}
            className="hover:text-white hover:underline underline-offset-4 decoration-emerald-500 transition-all cursor-pointer font-bold tracking-tight uppercase text-xs"
          >
            Payment Rules
          </button>
          <button
            id="nav-verify"
            onClick={() => scrollToSection('verify')}
            className="hover:text-white hover:underline underline-offset-4 decoration-emerald-500 transition-all cursor-pointer font-bold tracking-tight uppercase text-xs"
          >
            Submit Transaction
          </button>
          {isAdmin && (
            <button
              id="nav-traffic"
              onClick={() => scrollToSection('traffic-monitor')}
              className="text-[#00e194] hover:text-white hover:underline underline-offset-4 decoration-[#00e194] transition-all cursor-pointer font-bold tracking-tight uppercase text-xs flex items-center gap-1.5 bg-emerald-550 bg-emerald-950/40 border border-emerald-500/20 px-2 py-1 rounded"
            >
              <Eye className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Live Visitors</span>
            </button>
          )}
        </nav>

        {/* Action Widgets */}
        <div className="flex items-center gap-3">
          {/* Admin Control Trigger */}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-rose-950/40 border border-rose-500/30 text-rose-450 text-[10px] uppercase font-mono font-bold tracking-wide animate-pulse">
                Admin Active
              </span>
              {onAddJerseyClick && (
                <button
                  id="header-add-jersey-btn"
                  onClick={() => {
                    onAddJerseyClick();
                    scrollToSection('shop');
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-lg active:scale-95 transition-all"
                  title="Add New Jersey from Gallery"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Jersey</span>
                </button>
              )}
              <button
                id="admin-logout-btn"
                onClick={handleAdminLogout}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all"
                title="Lock Admin Mode"
              >
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              id="admin-login-modal-trigger"
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-white/5 text-zinc-450 hover:text-zinc-350 text-xs font-mono lowercase rounded-sm transition-all"
              title="Enter passcode to unlock editing context"
            >
              <Unlock className="w-3.5 h-3.5 text-zinc-500" />
              <span>admin mode</span>
            </button>
          )}

          <button
            id="nav-my-orders"
            onClick={() => scrollToSection('orders')}
            className="relative p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-sm transition-all flex items-center gap-1.5"
          >
            <ShoppingBag className="w-5 h-5" />
            {activeOrderCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeOrderCount}
              </span>
            )}
            <span className="hidden sm:inline text-xs font-mono">My Trxs</span>
          </button>
        </div>
      </div>

      {/* Admin Setting Form - Inline Edit Banner for numbers */}
      <AnimatePresence>
        {showEdit && isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-zinc-950 border-b border-white/15 py-5 px-4 shadow-2xl flex items-center justify-center z-50"
          >
            <form onSubmit={handleSave} className="flex flex-col md:flex-row items-end gap-4 w-full max-w-2xl font-sans">
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                  Active Cash bKash Number
                </label>
                <input
                  type="text"
                  value={tempB}
                  onChange={(e) => setTempB(e.target.value)}
                  className="w-full bg-[#141414] text-white font-mono text-xs px-3 py-2 border border-white/10 rounded-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                  Active Cash Nagad Number
                </label>
                <input
                  type="text"
                  value={tempN}
                  onChange={(e) => setTempN(e.target.value)}
                  className="w-full bg-[#141414] text-white font-mono text-xs px-3 py-2 border border-white/10 rounded-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto mt-2">
                <button
                  id="bKash-save-btn"
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm active:scale-95 transition-all whitespace-nowrap"
                >
                  Save Numbers
                </button>
                <button
                  id="bKash-cancel-btn"
                  type="button"
                  onClick={() => {
                    setTempB(bKashNumber);
                    setTempN(nagadNumber);
                    setShowEdit(false);
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold uppercase tracking-widest px-3 py-2.5 rounded-sm transition-all whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Login Passcode Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-xl p-6 shadow-2xl z-10 font-sans"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-500/15 flex items-center justify-center mx-auto mb-3 border border-indigo-500/20">
                  <Lock className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Unlock Administrator Panel</h3>
                <p className="text-[11px] text-zinc-400 mt-1 max-w-xs mx-auto">
                  Provide credentials to permit interactive gallery editing and core setting configuration.
                </p>
              </div>

              <form onSubmit={handleAdminLoginSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                    Security Passcode
                  </label>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                    className="w-full bg-black text-white text-center font-mono text-sm tracking-widest px-3 py-2.5 border border-white/10 rounded-sm focus:outline-none focus:border-indigo-500"
                    placeholder="••••••••"
                    required
                    autoFocus
                  />
                  {loginError && (
                    <p className="text-red-500 text-[10px] mt-1 text-center font-medium font-sans">
                      {loginError}
                    </p>
                  )}
                  <p className="text-zinc-600 text-[9px] mt-2 text-center font-mono">
                    passcode hint: admin2026
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    id="submit-admin-login-btn"
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-sm transition-all active:scale-95"
                  >
                    Authorize Session
                  </button>
                  <button
                    id="cancel-admin-login-btn"
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      setPasscode('');
                      setLoginError('');
                    }}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 text-xs px-4 rounded-sm transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
