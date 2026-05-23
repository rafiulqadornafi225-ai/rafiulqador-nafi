import { Send, Smartphone, ShieldCheck, CheckCircle, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function RulesCard() {
  const steps = [
    {
      icon: <Smartphone className="w-6 h-6 text-emerald-400" />,
      title: "1. Make Payment via Cash (bKash / Nagad)",
      description: "Send the total price amount of your desired 2026 jerseys to our active personal wallets: bKash (01402580064) or Nagad (01402580064) shown in the store top bar."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-300" />,
      title: "2. Copy & Provide Your TRX ID Here",
      description: "Once your transfer completes, copy your Transaction ID (TRX ID). Select your desired jersey, size, and submit this validation code inside our verification box."
    },
    {
      icon: <Send className="w-6 h-6 text-emerald-400" />,
      title: "3. Notify Facebook Page immediately",
      description: "Crucial Step: After logging the TRX ID on this webpage, click the Chat button and instantly message our official Facebook Page with your transaction summary to dispatch the package."
    }
  ];

  return (
    <div className="relative overflow-hidden bg-[#141414] border border-white/10 rounded-xl p-6 md:p-8 shadow-2xl font-sans">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/5 to-transparent blur-3xl rounded-full"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        <div className="lg:col-span-8">
          <span className="font-mono text-[10px] text-emerald-400 tracking-widest uppercase bg-emerald-500/10 px-2.5 py-1 rounded-sm font-bold">
            TERMS & HOW TO ORDER
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-white mt-3 tracking-tight uppercase">
            Official 2026 Order Guidelines
          </h3>
          <p className="text-xs text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            Follow these streamlined guidelines to guarantee your world edition 2026 jersey order gets dispatched immediately. All orders are manually audited via peer-to-peer mobile banking transfer records.
          </p>
        </div>

        {/* Store Location Section - Added Location elegant details */}
        <div className="lg:col-span-4 bg-black/40 border border-white/5 rounded-lg p-4 flex gap-3 text-xs">
          <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-mono text-[9px] text-indigo-400 tracking-widest uppercase font-bold block mb-1">
              Store & Dispatch Hub Location
            </span>
            <p className="font-bold text-white uppercase text-[10px]">NAFI Jersey House Hub</p>
            <p className="text-zinc-400 mt-1 leading-relaxed">
              Mirpur, Dhaka, Bangladesh.
            </p>
            <span className="text-[10px] text-emerald-400 font-medium tracking-wide mt-1.5 inline-block">
              ✓ Open Daily: 10:00 AM – 8:00 PM
            </span>
          </div>
        </div>
      </div>

      {/* Grid of steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 mb-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4 }}
            className="bg-[#1a1a1a] border border-white/5 hover:border-emerald-500/30 p-5 rounded-lg flex flex-col justify-between transition-all"
          >
            <div>
              <div className="w-12 h-12 rounded-sm bg-black/40 border border-white/10 flex items-center justify-center mb-4 shadow-md">
                {step.icon}
              </div>
              <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">{step.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{step.description}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                Step 0{index + 1}
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payment details notice */}
      <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-lg my-6 text-[11px] leading-relaxed text-zinc-300">
        <h5 className="font-bold text-emerald-400 uppercase tracking-wider mb-1">Required Payment Guidelines (Payment Notice)</h5>
         For bKash or Nagad transfers, our active mobile payment number is fully functional on both networks. You can transfer funds directly to either account according to your preference. Pay using whichever platform is most convenient for you.
      </div>

      {/* Warning Rule Alert Box */}
      <div className="mt-8 bg-black/60 border-l-2 border-emerald-500 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono uppercase tracking-wider">
            ⚠️ MANDATORY POLICY: Transaction Verification
          </h5>
          <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
            Do not lose your transfer receipt or copy of reference. If you pay via Cash (bKash / Nagad) or Hand-over, you **MUST** submit the exact Transaction ID (TRX ID) on our web ledger tool. Unregistered transactions will result in systematic verification delays.
          </p>
        </div>
        <a
          id="fb-official-page-rules-cta"
          href="https://www.facebook.com/share/1Bh4gYajWE/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-sm whitespace-nowrap active:scale-95 transition-all w-full md:w-auto justify-center uppercase tracking-wider h-11"
        >
          <span>Official Facebook Page</span>
          <ArrowRight className="w-4.5 h-4.5" />
        </a>
      </div>
    </div>
  );
}
