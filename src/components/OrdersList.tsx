import { useState } from 'react';
import { History, Check, Clock, ShieldCheck, Send, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../types';

interface OrdersListProps {
  orders: Order[];
  onOrderUpdate: (orders: Order[]) => void;
}

export default function OrdersList({ orders, onOrderUpdate }: OrdersListProps) {
  const [verifyingOrderId, setVerifyingOrderId] = useState<string | null>(null);

  const handleDelete = (orderId: string) => {
    const updated = orders.filter((o) => o.id !== orderId);
    onOrderUpdate(updated);
  };

  const simulateVerification = (orderId: string) => {
    setVerifyingOrderId(orderId);
    
    setTimeout(() => {
      const updated = orders.map((o) => {
        if (o.id === orderId) {
          return { ...o, status: 'Verified' as const };
        }
        return o;
      });
      onOrderUpdate(updated);
      setVerifyingOrderId(null);
    }, 1800);
  };

  if (orders.length === 0) {
    return (
      <div className="bg-[#141414] border border-white/10 p-8 rounded-xl text-center">
        <History className="w-10 h-10 text-zinc-650 mx-auto mb-3 animate-pulse" />
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">No Active Transactions Logged</h4>
        <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
          Your active mobile payments will display here. Place an order or submit your Cash (bKash/Nagad) Transaction ID above to begin manual audit.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between font-sans">
        <div>
          <h4 className="text-base font-bold text-white uppercase tracking-wide">My Validation Log Ledger</h4>
          <p className="text-xs text-zinc-400 mt-1">Track and audit your Cash (bKash/Nagad) transfers directly</p>
        </div>
        <span className="bg-black/40 font-mono text-[9px] text-zinc-500 font-extrabold border border-white/10 rounded-sm px-2.5 py-1 uppercase tracking-widest">
          TOTAL: {orders.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {orders.map((order) => {
            const isVerifying = verifyingOrderId === order.id;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-[#141414] border border-white/10 hover:border-emerald-500/30 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                {/* Order Details */}
                <div className="flex-1 font-sans">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="font-mono text-[10px] font-bold text-white bg-black px-2 py-0.5 rounded-sm border border-white/10 uppercase tracking-wider">
                      {order.id}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {order.timestamp}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 uppercase tracking-wider ${
                        order.status === 'Verified'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {order.status === 'Verified' ? (
                        <>
                          <Check className="w-3" /> Verified by Store Ledger
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 animate-spin" /> Pending Store Settlement
                        </>
                      )}
                    </span>
                  </div>

                  <h5 className="font-bold text-sm text-white uppercase tracking-wide">{order.jerseyName}</h5>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    Customer Details: <span className="text-white font-medium">{order.customerName}</span> ({order.customerPhone}) • Size: <span className="text-white font-mono font-bold bg-[#1a1a1a] border border-white/5 px-1 rounded-sm">{order.size}</span> (Qty: {order.quantity})
                  </p>
                  {(order.customName || order.customNumber) && (
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-amber-400 font-mono">
                      <span className="bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-sm uppercase font-bold">
                        ★ Custom Print: {order.customName || 'N/A'} - [# {order.customNumber || 'N/A'}]
                      </span>
                    </div>
                  )}

                  {/* Payment Info Subcard */}
                  <div className="mt-3 inline-flex flex-wrap items-center gap-x-4 gap-y-1.5 p-2 bg-black/45 rounded-sm text-[11px] border border-white/15">
                    <span className="text-zinc-500 font-mono tracking-wider text-[9px] uppercase">Cash Channel:</span>
                    <span className="text-white font-semibold">{order.paymentMethod}</span>
                    <span className="text-zinc-500 font-mono tracking-wider text-[9px] uppercase">TRX ID:</span>
                    <span className="text-amber-500 font-mono font-bold tracking-wider">{order.transactionId}</span>
                    <span className="text-zinc-500 font-mono tracking-wider text-[9px] uppercase">Amount:</span>
                    <span className="text-emerald-400 font-mono font-bold">BDT {order.amount}</span>
                  </div>
                </div>

                {/* Left controls & triggers */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  {order.status !== 'Verified' && (
                    <button
                      id={`verify-btn-${order.id}`}
                      onClick={() => simulateVerification(order.id)}
                      disabled={isVerifying}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-[#1a1a1a] text-white disabled:text-zinc-650 text-[10px] font-bold uppercase tracking-wider rounded-sm active:scale-95 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/15"
                    >
                      {isVerifying ? (
                        <>
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>Auditing...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Auto Validate</span>
                        </>
                      )}
                    </button>
                  )}

                  <a
                    id={`fb-msg-btn-${order.id}`}
                    href="https://www.facebook.com/share/1Bh4gYajWE/"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 border border-white/10 text-zinc-400 hover:text-white hover:bg-indigo-650 rounded-sm transition-all"
                    title="Send details to Facebook page"
                  >
                    <Send className="w-4 h-4" />
                  </a>

                  <button
                    id={`delete-btn-${order.id}`}
                    onClick={() => handleDelete(order.id)}
                    className="p-2 border border-white/10 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 rounded-sm transition-all"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
