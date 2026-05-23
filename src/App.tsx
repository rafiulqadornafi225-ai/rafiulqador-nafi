import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  BadgeCheck, 
  Search, 
  X, 
  SlidersHorizontal, 
  PlusCircle, 
  MapPin, 
  Sparkles,
  Info,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import JerseyCard from './components/JerseyCard';
import RulesCard from './components/RulesCard';
import OrderForm from './components/OrderForm';
import OrdersList from './components/OrdersList';
import { JERSEYS } from './data';
import { Jersey, Order, VisitorLog } from './types';
import VisitorTracker from './components/VisitorTracker';

export default function App() {
  const [bKashNumber, setBKashNumber] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jerseybazaar_bKash') || '01402580064';
    }
    return '01402580064';
  });
  const [nagadNumber, setNagadNumber] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jerseybazaar_nagad') || '01402580064';
    }
    return '01402580064';
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jerseybazaar_orders');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });
  const [jerseysList, setJerseysList] = useState<Jersey[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jerseybazaar_collections');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return JERSEYS;
  });
  const [isAdmin, setIsAdmin] = useState(false);

  // Views tracker & logs state
  const [viewsCount, setViewsCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jerseybazaar_views');
      return saved ? parseInt(saved) : 142;
    }
    return 142;
  });

  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jerseybazaar_logs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });


  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  // Checkout modal state
  const [checkoutJersey, setCheckoutJersey] = useState<Jersey | null>(null);
  const [checkoutSize, setCheckoutSize] = useState('M');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Admin Panels state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJersey, setEditingJersey] = useState<Jersey | null>(null);
  
  // Admin Form state
  const [formCountry, setFormCountry] = useState('');
  const [formName, setFormName] = useState('');
  const [formPriceBDT, setFormPriceBDT] = useState<number>(1400);
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formBadgeColor, setFormBadgeColor] = useState('bg-indigo-600 text-white');
  const [formAccentColor, setFormAccentColor] = useState('text-indigo-400');
  const [formBgGradient, setFormBgGradient] = useState('from-indigo-650/10 via-zinc-850/5 to-slate-950');

  // Region lookup
  const getJerseyRegion = (country: string) => {
    const c = country.toLowerCase();
    if (c === 'brazil' || c === 'argentina' || c === 'usa' || c === 'canada' || c === 'mexico') return 'Americas';
    if (c === 'bangladesh' || c === 'japan' || c === 'india' || c === 'saudi arabia') return 'Asia';
    return 'Europe';
  };

  const filteredJerseys = jerseysList.filter((jersey) => {
    const matchesSearch =
      jersey.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jersey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jersey.description.toLowerCase().includes(searchQuery.toLowerCase());

    const region = getJerseyRegion(jersey.country);
    const matchesRegion = selectedRegion === 'All' || region === selectedRegion;

    return matchesSearch && matchesRegion;
  });

  // Seed default localStorage records if empty / ensure requested numbers are active & setup views tracking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentBKash = localStorage.getItem('jerseybazaar_bKash');
      if (!currentBKash || currentBKash !== '01402580064') {
        localStorage.setItem('jerseybazaar_bKash', '01402580064');
        setBKashNumber('01402580064');
      }
      const currentNagad = localStorage.getItem('jerseybazaar_nagad');
      if (!currentNagad || currentNagad !== '01402580064') {
        localStorage.setItem('jerseybazaar_nagad', '01402580064');
        setNagadNumber('01402580064');
      }
      if (!localStorage.getItem('jerseybazaar_collections')) {
        localStorage.setItem('jerseybazaar_collections', JSON.stringify(JERSEYS));
      }

      // 1. Handle view count
      const currentViews = localStorage.getItem('jerseybazaar_views');
      const nextViews = currentViews ? parseInt(currentViews) + 1 : 143;
      localStorage.setItem('jerseybazaar_views', nextViews.toString());
      setViewsCount(nextViews);

      // 2. Load or seed visitor logs
      let existingLogs: VisitorLog[] = [];
      const savedLogs = localStorage.getItem('jerseybazaar_logs');
      if (savedLogs) {
        try {
          existingLogs = JSON.parse(savedLogs);
        } catch (e) {
          console.error(e);
        }
      }

      const hasSeed = existingLogs.length > 0;
      if (!hasSeed) {
        existingLogs = [
          { id: 'v-103', name: 'Zeeshan Ahmed', location: 'Mirpur, Dhaka', device: 'Android Mobile', action: 'Purchased Argentina Three-Star Jersey', timestamp: 'May 22, 2026, 06:40 PM', ip: '103.114.172.5' },
          { id: 'v-104', name: 'Subho Chowdhury', location: 'Sylhet', device: 'iPhone Mobile', action: 'Viewed Bangladesh Gold Edition Home Jersey', timestamp: 'May 22, 2026, 06:55 PM', ip: '103.199.155.12' },
          { id: 'v-105', name: 'Imran Khan', location: 'Uttara, Dhaka', device: 'Windows PC', action: 'Began order checkout for Japan Special Jersey', timestamp: 'May 22, 2026, 07:02 PM', ip: '113.11.144.17' },
          { id: 'v-106', name: 'Tanzim Rony', location: 'Banani, Dhaka', device: 'Android Mobile', action: 'Copied bKash Active Number', timestamp: 'May 22, 2026, 07:15 PM', ip: '119.30.22.84' },
          { id: 'v-107', name: 'Mashrafe Alom', location: 'Chittagong', device: 'Mac PC', action: 'Viewed Brazil 2026 Authentic Home Jersey', timestamp: 'May 22, 2026, 07:18 PM', ip: '37.111.201.2' },
          { id: 'v-108', name: 'Nabila Karim', location: 'Dhanmondi, Dhaka', device: 'iPhone Mobile', action: 'Verified payment transaction submission', timestamp: 'May 22, 2026, 07:22 PM', ip: '103.144.200.54' },
          { id: 'v-109', name: 'Zahid Hasan', location: 'Mirpur, Dhaka', device: 'Android Mobile', action: 'Browsing active 2026 Selection Gallery', timestamp: 'May 22, 2026, 07:24 PM', ip: '103.111.18.99' },
          { id: 'v-110', name: 'Fahim Anwar', location: 'Rajshahi', device: 'Windows PC', action: 'Selected Portugal Navigator Home Jersey', timestamp: 'May 22, 2026, 07:27 PM', ip: '116.58.204.1' }
        ];
      }

      // 3. Create real user session record
      const userAgent = navigator.userAgent;
      let detectedDevice = 'PC Device';
      if (/android/i.test(userAgent)) detectedDevice = 'Android Mobile';
      else if (/iphone|ipad/i.test(userAgent)) detectedDevice = 'iPhone Mobile';
      else if (/macintosh/i.test(userAgent)) detectedDevice = 'Mac PC';
      else if (/windows/i.test(userAgent)) detectedDevice = 'Windows PC';

      // Assign random Bangladeshi IP
      const userIp = '103.84.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
      const userLocation = 'Mirpur, Dhaka'; 

      const realSessionId = 'v-real-' + Math.floor(Math.random() * 100000);
      const now = new Date();
      const formatTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const formatMonth = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const formattedTimestamp = `${formatMonth}, ${formatTime}`;

      const realUserLog: VisitorLog = {
        id: realSessionId,
        name: 'You (Active Visitor)',
        location: userLocation,
        device: detectedDevice,
        action: 'Entered NAFI Jersey House Webpage',
        timestamp: formattedTimestamp,
        ip: userIp,
        isReal: true
      };

      const updatedLogs = [realUserLog, ...existingLogs.filter(l => l.id !== realSessionId)];
      localStorage.setItem('jerseybazaar_logs', JSON.stringify(updatedLogs));
      setVisitorLogs(updatedLogs);
      sessionStorage.setItem('current_log_id', realSessionId);
    }
  }, []);

  // Update active session action helper
  const updateActiveSessionAction = (actionDetails: string, customName?: string) => {
    if (typeof window !== 'undefined') {
      const activeSessionId = sessionStorage.getItem('current_log_id');
      if (activeSessionId) {
        setVisitorLogs((prev) => {
          const updated = prev.map((log) => {
            if (log.id === activeSessionId) {
              return { 
                ...log, 
                action: actionDetails,
                name: customName ? customName : log.name 
              };
            }
            return log;
          });
          localStorage.setItem('jerseybazaar_logs', JSON.stringify(updated));
          return updated;
        });
      }
    }
  };

  // Track searching and filter parameters in the visitor log
  useEffect(() => {
    if (searchQuery) {
      updateActiveSessionAction(`Searched gallery for: "${searchQuery}"`);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedRegion !== 'All') {
      updateActiveSessionAction(`Filtered gallery region view to: ${selectedRegion}`);
    }
  }, [selectedRegion]);

  // Sync state functions
  const handleUpdateBKashNumber = (newNum: string) => {
    setBKashNumber(newNum);
    localStorage.setItem('jerseybazaar_bKash', newNum);
  };

  const handleUpdateNagadNumber = (newNum: string) => {
    setNagadNumber(newNum);
    localStorage.setItem('jerseybazaar_nagad', newNum);
  };

  const handleCreateOrder = (newOrder: Order) => {
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('jerseybazaar_orders', JSON.stringify(updated));
    updateActiveSessionAction(`Submitted transaction ID ${newOrder.transactionId} for ${newOrder.jerseyName}`, `Customer: ${newOrder.customerName}`);
  };

  const handleUpdateOrdersList = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('jerseybazaar_orders', JSON.stringify(updatedOrders));
  };

  // Switch modal state to buy flow
  const handleBuyNowTrigger = (jersey: Jersey, size: string) => {
    setCheckoutJersey(jersey);
    setCheckoutSize(size);
    setShowCheckoutModal(true);
    updateActiveSessionAction(`Began Order Checkout for ${jersey.name} (Size: ${size})`);
  };

  const handleClearLogs = () => {
    if (confirm('Are you authorized to entirely reset and wipe current visitor tracker registers?')) {
      if (typeof window !== 'undefined') {
        const activeId = sessionStorage.getItem('current_log_id');
        const activeLog = visitorLogs.find(l => l.id === activeId);
        const nextLogs = activeLog ? [activeLog] : [];
        setVisitorLogs(nextLogs);
        localStorage.setItem('jerseybazaar_logs', JSON.stringify(nextLogs));
      }
    }
  };

  const handleAddTestVisitor = () => {
    const testNames = ['Tanvir Alam', 'Sajid Mahmud', 'Farhan Kabir', 'Rashedul Islam', 'Mehedi Hasan', 'Jannatul Ferdous', 'Arafat Rahman', 'Sufian Mostafa'];
    const testCities = ['Mirpur, Dhaka', 'Banani, Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Jashore', 'Uttara, Dhaka'];
    const testDevices = ['Android Mobile', 'iPhone Mobile', 'Windows PC', 'Mac PC'];
    const testActions = [
      'Browsing 2026 Selection Gallery',
      'Checked active Payment Rules card',
      'Copied active bKash wallet number',
      'Began checkout validation for Argentina Three-Star Jersey',
      'Viewed Bangladesh Gold Edition Home Jersey Details',
      'Verified Transaction validation ledger log',
      'Selected Europe Region Jerseys',
      'Opened Facebook direct chat box support'
    ];

    const randomName = testNames[Math.floor(Math.random() * testNames.length)];
    const randomCity = testCities[Math.floor(Math.random() * testCities.length)];
    const randomDevice = testDevices[Math.floor(Math.random() * testDevices.length)];
    const randomAction = testActions[Math.floor(Math.random() * testActions.length)];
    const randomIp = `103.${80 + Math.floor(Math.random() * 80)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    const testId = `v-sim-${Math.floor(Math.random() * 100000)}`;
    const now = new Date();
    const formatTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const formatMonth = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedTimestamp = `${formatMonth}, ${formatTime}`;

    const testVisitor: VisitorLog = {
      id: testId,
      name: randomName,
      location: randomCity,
      device: randomDevice,
      action: randomAction,
      timestamp: formattedTimestamp,
      ip: randomIp,
      isReal: false
    };

    const updated = [testVisitor, ...visitorLogs];
    setVisitorLogs(updated);
    localStorage.setItem('jerseybazaar_logs', JSON.stringify(updated));
    
    const nextViews = viewsCount + 1;
    setViewsCount(nextViews);
    localStorage.setItem('jerseybazaar_views', nextViews.toString());
  };

  const handleResetViewsCount = () => {
    if (confirm('Are you authorized to reset cumulative website views counter?')) {
      setViewsCount(1);
      localStorage.setItem('jerseybazaar_views', '1');
    }
  };


  // Smooth standard division scrolling
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // File Upload base64 encoding and canvas compression handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          // Compress the image to a maximum dimension of 600px with reasonable quality
          const canvas = document.createElement('canvas');
          const maxDim = 600;
          let width = img.width;
          let height = img.height;
          
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85); // 85% quality compress
            setFormImage(compressedBase64);
          } else {
            setFormImage(reader.result as string);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // Admin Save Adding a Jersey
  const handleAddJerseySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCountry || !formName || !formPriceBDT) {
      alert('Please fill out the country, jersey name and price.');
      return;
    }

    const calculatedPriceUSD = Number((formPriceBDT / 100).toFixed(1));
    const newId = formCountry.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

    const newJersey: Jersey = {
      id: newId,
      country: formCountry,
      name: formName,
      priceBDT: Number(formPriceBDT),
      priceUSD: calculatedPriceUSD,
      image: formImage || 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e01a?q=80&w=600&auto=format&fit=crop', // default if empty
      description: formDescription || `Official high definition performance jersey representing ${formCountry} in original sports fiber weave.`,
      rating: 5.0,
      reviewsCount: 1,
      badgeColor: formBadgeColor,
      accentColor: formAccentColor,
      bgGradient: formBgGradient,
    };

    const updated = [newJersey, ...jerseysList];
    setJerseysList(updated);
    localStorage.setItem('jerseybazaar_collections', JSON.stringify(updated));
    
    // reset form
    setFormCountry('');
    setFormName('');
    setFormPriceBDT(1400);
    setFormDescription('');
    setFormImage('');
    setShowAddModal(false);
  };

  // Admin Open Edit Form Handler
  const handleOpenEditModalForJersey = (jersey: Jersey) => {
    setEditingJersey(jersey);
    setFormCountry(jersey.country);
    setFormName(jersey.name);
    setFormPriceBDT(jersey.priceBDT);
    setFormDescription(jersey.description);
    setFormImage(jersey.image);
    setFormBadgeColor(jersey.badgeColor || 'bg-indigo-600 text-white');
    setFormAccentColor(jersey.accentColor || 'text-indigo-400');
    setFormBgGradient(jersey.bgGradient || 'from-indigo-650/10 via-zinc-850/5 to-slate-950');
  };

  const handleEditJerseySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJersey) return;

    const calculatedPriceUSD = Number((formPriceBDT / 100).toFixed(1));

    const updated = jerseysList.map((j) => {
      if (j.id === editingJersey.id) {
        return {
          ...j,
          country: formCountry,
          name: formName,
          priceBDT: Number(formPriceBDT),
          priceUSD: calculatedPriceUSD,
          description: formDescription,
          image: formImage,
          badgeColor: formBadgeColor,
          accentColor: formAccentColor,
          bgGradient: formBgGradient,
        };
      }
      return j;
    });

    setJerseysList(updated);
    localStorage.setItem('jerseybazaar_collections', JSON.stringify(updated));
    
    // clear
    setEditingJersey(null);
    setFormCountry('');
    setFormName('');
    setFormPriceBDT(1400);
    setFormDescription('');
    setFormImage('');
  };

  // Admin Delete Jersey
  const handleDeleteJersey = (id: string) => {
    if (confirm('Are you authorized to entirely delete this national jersey from the live catalogue?')) {
      const updated = jerseysList.filter((j) => j.id !== id);
      setJerseysList(updated);
      localStorage.setItem('jerseybazaar_collections', JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col font-sans select-none">
      {/* Dynamic Header Component */}
      <Header
        bKashNumber={bKashNumber}
        setBKashNumber={handleUpdateBKashNumber}
        nagadNumber={nagadNumber}
        setNagadNumber={handleUpdateNagadNumber}
        activeOrderCount={orders.length}
        scrollToSection={scrollToSection}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        onAddJerseyClick={() => setShowAddModal(true)}
      />

      {/* Main Body Layout Grid */}
      <main className="flex-1 pb-24">
        
        {/* Dynamic Hero Spotlight Area */}
        <section className="relative overflow-hidden pt-12 pb-20 border-b border-white/10 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent font-sans">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {isAdmin && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex flex-col sm:flex-row items-center gap-2.5 bg-rose-500/10 border border-rose-500/35 px-5 py-2.5 rounded-sm text-xs font-bold text-rose-400 mb-6 uppercase tracking-wider"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>AUTHORIZED SCRIPT RUNNING: Store Admin Console Unlocked</span>
                </div>
                <span className="hidden sm:inline text-zinc-500">|</span>
                <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded animate-pulse">
                  ✓ View & Track live web visitors in navigation header
                </span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-sm text-xs font-semibold text-zinc-350 backdrop-blur"
            >
              <BadgeCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Premium World National Jerseys Available</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black tracking-tight text-white mt-6 max-w-4xl mx-auto leading-none uppercase"
            >
              Support Your Nation In <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-150 to-emerald-400">2026 Grand Style</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs sm:text-sm text-zinc-400 mt-6 max-w-2xl mx-auto leading-relaxed"
            >
              Express your deep sporting allegiance. Discover premium national selection jerseys built for maximum performance on and off the soccer field. Log your payment transaction validation securely.
            </motion.p>

            {/* Quick trust metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12 bg-[#141414] border border-white/10 p-4 rounded-xl"
            >
              <div className="p-3 text-center border-r border-white/10 last:border-0">
                <p className="text-xl font-bold font-mono text-white">{jerseysList.length}</p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Nations Jerseys</p>
              </div>
              <div className="p-3 text-center border-r border-white/10 last:border-0">
                <p className="text-xl font-bold font-mono text-white">100%</p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Real & Original</p>
              </div>
              <div className="p-3 text-center border-r border-white/10 last:border-0">
                <p className="text-xl font-bold font-mono text-white">24 Hr</p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Dispatch Hub</p>
              </div>
              <div className="p-3 text-center last:border-0">
                <p className="text-xl font-bold font-mono text-white">Tk 1.3k+</p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Affordable Price</p>
              </div>
            </motion.div>
          </div>
        </section>

         {/* Store Location & Outlet address quick banner */}
        <section className="bg-[#111] border-b border-t border-white/5 py-3 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Store dispatch address: <strong className="text-white">Mirpur, Dhaka</strong> (Delivery anywhere in Bangladesh)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                ✓ ALL DELIVERIES INSURED
              </span>
            </div>
          </div>
        </section>

         {/* Outer Catalog Section */}
        <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 scroll-mt-24 font-sans">
          <div className="text-center sm:text-left mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-emerald-400 tracking-widest uppercase font-bold">
                Premium National Selection
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white mt-1.5 tracking-tight uppercase">
                Official 2026 Jerseys Gallery
              </h3>
            </div>
            
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              {/* Admin Adding Collection Button Trigger */}
              {isAdmin && (
                <button
                  id="admin-add-jersey-btn"
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-xl active:scale-95 transition-all"
                >
                  <PlusCircle className="w-4.5 h-4.5" />
                  <span>Add New Jersey</span>
                </button>
              )}

              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20 px-3 py-1.5 rounded-sm flex items-center gap-1 uppercase tracking-wider font-bold">
                <Truck className="w-3.5 h-3.5" /> FREE DELIVERY IN BD
              </span>
            </div>
          </div>

          {/* Interactive Gallery Navigation Bar */}
          <div className="bg-[#141414] border border-white/10 p-4 rounded-xl mb-10 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-6">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 mr-2 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-emerald-400" /> Filter Region:
              </span>
              {[
                { id: 'All', label: 'All Jerseys' },
                { id: 'Americas', label: 'Americas' },
                { id: 'Europe', label: 'Europe' },
                { id: 'Asia', label: 'Asia' }
              ].map((reg) => {
                const count = reg.id === 'All' 
                  ? jerseysList.length 
                  : jerseysList.filter(j => getJerseyRegion(j.country) === reg.id).length;
                const isSelected = selectedRegion === reg.id;
                
                return (
                  <button
                    key={reg.id}
                    onClick={() => setSelectedRegion(reg.id)}
                    className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15'
                        : 'bg-black/35 text-zinc-400 border border-white/5 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <span>{reg.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-white/10 text-zinc-300'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input Bar */}
            <div className="relative w-full md:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <Search className="w-4 h-4 text-zinc-500" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country or jersey..."
                className="w-full bg-black/40 border border-white/15 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 text-white placeholder-zinc-500 text-xs px-9 py-2 rounded-sm focus:outline-none font-medium tracking-wide transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Grid Layout of Filtered Jerseys */}
          {filteredJerseys.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredJerseys.map((jersey) => (
                <JerseyCard
                  key={jersey.id}
                  jersey={jersey}
                  onBuyNow={handleBuyNowTrigger}
                  isAdmin={isAdmin}
                  onEdit={handleOpenEditModalForJersey}
                  onDelete={handleDeleteJersey}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#141414] border border-white/10 p-12 rounded-xl text-center max-w-lg mx-auto font-sans mt-8">
              <div className="w-12 h-12 rounded-full bg-indigo-500/15 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                <Search className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
              <h4 className="text-white font-bold uppercase tracking-wider text-sm">No Jerseys Match Search</h4>
              <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                We couldn't find any 2026 jersey matching "<span className="text-indigo-400 font-mono font-bold">{searchQuery}</span>" in the {selectedRegion === 'All' ? 'entire database' : `${selectedRegion} region`}.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('All');
                }}
                className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-widest rounded-sm transition-all"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </section>

        {/* Rules & Workflow Segment */}
        <section id="rules" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 scroll-mt-24">
          <RulesCard />
        </section>

        {/* Admin Visitor Traffic & Audience Monitor Section */}
        {isAdmin && (
          <section id="traffic-monitor" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 scroll-mt-24">
            <VisitorTracker
              viewsCount={viewsCount}
              visitorLogs={visitorLogs}
              onClearLogs={handleClearLogs}
              onAddTestVisitor={handleAddTestVisitor}
              onResetViews={handleResetViewsCount}
            />
          </section>
        )}


        {/* Transaction Verification Hub */}
        <section id="verify" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-sans">
            
            {/* Embedded Payment Rules Reminder Form */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="font-mono text-xs text-emerald-400 tracking-widest uppercase font-bold">
                  Quick Ledger Log
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 uppercase">
                  Validate Any Transaction
                </h3>
                <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                  Already paid via Cash (bKash / Nagad)? Provide your customer invoice details here to securely register your Transaction ID on our transparent audited store tracking log.
                </p>
              </div>

              {/* Order Form */}
              <OrderForm
                preselectedJersey={null}
                preselectedSize="M"
                bKashNumber={bKashNumber}
                nagadNumber={nagadNumber}
                onOrderSubmit={handleCreateOrder}
                jerseysList={jerseysList}
              />
            </div>

            {/* Live Client Dashboard Ledger Board */}
            <div id="orders" className="lg:col-span-5 space-y-6 scroll-mt-24">
              <div className="bg-[#141414] border border-white/10 rounded-xl p-6 shadow-2xl">
                <OrdersList
                  orders={orders}
                  onOrderUpdate={handleUpdateOrdersList}
                />
              </div>

              {/* Store contact credentials box */}
              <div className="bg-gradient-to-tr from-black to-[#052818] border border-white/10 rounded-xl p-6 text-center space-y-4 relative overflow-hidden font-sans">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
                
                <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center mx-auto border border-white/10">
                  <Star className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wide text-sm">Instant Confirmation Support</h4>
                  <p className="text-xs text-zinc-450 mt-2 max-w-sm mx-auto leading-relaxed">
                    Message us at our official Facebook channel inbox with your registered payment validation codes to finalize shipment immediately.
                  </p>
                </div>
                <a
                  id="fb-direct-inbox-cta"
                  href="https://www.facebook.com/share/1Bh4gYajWE/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-black hover:bg-zinc-900 text-xs text-white border border-white/10 font-bold px-4 py-2.5 rounded-sm active:scale-95 transition-all uppercase tracking-wider"
                >
                  <span>Chat on Official Facebook Page</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Checkout overlay modal */}
      <AnimatePresence>
        {showCheckoutModal && checkoutJersey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckoutModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative w-full max-w-2xl bg-[#141414] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-1">
                <OrderForm
                  preselectedJersey={checkoutJersey}
                  preselectedSize={checkoutSize}
                  bKashNumber={bKashNumber}
                  nagadNumber={nagadNumber}
                  onOrderSubmit={handleCreateOrder}
                  jerseysList={jerseysList}
                  onClose={() => setShowCheckoutModal(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Adding Collection Modal */}
      <AnimatePresence>
        {showAddModal && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-lg bg-[#141414] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-10 max-h-[92vh] overflow-y-auto font-sans text-xs"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
                  <h3 className="text-base font-black text-white uppercase tracking-tight">Add New Jersey</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-zinc-500 hover:text-white font-mono text-xs"
                  >
                    Close
                  </button>
                </div>

                <form onSubmit={handleAddJerseySubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-450 uppercase mb-1">Country Name</label>
                      <input
                        type="text"
                        value={formCountry}
                        onChange={(e) => setFormCountry(e.target.value)}
                        className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs"
                        placeholder="e.g. Bangladesh"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-450 uppercase mb-1">Price (BDT)</label>
                      <input
                        type="number"
                        value={formPriceBDT}
                        onChange={(e) => setFormPriceBDT(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-450 uppercase mb-1">Jersey Display Name</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs"
                      placeholder="e.g. Bangladesh 2026 Gold Edition Home Jersey"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      Upload Jersey Image from Gallery/Files
                    </label>
                    <div className="border-2 border-dashed border-white/10 rounded p-4 text-center hover:border-indigo-500/50 transition-all bg-black/40">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="block w-full text-zinc-500 text-[11px] font-mono file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                      />
                      <p className="text-[10px] text-zinc-500 mt-2 font-mono">
                        Supports JPEG, PNG, WebP. High contrast display recommended.
                      </p>
                    </div>

                    {/* Preview Upload */}
                    {formImage && (
                      <div className="mt-3 flex items-center gap-3 p-2 bg-black border border-white/5 rounded">
                        <img
                          src={formImage}
                          alt="preview"
                          className="w-12 h-12 object-contain bg-zinc-900 border border-white/10 p-0.5 rounded cursor-pointer"
                        />
                        <div className="text-[9px] font-mono text-zinc-400 flex-1 truncate">
                          <span>Image Loaded Successfully ✓</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormImage('')}
                          className="text-red-500 hover:text-white px-1.5"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Manual Image URL field fallback */}
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">
                      Or Paste Image URL Address
                    </label>
                    <input
                      type="text"
                      value={formImage.startsWith('data:') ? '' : formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-[11px] font-mono"
                      placeholder="e.g. https://domain.club/jersey.png"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Price description & specifications details</label>
                    <textarea
                      rows={2}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs resize-none"
                      placeholder="Wear details, premium fabric description, collar layout specifications..."
                    />
                  </div>

                  {/* Stylistic Color Presets */}
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1.5">Color theme preset accent</label>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      {[
                        { 
                          label: 'Crimson Fury (Red)', 
                          badge: 'bg-red-650 text-white', 
                          accent: 'text-red-500', 
                          grad: 'from-red-650/10 via-zinc-850/5 to-slate-950' 
                        },
                        { 
                          label: 'Royal Blue (France/Italy)', 
                          badge: 'bg-[#002395] text-white', 
                          accent: 'text-blue-400', 
                          grad: 'from-blue-600/10 via-zinc-850/5 to-slate-950' 
                        },
                        { 
                          label: 'Golden Aura (Spain/Brazil)', 
                          badge: 'bg-amber-500 text-black', 
                          accent: 'text-amber-400', 
                          grad: 'from-amber-600/10 via-zinc-850/5 to-slate-950' 
                        },
                        { 
                          label: 'Forest Shield (BD/Portugal)', 
                          badge: 'bg-[#006a4e] text-white', 
                          accent: 'text-emerald-500', 
                          grad: 'from-emerald-600/10 via-zinc-850/5 to-slate-950' 
                        },
                      ].map((preset) => (
                        <button
                          type="button"
                          key={preset.label}
                          onClick={() => {
                            setFormBadgeColor(preset.badge);
                            setFormAccentColor(preset.accent);
                            setFormBgGradient(preset.grad);
                          }}
                          className={`p-2 rounded border text-left flex flex-col justify-between ${
                            formBadgeColor === preset.badge
                              ? 'border-indigo-500 bg-indigo-500/5'
                              : 'border-white/5 bg-black/40 hover:border-white/20'
                          }`}
                        >
                          <span className="font-bold">{preset.label}</span>
                          <span className="text-[8px] opacity-70 truncate mt-1">Theme mapped</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex pt-4 gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider py-3 rounded active:scale-95 transition-all"
                    >
                      Publish New Jersey
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                      }}
                      className="bg-zinc-850 hover:bg-zinc-850 text-zinc-400 text-xs px-4 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Editing Collection Modal */}
      <AnimatePresence>
        {editingJersey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setEditingJersey(null);
                setFormImage('');
              }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-lg bg-[#141414] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-10 max-h-[92vh] overflow-y-auto font-sans text-xs"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
                  <h3 className="text-base font-black text-white uppercase tracking-tight">Edit Jersey Details</h3>
                  <button
                    onClick={() => {
                      setEditingJersey(null);
                      setFormImage('');
                    }}
                    className="text-zinc-500 hover:text-white font-mono text-xs"
                  >
                    Close
                  </button>
                </div>

                <form onSubmit={handleEditJerseySubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Country Name</label>
                      <input
                        type="text"
                        value={formCountry}
                        onChange={(e) => setFormCountry(e.target.value)}
                        className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Price (BDT)</label>
                      <input
                        type="number"
                        value={formPriceBDT}
                        onChange={(e) => setFormPriceBDT(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Jersey Display Name</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs"
                      required
                    />
                  </div>

                  {/* Gallery/Files Uploader */}
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      Replace Image from Gallery (Upload)
                    </label>
                    <div className="border-2 border-dashed border-white/10 rounded p-4 text-center hover:border-indigo-500/50 transition-all bg-black/40">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="block w-full text-zinc-500 text-[11px] font-mono file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                      />
                      <p className="text-[10px] text-zinc-500 mt-2 font-mono">
                        Select any local original image to instantly replace current graphic
                      </p>
                    </div>

                    {/* Preview Upload */}
                    {formImage && (
                      <div className="mt-3 flex items-center gap-3 p-2 bg-black border border-white/5 rounded">
                        <img
                          src={formImage}
                          alt="preview"
                          className="w-12 h-12 object-contain bg-zinc-900 border border-white/10 p-0.5 rounded"
                        />
                        <div className="text-[9px] font-mono text-emerald-450 flex-1 truncate">
                          <span>Replacement Photo Loaded ✓</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormImage('')}
                          className="text-red-500 hover:text-white px-1.5"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Manual URL link backup */}
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1 font-bold">
                      Or Image Web Link Address
                    </label>
                    <input
                      type="text"
                      value={formImage.startsWith('data:') ? '' : formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-[11px] font-mono"
                      placeholder="Paste online image link..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Price description & specifications details</label>
                    <textarea
                      rows={2}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs resize-none"
                      required
                    />
                  </div>

                  {/* Style Accents selection */}
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1.5">Color theme preset accent</label>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      {[
                        { 
                          label: 'Crimson Fury (Red)', 
                          badge: 'bg-red-650 text-white', 
                          accent: 'text-red-500', 
                          grad: 'from-red-650/10 via-zinc-850/5 to-slate-950' 
                        },
                        { 
                          label: 'Royal Blue (France/Italy)', 
                          badge: 'bg-[#002395] text-white', 
                          accent: 'text-blue-400', 
                          grad: 'from-blue-600/10 via-zinc-850/5 to-slate-950' 
                        },
                        { 
                          label: 'Golden Aura (Spain/Brazil)', 
                          badge: 'bg-amber-500 text-black', 
                          accent: 'text-amber-400', 
                          grad: 'from-amber-600/10 via-zinc-850/5 to-slate-950' 
                        },
                        { 
                          label: 'Forest Shield (BD/Portugal)', 
                          badge: 'bg-[#006a4e] text-white', 
                          accent: 'text-emerald-500', 
                          grad: 'from-emerald-600/10 via-zinc-850/5 to-slate-950' 
                        },
                      ].map((preset) => (
                        <button
                          type="button"
                          key={preset.label}
                          onClick={() => {
                            setFormBadgeColor(preset.badge);
                            setFormAccentColor(preset.accent);
                            setFormBgGradient(preset.grad);
                          }}
                          className={`p-2 rounded border text-left flex flex-col justify-between ${
                            formBadgeColor === preset.badge
                              ? 'border-indigo-500 bg-indigo-500/5'
                              : 'border-white/5 bg-black/40 hover:border-white/20'
                          }`}
                        >
                          <span className="font-bold">{preset.label}</span>
                          <span className="text-[8px] opacity-70 truncate mt-1">Theme mapped</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex pt-4 gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider py-3 rounded active:scale-95 transition-all"
                    >
                      Save Configuration
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingJersey(null);
                        setFormImage('');
                      }}
                      className="bg-zinc-850 hover:bg-zinc-850 text-zinc-400 text-xs px-4 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Bottom Footer block */}
      <footer className="w-full bg-[#0a0a0a] border-t border-white/10 py-10 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-sans text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2">
              <h5 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
                NAFI.JERSEY<span className="text-emerald-400">.HOUSE</span>
              </h5>
              <span className="text-zinc-700">|</span>
              <p className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">
                © 2026. ALL RIGHTS RESERVED.
              </p>
            </div>
            
            {/* Public Live View Counter Badge */}
            <div 
              className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-2.5 py-1 rounded-sm text-zinc-400 text-[10px] font-mono tracking-wide"
              title="Public total website page hits"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e194] animate-pulse"></span>
              <span className="text-zinc-500">VIEWS:</span>
              <span className="text-[#00e194] font-bold">{viewsCount}</span>
            </div>
          </div>

          <div className="flex gap-4 text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
            <a href="https://www.facebook.com/share/1Bh4gYajWE/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors text-emerald-400 font-bold">Facebook Channel</a>
            <span>•</span>
            <span className="cursor-pointer hover:text-white" onClick={() => scrollToSection('rules')}>Payment Rules</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-white" onClick={() => scrollToSection('verify')}>Transaction Board</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
