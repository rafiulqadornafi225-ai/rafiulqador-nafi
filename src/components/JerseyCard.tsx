import { useState } from 'react';
import { ShoppingCart, Star, Shield, RefreshCw, Edit, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Jersey } from '../types';

interface JerseyCardProps {
  key?: string;
  jersey: Jersey;
  onBuyNow: (jersey: Jersey, selectedSize: string) => void;
  isAdmin?: boolean;
  onEdit?: (jersey: Jersey) => void;
  onDelete?: (id: string) => void;
}

export default function JerseyCard({ jersey, onBuyNow, isAdmin, onEdit, onDelete }: JerseyCardProps) {
  const [selectedSize, setSelectedSize] = useState('M');
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const countryAcronym = jersey.country.substring(0, 3).toUpperCase();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative flex flex-col justify-between overflow-hidden bg-[#141414] border border-white/10 hover:border-emerald-500/50 rounded-xl h-full shadow-2xl group transition-all duration-300"
    >
      {/* Visual background lights */}
      <div className="absolute top-0 left-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>

      {/* Card Header & Badges */}
      <div className="p-5 pb-0 flex items-center justify-between z-10 w-full font-sans">
        <div>
          <span className={`text-[9px] font-mono uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-sm ${jersey.badgeColor || 'bg-indigo-600 text-white'}`}>
            {jersey.country}
          </span>
          <p className="text-[10px] text-zinc-400 font-mono mt-1.5 uppercase tracking-widest">
            2026 World Edition
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Admin editing/deleting operations */}
          {isAdmin && (
            <div className="flex items-center gap-1.5 mr-2">
              <button
                type="button"
                onClick={() => onEdit && onEdit(jersey)}
                className="p-1.5 bg-indigo-600/25 hover:bg-indigo-600 border border-indigo-500/40 rounded-sm text-indigo-300 hover:text-white transition-all active:scale-95"
                title="Edit Club/Country Details & Image"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete && onDelete(jersey.id)}
                className="p-1.5 bg-rose-950/45 hover:bg-rose-600 border border-rose-500/40 rounded-sm text-rose-450 hover:text-white transition-all active:scale-95"
                title="Remove Jersey from Catalog"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-sm px-2 py-0.5">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-bold font-mono text-white">{jersey.rating}</span>
          </div>
        </div>
      </div>

      {/* Product Image Section */}
      <div className="p-6 pt-2 flex items-center justify-center relative min-h-[300px]">
        {/* Big stylized back-text watermark */}
        <div className="absolute text-8xl md:text-9xl opacity-[0.03] font-black italic tracking-tighter select-none pointer-events-none text-white z-0">
          {countryAcronym}
        </div>

        {/* Glow behind image */}
        <div className="absolute w-40 h-40 bg-black/40 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500 animate-pulse"></div>
        
        <img
          src={jersey.image}
          alt={jersey.name}
          referrerPolicy="no-referrer"
          className="relative max-h-72 object-contain select-none transform group-hover:scale-105 duration-500 transition-transform drop-shadow-[0_22px_22px_rgba(0,0,0,0.85)] z-10"
        />

        {/* Floating details overlay on hover */}
        <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between bg-black/90 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg px-3 py-2 text-[9px] text-zinc-300 font-mono z-20">
          <span className="flex items-center gap-1">
            <Shield className="w-3" /> Double Knit Original
          </span>
          <span className="flex items-center gap-1 animate-pulse">
            <RefreshCw className="w-3 animate-spin duration-3000" /> DHL Premium Express
          </span>
        </div>
      </div>

      {/* Description and Action section */}
      <div className="p-5 bg-black/60 border-t border-white/10 backdrop-blur-md relative z-10 flex-grow flex flex-col justify-between font-sans">
        <div>
          <h4 className="text-base font-bold text-white tracking-tight uppercase group-hover:text-emerald-400 transition-colors duration-200">
            {jersey.name}
          </h4>
          <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed h-8">
            {jersey.description}
          </p>

          {/* Size Selectors */}
          <div className="mt-4">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
              Select Jersey Size
            </span>
            <div className="flex gap-1.5">
              {sizes.map((size) => (
                <button
                  id={`btn-${jersey.id}-size-${size}`}
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-8 h-8 font-mono text-[10px] font-bold rounded-sm transition-all active:scale-95 border ${
                    selectedSize === size
                      ? 'bg-white text-black border-white shadow-xl font-black'
                      : 'bg-[#1a1a1a] text-zinc-400 hover:text-white border-white/5 hover:border-white/20'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price & Primary Action */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-zinc-500 tracking-widest block uppercase">
              Exclusive Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-bold text-white">BDT {jersey.priceBDT}</span>
              <span className="text-[10px] text-zinc-500 font-mono">/ ~${jersey.priceUSD}</span>
            </div>
          </div>

          <button
            id={`buy-btn-${jersey.id}`}
            onClick={() => onBuyNow(jersey, selectedSize)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm active:scale-95 transition-all shadow-lg group-hover:ring-1 group-hover:ring-emerald-500"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
