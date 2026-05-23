import React, { useState, useEffect } from 'react';
import { Send, FileCheck, Smartphone, ShoppingCart, Check, MessageSquare, Copy } from 'lucide-react';
import { Jersey, Order } from '../types';
import { JERSEYS } from '../data';

interface OrderFormProps {
  preselectedJersey: Jersey | null;
  preselectedSize: string;
  bKashNumber: string;
  nagadNumber: string;
  onOrderSubmit: (order: Order) => void;
  onClose?: () => void;
  jerseysList: Jersey[]; // Let's support custom uploaded list
}

export default function OrderForm({
  preselectedJersey,
  preselectedSize,
  bKashNumber,
  nagadNumber,
  onOrderSubmit,
  onClose,
  jerseysList,
}: OrderFormProps) {
  // Use jerseysList from props, fallback to global list in data
  const activeJerseys = jerseysList && jerseysList.length > 0 ? jerseysList : JERSEYS;
  
  const [selectedJerseyId, setSelectedJerseyId] = useState(preselectedJersey?.id || activeJerseys[0].id);
  const [size, setSize] = useState(preselectedSize || 'M');
  const [quantity, setQuantity] = useState(1);
  const [customName, setCustomName] = useState('');
  const [customNumber, setCustomNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash (bKash Personal)');
  const [transactionId, setTransactionId] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedOrder, setGeneratedOrder] = useState<Order | null>(null);
  const [copiedInvoiceText, setCopiedInvoiceText] = useState(false);

  useEffect(() => {
    if (preselectedJersey) {
      setSelectedJerseyId(preselectedJersey.id);
    }
  }, [preselectedJersey]);

  useEffect(() => {
    if (preselectedSize) {
      setSize(preselectedSize);
    }
  }, [preselectedSize]);

  // Adjust in case selected jersey is not in the active selection (e.g. deleted or changed)
  const activeJersey = activeJerseys.find((j) => j.id === selectedJerseyId) || activeJerseys[0] || JERSEYS[0];
  const totalPriceBDT = activeJersey.priceBDT * quantity;
  const totalPriceUSD = Number((activeJersey.priceUSD * quantity).toFixed(1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !transactionId || !shippingAddress) {
      alert('Please fill out all mandatory shipping & payment details');
      return;
    }

    setIsSubmitting(true);

    // Simulate validation ledger write delay
    setTimeout(() => {
      const newOrder: Order = {
        id: 'JB-' + Math.floor(100000 + Math.random() * 900000),
        jerseyId: activeJersey.id,
        jerseyName: activeJersey.name,
        countryName: activeJersey.country,
        size,
        quantity,
        customerName,
        customerPhone,
        paymentMethod,
        transactionId: transactionId.trim().toUpperCase(),
        amount: totalPriceBDT,
        timestamp: new Date().toLocaleString(),
        status: 'Pending Verification',
        customName: customName.trim().toUpperCase() || undefined,
        customNumber: customNumber.trim() || undefined,
      };

      onOrderSubmit(newOrder);
      setGeneratedOrder(newOrder);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const getFBMessengerText = () => {
    if (!generatedOrder) return '';
    let text = `Assalamu Alaikum, I just submitted a transaction on Jersey Bazaar!\n\nOrder ID: ${generatedOrder.id}\nJersey: ${generatedOrder.jerseyName} (Size: ${generatedOrder.size})`;
    if (generatedOrder.customName || generatedOrder.customNumber) {
      text += `\nCustom Print: Name: "${generatedOrder.customName || 'N/A'}" | Number: "${generatedOrder.customNumber || 'N/A'}"`;
    }
    text += `\nQuantity: ${generatedOrder.quantity}\nPayment Method: ${generatedOrder.paymentMethod}\nTRX ID: ${generatedOrder.transactionId}\nAmount: BDT ${generatedOrder.amount}\nName: ${generatedOrder.customerName}\nPhone: ${generatedOrder.customerPhone}\nAddress: ${shippingAddress}`;
    return text;
  };

  const copyInvoiceDetails = () => {
    const text = getFBMessengerText();
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedInvoiceText(true);
      setTimeout(() => setCopiedInvoiceText(false), 2500);
    }
  };

  if (isSuccess && generatedOrder) {
    return (
      <div className="bg-[#141414] border border-emerald-500/20 p-6 md:p-8 rounded-xl relative text-center font-sans">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileCheck className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-white font-sans">Payment Submission Logged!</h3>
        <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
          Your Transaction Validation ID <span className="font-mono font-bold text-emerald-400">{generatedOrder.transactionId}</span> has been logged into our local registry successfully.
        </p>

        {/* Invoice Summary Box */}
        <div className="my-6 bg-black/60 p-4 rounded-sm text-left border border-white/10 max-w-md mx-auto">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 font-bold">
            Order Invoice Details
          </span>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-zinc-400">Order Reference:</span>
              <span className="font-mono text-white font-bold">{generatedOrder.id}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-zinc-400">Jersey Selected:</span>
              <span className="text-white font-bold">{generatedOrder.jerseyName}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-zinc-400">Size & Count:</span>
              <span className="text-white font-mono font-bold">{generatedOrder.size} (Qty: {generatedOrder.quantity})</span>
            </div>
            {(generatedOrder.customName || generatedOrder.customNumber) && (
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-zinc-400">Custom Printing:</span>
                <span className="text-indigo-400 font-mono font-bold truncate">
                  {generatedOrder.customName || 'N/A'} | #{generatedOrder.customNumber || 'N/A'}
                </span>
              </div>
            )}
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-zinc-400">Amount Transferred:</span>
              <span className="text-emerald-400 font-mono font-bold">BDT {generatedOrder.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Transaction ID:</span>
              <span className="text-amber-400 font-mono font-bold">{generatedOrder.transactionId}</span>
            </div>
          </div>
        </div>

        {/* Action button container */}
        <div className="space-y-4 max-w-md mx-auto">
          <button
            onClick={copyInvoiceDetails}
            className="flex items-center justify-center gap-1.5 w-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 text-xs font-bold py-3 rounded-sm transition-all"
          >
            {copiedInvoiceText ? (
              <>
                <Check className="w-4.5 h-4.5 text-emerald-400" />
                <span className="text-emerald-450">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4.5 h-4.5" />
                <span>1. Copy Transaction Summary</span>
              </>
            )}
          </button>

          <a
            id="fb-messenger-launch-btn"
            href="https://www.facebook.com/share/1Bh4gYajWE/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#1877f2] hover:bg-[#155fc3] text-white text-xs font-bold py-3.5 rounded-sm transition-all shadow-lg active:scale-95 uppercase tracking-wider"
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span>2. Open Facebook Page to Confirm</span>
          </a>

          <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">
            *Required Rule: Realize your order dispatch by clicking the "Copy" button above, then click the "Open Facebook Page to Confirm" link and paste the details in our official support inbox. Thank you!
          </p>

          <button
            id="new-checkout-form-reset"
            onClick={() => {
              setIsSuccess(false);
              setCustomerName('');
              setCustomerPhone('');
              setTransactionId('');
              setShippingAddress('');
              setQuantity(1);
              setCustomName('');
              setCustomNumber('');
              if (onClose) onClose();
            }}
            className="text-xs text-zinc-400 hover:text-white underline underline-offset-4 mt-2 transition-all cursor-pointer font-bold block mx-auto uppercase tracking-wider text-[10px]"
          >
            Submit Another Payment Transaction
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#141414] border border-white/10 p-6 rounded-xl relative font-sans">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-lg font-black text-white tracking-tight uppercase">
            Order & Transaction Ledger Log
          </h3>
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
            Peer Manual Audited Settlement
          </p>
        </div>
        {onClose && (
          <button
            id="checkout-form-close"
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white font-mono text-xs hover:bg-white/5 px-2.5 py-1.5 rounded-sm transition-all"
          >
            Close
          </button>
        )}
      </div>

      {/* Select active products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
            1. Select Club/Country Jersey
          </label>
          <select
            id="order-jersey-select"
            value={selectedJerseyId}
            onChange={(e) => setSelectedJerseyId(e.target.value)}
            className="w-full bg-black text-zinc-250 text-xs px-3 py-2.5 border border-white/15 rounded-sm focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
            required
          >
            {activeJerseys.map((j) => (
              <option key={j.id} value={j.id}>
                {j.name} - BDT {j.priceBDT}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
              2. Size
            </label>
            <select
              id="order-size-select"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full bg-black text-zinc-250 text-xs px-3 py-2.5 border border-white/15 rounded-sm focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
              required
            >
              {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
              3. Qty
            </label>
            <input
              id="order-quantity"
              type="number"
              min="1"
              max="20"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-black text-zinc-250 font-mono text-xs px-3 py-2.5 border border-white/15 rounded-sm focus:outline-none focus:border-emerald-500 transition-all"
              required
            />
          </div>
        </div>
      </div>

      {/* Payment details instructions */}
      <div className="bg-black/60 border border-white/10 rounded-lg p-4 mb-5 space-y-3.5 text-xs text-zinc-300">
        <div className="flex items-start gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-white uppercase text-[10px] tracking-wider mb-1">
              MOBILE WALLET ACCOUNT DETAILS (CASH TRANSFER METHOD):
            </p>
            <p className="leading-relaxed">
              To pay, please transfer exactly <span className="text-emerald-400 font-bold">BDT {totalPriceBDT}</span> (~${totalPriceUSD}) via Send Money or Cash Out to any of our active wallets:
            </p>
            
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
              <div className="bg-zinc-950 p-2 border border-white/5 rounded">
                <span className="text-pink-400 font-sans font-bold text-[10px]">bKash: </span>
                <span className="text-white font-bold">{bKashNumber}</span>
              </div>
              <div className="bg-zinc-950 p-2 border border-white/5 rounded">
                <span className="text-orange-400 font-sans font-bold text-[10px]">Nagad: </span>
                <span className="text-white font-bold">{nagadNumber}</span>
              </div>
            </div>

            <p className="mt-2 text-[11px] text-zinc-400 leading-relaxed">
              * Our active wallet number is valid on both bKash and Nagad. You can complete payments to either mobile banking platform seamlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Optional Jersey Printing Customization (Name & Number on Back) */}
      <div className="bg-[#1c1c1c] border border-white/5 hover:border-emerald-500/30 rounded-lg p-4 mb-5 transition-all font-sans text-xs">
        <span className="font-mono text-[9px] text-emerald-400 tracking-widest uppercase font-extrabold block mb-3 bg-emerald-500/10 px-2 py-1 rounded-sm w-fit">
          ✨ OPTIONAL SPORT CUSTOMIZATION (FREE PRINTING SERVICE)
        </span>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-7 space-y-3.5">
            <div>
              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1 font-bold">
                Print Name on Back (COMPLETELY FREE SERVICE)
              </label>
              <input
                id="order-custom-name"
                type="text"
                maxLength={15}
                value={customName}
                onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                className="w-full bg-black text-white font-mono text-xs px-3 py-2.5 border border-white/10 focus:border-emerald-500 rounded-sm focus:outline-none uppercase"
                placeholder="e.g. MESSI, SHAKIB"
              />
            </div>
            <div>
              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1 font-bold">
                Print Jersey Number on Back
              </label>
              <input
                id="order-custom-number"
                type="text"
                maxLength={3}
                value={customNumber}
                onChange={(e) => setCustomNumber(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-black text-amber-400 font-mono text-xs font-bold px-3 py-2.5 border border-white/10 focus:border-emerald-500 rounded-sm focus:outline-none"
                placeholder="e.g. 10 or 7"
              />
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              * If you do not want any name or number printed on the back of your jersey, simply leave these fields blank.
            </p>
          </div>

          {/* Real-time Shirt Back Live Visualizer Preview Box */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-32 h-40 bg-zinc-950 border border-white/5 rounded-lg flex flex-col items-center justify-start pt-7 shadow-inner overflow-hidden group">
              {/* Back Collar detailing */}
              <div className="absolute top-0 w-16 h-3.5 bg-zinc-800 rounded-b-lg border-b border-zinc-700"></div>
              
              {/* Arm holes silhouettes */}
              <div className="absolute left-[-4px] top-6 w-3 h-14 bg-zinc-900 rounded-r-md"></div>
              <div className="absolute right-[-4px] top-6 w-3 h-14 bg-zinc-900 rounded-l-md"></div>

              {/* Dynamic printed Name render */}
              <div className="text-[10px] font-black tracking-widest text-white select-none uppercase font-sans mt-1.5 truncate max-w-full px-2 text-center">
                {customName.trim() || "YOUR NAME"}
              </div>

              {/* Dynamic printed Number render */}
              <div className="text-5xl font-black tracking-tighter text-amber-450 select-none font-mono mt-1 leading-none">
                {customNumber.trim() || "10"}
              </div>

              {/* Holographic style visual tag */}
              <div className="absolute bottom-2 text-[8px] font-mono text-zinc-650 tracking-widest uppercase">
                2026 JERSEY BACK
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer shipping details */}
      <div className="space-y-4">
        <div>
          <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
            4. Your Full Name
          </label>
          <input
            id="order-customer-name"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full bg-black text-zinc-250 text-xs px-3 py-2.5 border border-white/15 rounded-sm focus:outline-none focus:border-emerald-500"
            placeholder="e.g. Shakib Al Hasan"
            required
          />
        </div>

        <div>
          <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
            5. Your Active Mobile / Phone Number
          </label>
          <input
            id="order-customer-phone"
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full bg-black text-zinc-250 text-xs px-3 py-2.5 border border-white/15 rounded-sm focus:outline-none focus:border-emerald-500"
            placeholder="e.g. 01712-XXXXXX"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
              6. Payment Method Used
            </label>
            <select
              id="order-payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-black text-zinc-250 text-xs px-3 py-2.5 border border-white/15 rounded-sm focus:outline-none focus:border-emerald-500 cursor-pointer"
              required
            >
              <option value="Cash (bKash Personal)">Cash (bKash Send Money)</option>
              <option value="Cash (bKash Agent)">Cash (bKash Cash In)</option>
              <option value="Cash (bKash MerchantPayment)">Cash (bKash Payment)</option>
              <option value="Cash (Nagad Personal)">Cash (Nagad Send Money)</option>
              <option value="Cash (Nagad CashIn)">Cash (Nagad Cash In)</option>
              <option value="Cash (Handover)">Hand Cash / Pre-Approved</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-extrabold mb-1.5 flex items-center gap-1">
              7. Transaction Code (TRX ID) *
            </label>
            <input
              id="order-transaction-id"
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full bg-black text-amber-400 font-mono text-xs font-bold px-3 py-2.5 border border-emerald-500/40 focus:outline-none focus:border-emerald-500 rounded-sm uppercase tracking-wide placeholder-zinc-700"
              placeholder="e.g. AX98L75T09"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
            8. Delivery Shipping Address Address
          </label>
          <textarea
            id="order-shipping-address"
            rows={2}
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="w-full bg-black text-zinc-250 text-xs px-3 py-2.5 border border-white/15 rounded-sm focus:outline-none focus:border-emerald-500 resize-none"
            placeholder="House, Street, Area, District (e.g., Block A, Mirpur, Dhaka)"
            required
          />
        </div>
      </div>

      {/* Pricing feedback and submit button */}
      <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans">
        <div>
          <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest block">Total computed bill</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-white">BDT {totalPriceBDT}</span>
            <span className="text-[10px] font-mono text-zinc-500">/ ~${totalPriceUSD}</span>
          </div>
        </div>

        <button
          id="order-submit-btn"
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider px-6 py-3.5 rounded-sm active:scale-95 transition-all shadow-lg disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Logging code...</span>
          ) : (
            <>
              <ShoppingCart className="w-4.5 h-4.5" />
              <span>Submit & Log Transaction</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
