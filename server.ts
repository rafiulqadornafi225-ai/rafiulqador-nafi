import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";

// Definitions matching type system on client
interface Jersey {
  id: string;
  country: string;
  name: string;
  priceBDT: number;
  priceUSD: number;
  image: string;
  description: string;
  rating: number;
  reviewsCount: number;
  badgeColor: string;
  accentColor: string;
  bgGradient: string;
}

interface Order {
  id: string;
  jerseyId: string;
  jerseyName: string;
  countryName: string;
  size: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  transactionId: string;
  amount: number;
  timestamp: string;
  status: 'Pending Verification' | 'Verified' | 'Shipped' | 'Delivered';
  customNumber?: string;
  customName?: string;
}

interface VisitorLog {
  id: string;
  name: string;
  location: string;
  device: string;
  action: string;
  timestamp: string;
  ip: string;
  isReal?: boolean;
}

interface DBState {
  bKashNumber: string;
  nagadNumber: string;
  jerseys: Jersey[];
  orders: Order[];
  viewsCount: number;
  visitorLogs: VisitorLog[];
}

const DEFAULT_JERSEYS: Jersey[] = [
  {
    id: 'brazil-2026',
    country: 'Brazil',
    name: 'Brazil 2026 Authentic Home Jersey',
    priceBDT: 1450,
    priceUSD: 14,
    image: '/input_file_3.png',
    description: 'Embrace the soul of Joga Bonito. The 2026 edition features an organic canvas pattern embodying Brazil’s rainforest layers, completed with a performance-driven flat-knit green collar and elastic sleeves.',
    rating: 4.9,
    reviewsCount: 142,
    badgeColor: 'bg-[#009b3a] text-white',
    accentColor: 'text-yellow-400',
    bgGradient: 'from-amber-500/10 via-green-600/5 to-slate-950',
  },
  {
    id: 'argentina-2026',
    country: 'Argentina',
    name: 'Argentina 2026 Three-Star Home Jersey',
    priceBDT: 1400,
    priceUSD: 13,
    image: '/input_file_1.png',
    description: 'Rich in history, designed for champions. Crafted with Argentine sky blue and alabaster vertical stripes, integrated with championship gold borders, and crowned by the iconic three golden stars crest.',
    rating: 4.8,
    reviewsCount: 198,
    badgeColor: 'bg-[#74acdf] text-white',
    accentColor: 'text-[#74acdf]',
    bgGradient: 'from-[#74acdf]/10 via-amber-400/5 to-slate-950',
  },
  {
    id: 'bangladesh-2026',
    country: 'Bangladesh',
    name: 'Bangladesh 2026 Gold Edition Home Jersey',
    priceBDT: 1350,
    priceUSD: 12,
    image: '/input_file_2.png',
    description: 'Celebrate the pride of the Bengal Tigers. This premium 2026 edition features a dynamic red and green abstract canvas with geometric lines, completed with a solid crimson collar and high-definition Bangladesh football federation crest.',
    rating: 4.9,
    reviewsCount: 224,
    badgeColor: 'bg-[#006a4e] text-white',
    accentColor: 'text-red-500',
    bgGradient: 'from-emerald-600/10 via-red-650/5 to-slate-950',
  },
  {
    id: 'japan-2026',
    country: 'Japan',
    name: 'Japan 2026 Special Edition Anime Jersey',
    priceBDT: 1490,
    priceUSD: 14.5,
    image: '/input_file_4.png',
    description: 'Where anime fantasy meets elite pitch performance. Engineered with custom dark ink patterns, featuring a highly-detailed Itachi and Akatsuki-crossover manga character illustration integrated right into the knit paneling.',
    rating: 5.0,
    reviewsCount: 312,
    badgeColor: 'bg-red-600 text-white',
    accentColor: 'text-red-500',
    bgGradient: 'from-red-600/10 via-zinc-850/5 to-slate-950',
  },
  {
    id: 'france-2026',
    country: 'France',
    name: 'France 2026 Royal Crest Home Jersey',
    priceBDT: 1500,
    priceUSD: 15,
    image: '/src/assets/images/france_jersey_2026_1779474568262.png',
    description: 'Sleek French elegance meets high-performance engineering. Featuring a majestic metallic royal blue base, textured honeycomb details, and an imposing gilded oversized cockerel crest.',
    rating: 4.9,
    reviewsCount: 125,
    badgeColor: 'bg-[#002395] text-white',
    accentColor: 'text-blue-400',
    bgGradient: 'from-blue-600/10 via-red-600/5 to-slate-950',
  },
  {
    id: 'spain-2026',
    country: 'Spain',
    name: 'Spain 2026 La Furia Roja Home Jersey',
    priceBDT: 1350,
    priceUSD: 12.5,
    image: '/input_file_0.png',
    description: 'Feel the heat of La Furia Roja. Imbued with a striking scarlet red hue and fluid gold side piping, complete with Spain’s newly minted coat-of-arms in minimalist monochrome finish.',
    rating: 4.7,
    reviewsCount: 94,
    badgeColor: 'bg-[#c60b1e] text-white',
    accentColor: 'text-red-500',
    bgGradient: 'from-red-600/10 via-yellow-500/5 to-slate-950',
  },
  {
    id: 'portugal-2026',
    country: 'Portugal',
    name: 'Portugal 2026 Navigator Home Jersey',
    priceBDT: 1480,
    priceUSD: 14.5,
    image: '/src/assets/images/portugal_jersey_2026_1779474611877.png',
    description: 'Honoring the legacy of Portuguese maritime discoverers. Clad in luxurious dark burgundy red, with high-definition deep pine-green borders and elegant gold nautical motifs.',
    rating: 4.9,
    reviewsCount: 167,
    badgeColor: 'bg-[#046a38] text-white',
    accentColor: 'text-[#d01c1f]',
    bgGradient: 'from-emerald-600/10 via-red-600/5 to-slate-950',
  },
  {
    id: 'germany-2026',
    country: 'Germany',
    name: 'Germany 2026 Modernist Home Jersey',
    priceBDT: 1380,
    priceUSD: 13.5,
    image: '/src/assets/images/germany_jersey_2026_1779474631424.png',
    description: 'Architectural precision in athletic wear. Features a stark clean white background accented by premium deep-black mesh trims and a subtle gradient of sovereign gold and red across the knit lines.',
    rating: 4.8,
    reviewsCount: 110,
    badgeColor: 'bg-black text-white',
    accentColor: 'text-slate-400',
    bgGradient: 'from-slate-600/10 via-amber-500/5 to-slate-950',
  },
];

const SEED_LOGS: VisitorLog[] = [
  { id: 'v-103', name: 'Zeeshan Ahmed', location: 'Mirpur, Dhaka', device: 'Android Mobile', action: 'Purchased Argentina Three-Star Jersey', timestamp: 'May 22, 2026, 06:40 PM', ip: '103.114.172.5' },
  { id: 'v-104', name: 'Subho Chowdhury', location: 'Sylhet', device: 'iPhone Mobile', action: 'Viewed Bangladesh Gold Edition Home Jersey', timestamp: 'May 22, 2026, 06:55 PM', ip: '103.199.155.12' },
  { id: 'v-105', name: 'Imran Khan', location: 'Uttara, Dhaka', device: 'Windows PC', action: 'Began order checkout for Japan Special Jersey', timestamp: 'May 22, 2026, 07:02 PM', ip: '113.11.144.17' },
  { id: 'v-106', name: 'Tanzim Rony', location: 'Banani, Dhaka', device: 'Android Mobile', action: 'Copied bKash Active Number', timestamp: 'May 22, 2026, 07:15 PM', ip: '119.30.22.84' },
  { id: 'v-107', name: 'Mashrafe Alom', location: 'Chittagong', device: 'Mac PC', action: 'Viewed Brazil 2026 Authentic Home Jersey', timestamp: 'May 22, 2026, 07:18 PM', ip: '37.111.201.2' },
  { id: 'v-108', name: 'Nabila Karim', location: 'Dhanmondi, Dhaka', device: 'iPhone Mobile', action: 'Verified payment transaction submission', timestamp: 'May 22, 2026, 07:22 PM', ip: '103.144.200.54' },
  { id: 'v-109', name: 'Zahid Hasan', location: 'Mirpur, Dhaka', device: 'Android Mobile', action: 'Browsing active 2026 Selection Gallery', timestamp: 'May 22, 2026, 07:24 PM', ip: '103.111.18.99' },
  { id: 'v-110', name: 'Fahim Anwar', location: 'Rajshahi', device: 'Windows PC', action: 'Selected Portugal Navigator Home Jersey', timestamp: 'May 22, 2026, 07:27 PM', ip: '116.58.204.1' }
];

const DB_FILE = path.join(process.cwd(), "db.json");

// Define in-memory state loaded from file
let state: DBState = {
  bKashNumber: '01402580064',
  nagadNumber: '01402580064',
  jerseys: DEFAULT_JERSEYS,
  orders: [],
  viewsCount: 147,
  visitorLogs: SEED_LOGS
};

// Helper load/save database state asynchronously
async function loadState() {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    const parsed = JSON.parse(data);
    state = { ...state, ...parsed };
    console.log("Database state loaded successfully.");
  } catch (err) {
    console.log("Database file doesn't exist or is corrupt. Initializing default state...");
    await saveState();
  }
}

async function saveState() {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write state on disk", err);
  }
}

async function startServer() {
  // Pre-load current state
  await loadState();

  const app = express();
  const PORT = 3000;

  // JSON middleware with expanded capacity for large base64 image loads
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // API 1: Fetch entire store configuration
  app.get("/api/config", (req, res) => {
    res.json(state);
  });

  // API 2: Submit a payment wallet update
  app.post("/api/config/payment", async (req, res) => {
    const { bKashNumber, nagadNumber } = req.body;
    if (bKashNumber !== undefined) state.bKashNumber = bKashNumber;
    if (nagadNumber !== undefined) state.nagadNumber = nagadNumber;
    await saveState();
    res.json({ success: true, bKashNumber: state.bKashNumber, nagadNumber: state.nagadNumber });
  });

  // API 3: Save, Add, or Edit catalog jerseys
  app.post("/api/jerseys", async (req, res) => {
    const freshJersey: Jersey = req.body;
    if (!freshJersey || !freshJersey.id) {
      return res.status(400).json({ error: "Missing jersey parameter details" });
    }

    const index = state.jerseys.findIndex(j => j.id === freshJersey.id);
    if (index !== -1) {
      // Edit existing
      state.jerseys[index] = { ...state.jerseys[index], ...freshJersey };
    } else {
      // Add new
      state.jerseys = [freshJersey, ...state.jerseys];
    }

    await saveState();
    res.json({ success: true, jerseys: state.jerseys });
  });

  // API 4: Delete catalog jersey
  app.delete("/api/jerseys/:id", async (req, res) => {
    const { id } = req.params;
    state.jerseys = state.jerseys.filter(j => j.id !== id);
    await saveState();
    res.json({ success: true, jerseys: state.jerseys });
  });

  // API 5: Create customer transaction order
  app.post("/api/orders", async (req, res) => {
    const order: Order = req.body;
    if (!order || !order.id) {
      return res.status(400).json({ error: "Invalid order transaction" });
    }

    state.orders = [order, ...state.orders];
    await saveState();
    res.json({ success: true, orders: state.orders });
  });

  // API 6: Update orders list (status changes, deletions by admin)
  app.post("/api/orders/update-list", async (req, res) => {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: "Expected array of orders" });
    }
    state.orders = orders;
    await saveState();
    res.json({ success: true, orders: state.orders });
  });

  // API 7: Manage live visitor logs stream (individual visitor state logging)
  app.post("/api/visitor-logs", async (req, res) => {
    const { logs, singleLog, actionUpdate, sessionId, customName } = req.body;
    
    if (Array.isArray(logs)) {
      state.visitorLogs = logs;
    } else if (singleLog) {
      // Insert single visitor log at head
      state.visitorLogs = [singleLog, ...state.visitorLogs.filter(l => l.id !== singleLog.id)];
    } else if (actionUpdate && sessionId) {
      // Dynamically modernize specific session log action
      state.visitorLogs = state.visitorLogs.map(log => {
        if (log.id === sessionId) {
          return {
            ...log,
            action: actionUpdate,
            name: customName ? customName : log.name
          };
        }
        return log;
      });
    }

    await saveState();
    res.json({ success: true, visitorLogs: state.visitorLogs });
  });

  // API 8: Clear visitor logs tracker
  app.post("/api/visitor-logs/clear", async (req, res) => {
    const { activeLogId } = req.body;
    const activeLog = state.visitorLogs.find(l => l.id === activeLogId);
    state.visitorLogs = activeLog ? [activeLog] : [];
    await saveState();
    res.json({ success: true, visitorLogs: state.visitorLogs });
  });

  // API 9: Increment cumulative views
  app.post("/api/views/increment", async (req, res) => {
    state.viewsCount += 1;
    await saveState();
    res.json({ success: true, viewsCount: state.viewsCount });
  });

  // API 10: Reset cumulative views
  app.post("/api/views/reset", async (req, res) => {
    state.viewsCount = 1;
    await saveState();
    res.json({ success: true, viewsCount: state.viewsCount });
  });


  // Mounting Vite Dev Middleware or Serving Static build assets in Production mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express and Vite backend server initialized on port ${PORT}`);
  });
}

startServer();
