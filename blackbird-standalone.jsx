const { useState, useEffect, useMemo, useRef, createContext, useContext } = React;
const { Truck, Clock, Users, Fuel, LogOut, Play, Square, Plus, Edit3, Trash2, UserCog, Activity, TrendingUp, Calendar, ChevronLeft, ChevronRight, BarChart3, FileText, Settings, Eye, EyeOff, AlertCircle, Check, X, User, Home, History, Droplet, Menu, ArrowRight, MapPin, Zap, Search, Download, CircleUser, Radio } = lucideReact;
const { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } = Recharts;

/* ============================================================
   FONTS + GLOBAL STYLES
   ============================================================ */
const GLOBAL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Manrope:wght@300..800&family=JetBrains+Mono:wght@400..700&display=swap');

.bb-display { font-family: 'Bricolage Grotesque', sans-serif; letter-spacing: -0.02em; }
.bb-body    { font-family: 'Manrope', sans-serif; }
.bb-mono    { font-family: 'JetBrains Mono', monospace; font-feature-settings: 'tnum'; }

@keyframes bb-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.55; transform: scale(1.35); }
}
.bb-live-dot { animation: bb-pulse 1.6s ease-in-out infinite; }

@keyframes bb-slide-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.bb-slide { animation: bb-slide-up 0.4s ease-out backwards; }

@keyframes bb-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.bb-shimmer {
  background: linear-gradient(90deg, transparent, rgba(234,88,12,0.18), transparent);
  background-size: 200% 100%;
  animation: bb-shimmer 3s infinite;
}

.bb-grid-bg {
  background-image:
    linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px);
  background-size: 48px 48px;
}

.bb-radial-glow {
  background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(234,88,12,0.08), transparent 70%);
}

.bb-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.bb-scrollbar::-webkit-scrollbar-track { background: transparent; }
.bb-scrollbar::-webkit-scrollbar-thumb { background: #d4d4d8; border-radius: 3px; }
.bb-scrollbar::-webkit-scrollbar-thumb:hover { background: #a3a3a3; }

input.bb-input, select.bb-input {
  background: #ffffff;
  border: 1px solid #d4d4d8;
  color: #0a0a0a;
  transition: all 0.15s ease;
}
input.bb-input:focus, select.bb-input:focus {
  outline: none;
  border-color: #ea580c;
  box-shadow: 0 0 0 3px rgba(234,88,12,0.15);
}
input.bb-input::placeholder { color: #a3a3a3; }
`;

/* ============================================================
/* ============================================================
   BRAND LOGO â€” Blackbird Logistics official mark
   ============================================================ */
const BLACKBIRD_LOGO_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABPCAYAAABS1GNxAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAACzElEQVR42u2bS28SURSAz5BG9yQajTX+HxdNXLrQRCsPoZ1KY1uMMdWFTa0SBtOnMIFOBRQpEFstUIqWUlrjv9D4D1hJzHWhJqa1OMBc7mPOl9ztzJlvzn2cO3cAEARBEARBEARBEARBEASxkORLg/h9bgIAbdu46ifV8haRUoIWDv1XQLuWz2XEF1PZLvUk4YQmHrn1VzREiCdlr7ZDW4RQUvopg/h8Xv6kHDRqpN8i/m4bb3N8SNFjy0xF8Nh1uBGSiEeZS1E4HNQUIYSMjvjAMaDAqYHT0PrxHbTwPJWA0msGXL12XeFCiNt1A86dOQvnBy/ApcGLcHnoiunAKsV35Mu3r3Bz2Ct8llAhn013PZb8Lg0sJ5vNEF2PkkIhR2q1j+yGijH1NrMZJ5VMcD3T9S24NUMXY+qfnAiYDm5zI99xgIX8G/HWQjOPH9EKsGsRI34P2+WH1+MyHexe/QOhJQIAyNO5GfFWya7hW6RcLBEAgGplh6STKUtWx9vl9/wsTFeWF5mVCRHtGbfbDn2XsV8/eQ2icCKEm1rJwdpGcGqCq8KRuRCn00n9HoHAmOnewFxIq9Wien1VVSEcjohTLAbuqFztwsk+qHb8fA6Ql65etpRC0ilDzMCnJse5271XJBw/enomZl1mYV7jTgbrDCG8yWCZIZbK+HTYEHcGoPDplL80Y5gdlsfvEFHGveBdai9TETAzqMbclwxZWnxOLLgGL7VXb+z3eDQrEYtKd5SzKxGfDxpSnmntSMLD6QdyHuwFAJi+HzQt4sXKgrwiAAAqxS1TIoxVXW4RZrvK69SqbUS0lRGPLdlKBPg9//4rIvRk1l4iAAAiobnjJ5TdLvuJAAA4rO8ek1Etl+wp4+i4kTLiQotQLJLBcjuBn+Iu8Ot0IaxnknIUXr2ghWbF/SvK6gyplDZJs9nErPjDbtXeMwiCIAiCdMdPraRA5E4dRpsAAAAASUVORK5CYII=";

const BlackbirdLogo = ({ size = 32, className = "" }) => (
  <img
    src={BLACKBIRD_LOGO_SRC}
    alt="Blackbird Logistics"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', objectFit: 'contain', height: size, width: 'auto' }}
  />
);

/* ============================================================
   UTILITIES
   ============================================================ */
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

// Friday-to-Thursday week (CRITICAL business requirement)
function getWeekRange(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun..6=Sat, Friday=5
  const daysSinceFriday = (day - 5 + 7) % 7;
  const start = new Date(d);
  start.setDate(d.getDate() - daysSinceFriday);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

const fmtTime = (d) => new Date(d).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });
const fmtDate = (d) => new Date(d).toLocaleDateString('en-AU', { day: '2-digit', month: 'short' });
const fmtDateLong = (d) => new Date(d).toLocaleDateString('en-AU', { weekday: 'short', day: '2-digit', month: 'short' });
const fmtDow = (d) => new Date(d).toLocaleDateString('en-AU', { weekday: 'short' });

function fmtDuration(ms) {
  if (!ms || ms < 0) return '0:00';
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}:${m.toString().padStart(2, '0')}`;
}
function fmtDurationLong(ms) {
  if (!ms || ms < 0) return '0h 00m 00s';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
}

const dayKey = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${(x.getMonth() + 1).toString().padStart(2, '0')}-${x.getDate().toString().padStart(2, '0')}`;
};

/* ============================================================
   PERSISTED STATE HOOK (uses window.storage; no localStorage)
   ============================================================ */
function usePersistedState(key, initialValue, shared = true) {
  const [state, setState] = useState(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await window.storage.get(key, shared);
        if (!cancelled && result?.value) {
          try { setState(JSON.parse(result.value)); } catch {}
        }
      } catch {}
      if (!cancelled) setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [key]);

  const setPersistedState = (newValue) => {
    setState(prev => {
      const next = typeof newValue === 'function' ? newValue(prev) : newValue;
      try { window.storage.set(key, JSON.stringify(next), shared); } catch {}
      return next;
    });
  };

  return [state, setPersistedState, loaded];
}

/* ============================================================
   SEED DATA (drivers from your real timesheets + a few more)
   ============================================================ */
const SEED_EMPLOYEES = [
  { id: 'admin-1', name: 'Admin', role: 'admin', pin: '0000', active: true, createdAt: Date.now() },
  // Drivers (hourly)
  { id: 'drv-1', name: 'John Sturzaker', role: 'driver', workerType: 'driver', pin: '0000', active: true,
    baseRate: 33.09, otRate: 49.64, dtRate: 66.18, createdAt: Date.now() },
  { id: 'drv-2', name: 'Jaime Alarcon',  role: 'driver', workerType: 'driver', pin: '0000', active: true,
    baseRate: 33.09, otRate: 49.64, dtRate: 66.18, createdAt: Date.now() },
  { id: 'drv-3', name: 'Marcus Chen',    role: 'driver', workerType: 'driver', pin: '0000', active: true,
    baseRate: 35.50, otRate: 53.25, dtRate: 71.00, createdAt: Date.now() },
  { id: 'drv-4', name: 'Liam Oâ€™Connell', role: 'driver', workerType: 'driver', pin: '0000', active: true,
    baseRate: 33.09, otRate: 49.64, dtRate: 66.18, createdAt: Date.now() },
  { id: 'drv-5', name: 'Priya Sharma',   role: 'driver', workerType: 'driver', pin: '0000', active: true,
    baseRate: 38.00, otRate: 57.00, dtRate: 76.00, createdAt: Date.now() },
  // Subcontractor (paid per day)
  { id: 'sub-1', name: 'Diego Rossi',    role: 'driver', workerType: 'subcontractor', pin: '0000', active: true,
    dayRate: 480.00, createdAt: Date.now() },
];

/* ----- Worker types -----
   - driver:        hourly rate with OT/DT tiers + 30 min auto-break
   - subcontractor: flat day rate per shift; each shift counts as 1 paid day
*/
const WORKER_TYPES = [
  { id: 'driver',        label: 'Driver',        sub: 'hourly + OT/DT' },
  { id: 'subcontractor', label: 'Subcontractor', sub: 'paid per day' },
];
const WT_LABEL = (id) => (WORKER_TYPES.find(w => w.id === id)?.label) || 'Driver';

/* ----- Pay calculation rules ----- */
const OT_THRESHOLD_HRS = 8;
const DT_THRESHOLD_HRS = 10;
const BREAK_AFTER_HRS  = 6;
const BREAK_HRS        = 0.5;

const driverRates = (drv) => ({
  baseRate: drv?.baseRate ?? 33.09,
  otRate:   drv?.otRate   ?? 49.64,
  dtRate:   drv?.dtRate   ?? 66.18,
});

// Returns the wage info for a single shift, depending on the worker's type.
function wageForShift(shift, worker, now = Date.now()) {
  if (!shift || !worker) return { workedMs: 0, workedHrs: 0, paidHrs: 0, earned: 0, breakHrs: 0 };
  const endT = shift.endTime || now;
  const workedMs = Math.max(0, endT - shift.startTime);
  const workedHrs = workedMs / 3600000;
  const type = worker.workerType || 'driver';

  if (type === 'subcontractor') {
    // One shift = one paid day at the worker's day rate, regardless of hours
    return {
      workedMs, workedHrs,
      paidHrs: workedHrs,
      earned: shift.endTime ? (worker.dayRate ?? 0) : 0,
      breakHrs: 0,
      payBasis: 'day',
      dayRate: worker.dayRate ?? 0,
    };
  }

  // Driver: hourly with OT/DT + auto-break
  const breakHrs = workedHrs >= BREAK_AFTER_HRS ? BREAK_HRS : 0;
  const paidHrs = Math.max(0, workedHrs - breakHrs);
  const r = driverRates(worker);
  const t1 = Math.min(paidHrs, OT_THRESHOLD_HRS);
  const t2 = Math.max(0, Math.min(paidHrs, DT_THRESHOLD_HRS) - OT_THRESHOLD_HRS);
  const t3 = Math.max(0, paidHrs - DT_THRESHOLD_HRS);
  const earned = t1 * r.baseRate + t2 * r.otRate + t3 * r.dtRate;
  return { workedMs, workedHrs, paidHrs, earned, breakHrs, payBasis: 'hourly' };
}

// Aggregate this worker's earnings for a given week range.
// For drivers: sum of shift wages.
// For subcontractors: dayRate Ã— number of closed shifts in the week (each shift = 1 day).
function weeklyEarnings(worker, shifts, weekStart, weekEnd, now = Date.now()) {
  const type = worker.workerType || 'driver';
  const wkShifts = shifts.filter(s =>
    s.employeeId === worker.id &&
    s.startTime >= weekStart &&
    s.startTime <= weekEnd
  );
  let paidHrs = 0;
  wkShifts.forEach(s => {
    const w = wageForShift(s, worker, now);
    paidHrs += w.paidHrs;
  });

  if (type === 'subcontractor') {
    const closedShifts = wkShifts.filter(s => !!s.endTime);
    return {
      shiftCount: wkShifts.length,
      paidHrs,
      earned: closedShifts.length * (worker.dayRate ?? 0),
      payBasis: 'day',
    };
  }
  // Driver â€” hourly path
  let earned = 0;
  wkShifts.forEach(s => { earned += wageForShift(s, worker, now).earned; });
  return { shiftCount: wkShifts.length, paidHrs, earned, payBasis: 'hourly' };
}

const fmtMoney = (n) => '$' + (n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtHrs   = (h) => (h || 0).toFixed(2) + 'h';

// Build seed shifts/fuel for the past 3 Fridayâ†’Thursday weeks so the week selector has history.
function buildSeed() {
  const { start: thisWeekStart } = getWeekRange();
  const shifts = [];
  const fuel = [];
  const drivers = SEED_EMPLOYEES.filter(e => e.role === 'driver');
  // Pool of plates that get rotated daily so seed data shows the "different plate every day" behaviour
  const platePool = ['RC1', '772', 'CT1', 'RC2', '774', 'BLK7', 'BLK9', 'MEL12'];

  // Generate this week + 2 prior weeks
  for (let weekOffset = -2; weekOffset <= 0; weekOffset++) {
    const weekStart = new Date(thisWeekStart);
    weekStart.setDate(thisWeekStart.getDate() + weekOffset * 7);
    // Current week leaves today (and beyond) empty for live demo
    const dayLimit = weekOffset === 0 ? 6 : 7;
    for (let i = 0; i < dayLimit; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      drivers.forEach((drv, idx) => {
        // Different plate each day per driver, varying by week too
        const plate = platePool[(idx + i + Math.abs(weekOffset) * 3) % platePool.length];
        const startH = 6 + (idx % 3);
        const startM = (idx * 15) % 60;
        const dur = 7.5 + ((idx + i + Math.abs(weekOffset)) % 3) * 0.5;
        const breakMin = 30;
        const s = new Date(day); s.setHours(startH, startM, 0, 0);
        const e = new Date(s.getTime() + dur * 3600 * 1000 + breakMin * 60 * 1000);
        shifts.push({
          id: uid(),
          employeeId: drv.id,
          startTime: s.getTime(),
          endTime: e.getTime(),
          breakMinutes: breakMin,
          location: plate,
          notes: '',
          editedAt: null,
        });
        const cycle = (i + idx + Math.abs(weekOffset)) % 4;
        const noFuel = cycle === 0;
        const cardInvalid = cycle === 1 && i > 0;
        fuel.push({
          id: uid(),
          driverId: drv.id,
          date: day.getTime(),
          cost: (noFuel || cardInvalid) ? 0 : (180 + ((i * 13 + idx * 7) % 90)) * 1.92,
          noFuel,
          cardInvalid,
          notes: cardInvalid ? 'Card declined at terminal' : '',
          truck: plate,
        });
      });
    }
  }
  return { shifts, fuel };
}

/* ============================================================
   APP-WIDE DATA CONTEXT
   ============================================================ */
const DataCtx = createContext(null);
const useData = () => useContext(DataCtx);

function DataProvider({ children }) {
  const [employees, setEmployees, eL] = usePersistedState('bb_employees_v8', SEED_EMPLOYEES, true);
  const [shifts, setShifts, sL] = usePersistedState('bb_shifts_v8', [], true);
  const [fuel, setFuel, fL] = usePersistedState('bb_fuel_v8', [], true);
  const [seeded, setSeeded] = usePersistedState('bb_seeded_v8', false, true);
  const [session, setSession] = usePersistedState('bb_session_v8', null, false);

  // Seed once
  useEffect(() => {
    if (eL && sL && fL && !seeded) {
      const { shifts: ss, fuel: ff } = buildSeed();
      setShifts(ss);
      setFuel(ff);
      setSeeded(true);
    }
  }, [eL, sL, fL, seeded]);

  const value = {
    employees, setEmployees,
    shifts, setShifts,
    fuel, setFuel,
    session, setSession,
    loaded: eL && sL && fL,
  };
  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>;
}

/* ============================================================
   LIVE CLOCK HOOK â€” re-renders every second
   ============================================================ */
function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

/* ============================================================
   UI PRIMITIVES
   ============================================================ */
const Card = ({ children, className = "", style }) => (
  <div
    className={`rounded-2xl border border-gray-200 bg-white ${className}`}
    style={style}
  >
    {children}
  </div>
);

const KpiTile = ({ label, value, sub, accent = false, icon: Icon, delay = 0 }) => (
  <Card
    className="p-5 bb-slide hover:border-gray-300 transition-colors"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between mb-3">
      <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-body font-medium">{label}</span>
      {Icon && (
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
          <Icon size={14} strokeWidth={2.2} />
        </div>
      )}
    </div>
    <div className={`bb-display font-semibold text-3xl md:text-4xl ${accent ? 'text-orange-600' : 'text-gray-900'}`}>
      {value}
    </div>
    {sub && <div className="text-xs text-gray-500 mt-1.5 bb-body">{sub}</div>}
  </Card>
);

const Pill = ({ children, tone = 'default' }) => {
  const tones = {
    default: 'bg-gray-100 text-gray-600 border-gray-300',
    live:    'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber:   'bg-orange-50 text-orange-700 border-orange-300',
    red:     'bg-red-600/10 text-red-700 border-red-400/20',
    muted:   'bg-gray-50 text-gray-500 border-gray-200',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] bb-body font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
};

// Number plate badge â€” black on bright yellow, monospace
const PlateBadge = ({ plate, size = 'md' }) => {
  if (!plate) return <span className="text-[11px] text-gray-400 italic">no plate</span>;
  const sizeCls = size === 'sm'
    ? 'px-1.5 py-0.5 text-[10px] tracking-[0.1em]'
    : 'px-2 py-0.5 text-xs tracking-[0.12em]';
  return (
    <span className={`inline-flex items-center rounded border-2 border-black bg-yellow-300 text-black bb-mono font-bold uppercase shadow-sm ${sizeCls}`}>
      {plate}
    </span>
  );
};

// Worker-type badge with subtle colour code per type
const WorkerTypeBadge = ({ type }) => {
  const t = type || 'driver';
  const config = {
    driver:        { label: 'Driver',        cls: 'bg-orange-50 text-orange-700 border-orange-200' },
    subcontractor: { label: 'Subcontractor', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  };
  const c = config[t] || config.driver;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] bb-body font-semibold uppercase tracking-wider ${c.cls}`}>
      {c.label}
    </span>
  );
};

const LiveDot = ({ tone = 'emerald' }) => {
  const bg = tone === 'amber' ? 'bg-orange-600' : tone === 'red' ? 'bg-red-600' : 'bg-emerald-600';
  return (
    <span className="relative inline-flex w-2 h-2">
      <span className={`absolute inset-0 rounded-full bb-live-dot ${bg}`} />
      <span className={`relative rounded-full w-2 h-2 ${bg}`} />
    </span>
  );
};

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  const variants = {
    primary: 'bg-orange-600 text-white hover:bg-orange-500',
    ghost:   'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    border:  'border border-gray-300 text-gray-900 hover:border-orange-400 hover:text-orange-700',
    danger:  'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
    success: 'bg-emerald-600 text-white hover:bg-emerald-600',
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bb-body font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

/* ============================================================
   LOGIN SCREEN
   ============================================================ */
function LoginScreen() {
  const { employees, setSession } = useData();
  const [role, setRole] = useState('admin');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');

  const submit = (e) => {
    e?.preventDefault();
    setError('');
    const input = name.trim().toLowerCase();
    let target;
    if (role === 'admin') {
      target = employees.find(emp =>
        emp.role === 'admin' && emp.active && (
          emp.name.toLowerCase() === input ||
          emp.name.toLowerCase().split(' ')[0] === input
        )
      );
    } else {
      target = employees.find(emp =>
        emp.role === 'driver' && emp.active &&
        emp.name.toLowerCase().split(' ')[0] === input
      );
    }
    if (!target) {
      setError(role === 'admin' ? 'Admin not found. Try "admin".' : 'Driver not found. Try first name only.');
      return;
    }
    if (target.pin !== pin) {
      setError('Incorrect PIN.');
      return;
    }
    setSession({ userId: target.id, role });
  };

  const driverList = employees.filter(e => e.role === 'driver').map(e => e.name.split(' ')[0]).join(', ');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col bb-body relative overflow-hidden">
      <style>{GLOBAL_STYLES}</style>
      <div className="absolute inset-0 bb-grid-bg opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bb-radial-glow pointer-events-none" />

      {/* Top brand strip */}
      <header className="relative z-10 px-6 md:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-orange-600">
          <BlackbirdLogo size={28} />
          <div className="leading-none">
            <div className="bb-display text-base font-semibold tracking-tight text-gray-900">Blackbird</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-gray-500">Logistics</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bb-mono">
          <LiveDot />
          <span>SYSTEM ONLINE</span>
        </div>
      </header>

      {/* Login card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 pb-10">
        <div className="w-full max-w-md bb-slide">
          <div className="text-center mb-8">
            <div className="text-[10px] uppercase tracking-[0.3em] text-orange-600 bb-mono mb-3">Operations Console</div>
            <h1 className="bb-display text-4xl md:text-5xl font-semibold leading-tight">
              Welcome to <span className="text-orange-600">the fleet.</span>
            </h1>
            <p className="text-sm text-gray-500 mt-3 max-w-sm mx-auto">
              Sign in to view live hours, fuel, and crew activity.
            </p>
          </div>

          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-gray-100 border border-gray-200 rounded-xl mb-5">
            {['admin', 'driver'].map(r => (
              <button
                key={r}
                onClick={() => { setRole(r); setName(''); setPin(''); setError(''); }}
                className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  role === r
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
                }`}
              >
                {r === 'admin' ? 'Admin' : 'Driver'}
              </button>
            ))}
          </div>

          <div className="space-y-3" onKeyDown={e => { if (e.key === 'Enter') submit(); }}>
            <div>
              <label className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">
                {role === 'admin' ? 'Username' : 'First Name'}
              </label>
              <input
                className="bb-input w-full mt-1.5 px-4 py-3 rounded-lg bb-body"
                placeholder={role === 'admin' ? 'admin' : 'e.g. john'}
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">PIN</label>
              <div className="relative mt-1.5">
                <input
                  className="bb-input w-full px-4 py-3 pr-11 rounded-lg bb-mono tracking-[0.4em]"
                  placeholder="0000"
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  inputMode="numeric"
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600"
                >
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button
              type="button"
              onClick={() => submit()}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bb-body font-semibold transition-colors px-6 py-3 text-base bg-orange-600 text-white hover:bg-orange-500"
            >
              Sign In <ArrowRight size={16} />
            </button>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 rounded-xl border border-dashed border-gray-300 bg-gray-100">
            <div className="text-[10px] uppercase tracking-[0.18em] text-orange-600 bb-mono mb-2">Demo Credentials</div>
            <div className="text-xs text-gray-600 space-y-1.5 bb-mono">
              <div>Admin â†’ <span className="text-gray-900">admin</span> / <span className="text-gray-900">0000</span></div>
              <div>Driver â†’ first name (e.g. <span className="text-gray-900">john</span>) / <span className="text-gray-900">0000</span></div>
              <div className="text-gray-500 text-[10px] mt-2">Drivers: {driverList}</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-6 md:px-10 py-5 flex items-center justify-between text-[11px] text-gray-400 bb-mono">
        <span>Â© Blackbird Logistics</span>
        <span>v0.1 Â· Prototype</span>
      </footer>
    </div>
  );
}

/* ============================================================
   ADMIN APP
   ============================================================ */
function AdminApp() {
  const { setSession } = useData();
  const [view, setView] = useState('overview');
  const now = useNow(1000);

  const nav = [
    { id: 'overview',  label: 'Overview',  icon: Activity },
    { id: 'team',      label: 'Team',      icon: Users },
    { id: 'drivers',   label: 'Workers',   icon: UserCog },
    { id: 'hours',     label: 'Hours',     icon: Clock },
    { id: 'fuel',      label: 'Fuel',      icon: Fuel },
    { id: 'reports',   label: 'Reports',   icon: BarChart3 },
  ];

  const { start, end } = getWeekRange();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 bb-body">
      <style>{GLOBAL_STYLES}</style>

      {/* Top bar with brand + status */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="px-4 md:px-8 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-orange-600 shrink-0">
            <BlackbirdLogo size={22} />
            <div className="leading-none">
              <div className="bb-display text-sm font-semibold text-gray-900">Blackbird</div>
              <div className="text-[9px] uppercase tracking-[0.22em] text-gray-500">Operations</div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs min-w-0 flex-1 justify-center">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={13} className="text-orange-600 shrink-0" />
              <span className="bb-mono truncate">
                <span className="text-gray-900">{fmtDate(start)} â†’ {fmtDate(end)}</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-gray-600">
              <LiveDot />
              <span className="bb-mono">{fmtTime(now)}</span>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={() => setSession(null)} className="shrink-0">
            <LogOut size={14} /> <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>

        {/* Horizontal tab nav â€” works on every viewport, scrolls horizontally if narrow */}
        <nav className="border-t border-gray-100 overflow-x-auto bb-scrollbar">
          <div className="flex items-center gap-0.5 px-2 md:px-6 min-w-max">
            {nav.map(n => {
              const Icon = n.icon;
              const active = view === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setView(n.id)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    active
                      ? 'border-orange-600 text-orange-700'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Icon size={14} strokeWidth={active ? 2.4 : 2} />
                  {n.label}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main content â€” full width, no sidebar */}
      <main className="px-4 md:px-8 py-6 md:py-8 max-w-[1500px] mx-auto w-full">
        {view === 'overview' && <OverviewView now={now} />}
        {view === 'team'     && <TeamView />}
        {view === 'drivers'  && <DriversView />}
        {view === 'hours'    && <HoursView />}
        {view === 'fuel'     && <FuelView />}
        {view === 'reports'  && <ReportsView />}
      </main>
    </div>
  );
}

/* ---------- OVERVIEW ---------- */
function OverviewView({ now }) {
  const { employees, shifts, fuel } = useData();
  const drivers = employees.filter(e => e.role === 'driver' && e.active);
  const { start, end } = getWeekRange();

  const activeShifts = shifts.filter(s => !s.endTime);
  const activeDriverIds = new Set(activeShifts.map(s => s.employeeId));
  const todayKey = dayKey(new Date());

  // Aggregate today's paid hours (drivers and subcontractors)
  const todaysShifts = shifts.filter(s => dayKey(s.startTime) === todayKey);
  let todayPaidHrs = 0, todayEarned = 0;
  todaysShifts.forEach(s => {
    const w = employees.find(e => e.id === s.employeeId);
    const r = wageForShift(s, w, now);
    todayPaidHrs += r.paidHrs;
    todayEarned += r.earned; // hourly for drivers; per-shift day rate for subcontractors
  });

  // Aggregate week using weeklyEarnings (handles all 3 worker types correctly)
  let weekPaidHrs = 0, weekEarned = 0;
  drivers.forEach(w => {
    const we = weeklyEarnings(w, shifts, start.getTime(), end.getTime(), now);
    weekPaidHrs += we.paidHrs;
    weekEarned += we.earned;
  });

  // Fuel aggregates ($ only â€” only count entries from drivers, not subcontractors)
  const driverIds = new Set(employees.filter(e => (e.workerType || 'driver') === 'driver').map(e => e.id));
  const todayFuel = fuel.filter(f => dayKey(f.date) === todayKey && driverIds.has(f.driverId));
  const weekFuel  = fuel.filter(f => f.date >= start.getTime() && f.date <= end.getTime() && driverIds.has(f.driverId));
  const todayFuelCost = todayFuel.reduce((a, f) => a + (f.cost || 0), 0);
  const weekFuelCost  = weekFuel.reduce((a, f) => a + (f.cost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4 bb-slide">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-orange-600 bb-mono mb-2">Operations / Live</div>
          <h1 className="bb-display text-3xl md:text-4xl font-semibold">Today at a glance</h1>
          <div className="text-sm text-gray-500 mt-1.5">
            {fmtDateLong(now)} Â· Week ending <span className="text-gray-900">{fmtDate(end)}</span>
          </div>
        </div>
        <Pill tone="live">
          <LiveDot /> Live Â· {activeDriverIds.size} active
        </Pill>
      </div>

      {/* KPI grid â€” focused on hours + wages */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KpiTile
          label="Working now"
          value={activeDriverIds.size}
          sub={activeDriverIds.size > 0 ? 'on shift right now' : 'no one clocked in'}
          accent={activeDriverIds.size > 0}
          icon={Activity}
          delay={0}
        />
        <KpiTile label="Total drivers" value={drivers.length} sub="active in roster" icon={Users} delay={50} />
        <KpiTile label="Hours today" value={fmtHrs(todayPaidHrs)} sub={`${todaysShifts.length} shifts Â· paid time`} icon={Clock} delay={100} />
        <KpiTile label="Hours Â· week" value={fmtHrs(weekPaidHrs)} sub="Fri â†’ Thu cycle" icon={TrendingUp} delay={150} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KpiTile label="Wages today" value={fmtMoney(todayEarned)} sub="all drivers Â· live" accent icon={TrendingUp} delay={200} />
        <KpiTile label="Wages Â· week" value={fmtMoney(weekEarned)} sub="Fri â†’ Thu cycle" accent icon={TrendingUp} delay={250} />
        <KpiTile label="Fuel today" value={fmtMoney(todayFuelCost)} sub={`${todayFuel.length} ${todayFuel.length === 1 ? 'entry' : 'entries'}`} icon={Droplet} delay={300} />
        <KpiTile label="Fuel Â· week" value={fmtMoney(weekFuelCost)} sub={`${weekFuel.length} ${weekFuel.length === 1 ? 'entry' : 'entries'}`} icon={Fuel} delay={350} />
      </div>

      <Card className="p-5 bb-slide" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Currently on shift</div>
            <h3 className="bb-display text-lg font-semibold mt-0.5">Live crew & earnings</h3>
          </div>
          <LiveDot />
        </div>
        {activeShifts.length === 0 ? (
          <div className="text-sm text-gray-500 py-10 text-center">
            <Radio size={28} className="mx-auto mb-2 opacity-40" />
            No drivers currently on shift.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {activeShifts.map(s => {
              const drv = employees.find(e => e.id === s.employeeId);
              if (!drv) return null;
              const w = wageForShift(s, drv, now);
              const wt = drv.workerType || 'driver';
              const earningsLine = wt === 'subcontractor'
                ? <><div className="bb-mono text-sm text-purple-700 font-semibold">{fmtMoney(drv.dayRate ?? 0)}</div><div className="text-[10px] text-gray-500 bb-mono">on shift Â· day rate</div></>
                : <><div className="bb-mono text-sm text-emerald-700 font-semibold">{fmtMoney(w.earned)}</div><div className="text-[10px] text-gray-500 bb-mono">{w.paidHrs.toFixed(2)}h paid</div></>;
              return (
                <div key={s.id} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center bb-display font-semibold">
                      {drv.name[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-900 truncate">{drv.name}</span>
                        <WorkerTypeBadge type={drv.workerType} />
                        {wt === 'driver' && <PlateBadge plate={s.location} />}
                      </div>
                      <div className="text-[11px] text-gray-500 bb-mono">
                        Started {fmtTime(s.startTime)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {earningsLine}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ---------- TEAM (employee management) ---------- */
/* ---------- TEAM (read-only roster monitoring; management lives in Drivers) ---------- */
function TeamView() {
  const { employees, shifts } = useData();
  const workers = employees.filter(e => e.role === 'driver');
  const now = useNow(1000);
  const { start, end } = getWeekRange();

  const workerStats = useMemo(() => {
    return workers.map(d => {
      const we = weeklyEarnings(d, shifts, start.getTime(), end.getTime(), now);
      const onShift = !!shifts.find(s => s.employeeId === d.id && !s.endTime);
      return { ...d, weekPaidHrs: we.paidHrs, weekEarned: we.earned, onShift };
    });
  }, [workers, shifts, now, start.getTime(), end.getTime()]);

  const onShiftCount = workerStats.filter(d => d.onShift).length;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 bb-slide flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-orange-600 bb-mono mb-2">Crew</div>
          <h1 className="bb-display text-3xl md:text-4xl font-semibold">Team roster</h1>
          <div className="text-sm text-gray-500 mt-1.5">
            {workers.length} {workers.length === 1 ? 'worker' : 'workers'} Â· {workers.filter(d => d.active).length} active Â· <span className="text-emerald-700">{onShiftCount} on shift now</span>
          </div>
        </div>
        <Pill tone="muted">Fri â†’ Thu</Pill>
      </div>

      <Card className="overflow-hidden bb-slide">
        <div className="overflow-x-auto bb-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-mono border-b border-gray-200">
                <th className="px-5 py-3 font-medium">Worker</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Hrs Â· week</th>
                <th className="px-5 py-3 font-medium text-right">Pay Â· week</th>
              </tr>
            </thead>
            <tbody>
              {workerStats.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-500">No workers yet â€” add one in Workers.</td></tr>
              )}
              {workerStats.map((d) => (
                <tr key={d.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center bb-display font-semibold text-sm">{d.name[0]}</div>
                      <div>
                        <div className="font-medium text-gray-900">{d.name}</div>
                        <div className="text-[11px] text-gray-500 bb-mono uppercase">{WT_LABEL(d.workerType).toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><WorkerTypeBadge type={d.workerType} /></td>
                  <td className="px-5 py-3.5">
                    {!d.active
                      ? <Pill tone="muted">Disabled</Pill>
                      : d.onShift
                        ? <Pill tone="live"><LiveDot /> On shift</Pill>
                        : <Pill>Off</Pill>
                    }
                  </td>
                  <td className="px-5 py-3.5 text-right bb-mono text-orange-600 font-semibold">{fmtHrs(d.weekPaidHrs)}</td>
                  <td className="px-5 py-3.5 text-right bb-mono text-emerald-700 font-semibold">{fmtMoney(d.weekEarned)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ---------- WORKERS (CRUD for drivers and subcontractors) ---------- */
function DriversView() {
  const { employees, setEmployees } = useData();
  const workers = employees.filter(e => e.role === 'driver');
  const [showAdd, setShowAdd] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // New-worker form state
  const [newType, setNewType] = useState('driver');
  const [newName, setNewName] = useState('');
  const [newBase, setNewBase] = useState('33.09');
  const [newOt,   setNewOt]   = useState('49.64');
  const [newDt,   setNewDt]   = useState('66.18');
  const [newDay,  setNewDay]  = useState('480.00');

  const resetForm = () => {
    setNewType('driver'); setNewName('');
    setNewBase('33.09'); setNewOt('49.64'); setNewDt('66.18');
    setNewDay('480.00');
  };

  const addWorker = () => {
    if (!newName.trim()) return;
    const base = {
      id: 'wk-' + uid(),
      name: newName.trim(),
      role: 'driver',
      workerType: newType,
      pin: '0000',
      active: true,
      createdAt: Date.now(),
    };
    let extra = {};
    if (newType === 'driver') {
      extra = {
        baseRate: parseFloat(newBase) || 33.09,
        otRate:   parseFloat(newOt)   || 49.64,
        dtRate:   parseFloat(newDt)   || 66.18,
      };
    } else if (newType === 'subcontractor') {
      extra = { dayRate: parseFloat(newDay) || 0 };
    }
    setEmployees(prev => [...prev, { ...base, ...extra }]);
    resetForm();
    setShowAdd(false);
  };

  const toggleActive = (id) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, active: !e.active } : e));
  };
  const deleteWorker = (id) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    setConfirmDeleteId(null);
  };
  const updateWorker = (id, patch) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));
  };

  const editingWorker = employees.find(e => e.id === editingId);

  const filtered = filterType === 'all'
    ? workers
    : workers.filter(w => (w.workerType || 'driver') === filterType);

  // Type counts for the filter chips
  const counts = {
    all: workers.length,
    driver: workers.filter(w => (w.workerType || 'driver') === 'driver').length,
    subcontractor: workers.filter(w => w.workerType === 'subcontractor').length,
  };

  // Compact pay-display per row
  const payCell = (w) => {
    const t = w.workerType || 'driver';
    if (t === 'subcontractor') {
      return (
        <div className="text-right">
          <div className="bb-mono text-gray-900 font-semibold">${(w.dayRate ?? 0).toFixed(2)}<span className="text-gray-400 text-[10px] font-normal">/day</span></div>
          <div className="text-[10px] text-gray-500">flat per shift</div>
        </div>
      );
    }
    // Driver
    return (
      <div className="text-right">
        <div className="bb-mono text-gray-900 font-semibold">${(w.baseRate ?? 33.09).toFixed(2)}<span className="text-gray-400 text-[10px] font-normal">/hr</span></div>
        <div className="text-[10px] text-gray-500 bb-mono">OT ${(w.otRate ?? 49.64).toFixed(2)} Â· DT ${(w.dtRate ?? 66.18).toFixed(2)}</div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 bb-slide flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-orange-600 bb-mono mb-2">Admin</div>
          <h1 className="bb-display text-3xl md:text-4xl font-semibold">Manage workers</h1>
          <div className="text-sm text-gray-500 mt-1.5">
            {workers.length} {workers.length === 1 ? 'worker' : 'workers'} Â· drivers and subcontractors
          </div>
        </div>
        <Button onClick={() => setShowAdd(s => !s)}>
          <Plus size={15} /> {showAdd ? 'Close form' : 'Add worker'}
        </Button>
      </div>

      {/* Type filter chips */}
      <div className="flex flex-wrap gap-2 bb-slide">
        {[
          { id: 'all',           label: 'All' },
          { id: 'driver',        label: 'Drivers' },
          { id: 'subcontractor', label: 'Subcontractors' },
        ].map(c => (
          <button
            key={c.id}
            onClick={() => setFilterType(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filterType === c.id
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900'
            }`}
          >
            {c.label} <span className="opacity-70 ml-1">{counts[c.id]}</span>
          </button>
        ))}
      </div>

      {showAdd && (
        <Card className="p-5 bb-slide">
          <div className="text-[11px] uppercase tracking-[0.18em] text-orange-600 bb-mono mb-3">New worker</div>

          {/* Worker type radio cards */}
          <div className="grid sm:grid-cols-3 gap-2 mb-4">
            {WORKER_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setNewType(t.id)}
                className={`text-left p-3 rounded-lg border-2 transition-all ${
                  newType === t.id
                    ? 'border-orange-600 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="bb-display font-semibold text-sm text-gray-900">{t.label}</div>
                  {newType === t.id && <Check size={14} className="text-orange-600" />}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">{t.sub}</div>
              </button>
            ))}
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Full name</label>
            <input
              className="bb-input w-full mt-1 px-3 py-2.5 rounded-lg"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Alex Murphy"
              autoFocus
            />
          </div>

          {/* Pay fields â€” switch by type */}
          {newType === 'driver' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Base $/hr</label>
                <input className="bb-input w-full mt-1 px-3 py-2.5 rounded-lg bb-mono" type="number" step="0.01" value={newBase} onChange={e => setNewBase(e.target.value)} />
                <div className="text-[10px] text-gray-500 mt-1">first 8 paid hrs</div>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">After 8 hrs</label>
                <input className="bb-input w-full mt-1 px-3 py-2.5 rounded-lg bb-mono" type="number" step="0.01" value={newOt} onChange={e => setNewOt(e.target.value)} />
                <div className="text-[10px] text-gray-500 mt-1">overtime rate</div>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">After 10 hrs</label>
                <input className="bb-input w-full mt-1 px-3 py-2.5 rounded-lg bb-mono" type="number" step="0.01" value={newDt} onChange={e => setNewDt(e.target.value)} />
                <div className="text-[10px] text-gray-500 mt-1">double time</div>
              </div>
            </div>
          )}

          {newType === 'subcontractor' && (
            <div className="mt-4 max-w-xs">
              <label className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Day rate ($)</label>
              <input className="bb-input w-full mt-1 px-3 py-2.5 rounded-lg bb-mono" type="number" step="0.01" value={newDay} onChange={e => setNewDay(e.target.value)} />
              <div className="text-[11px] text-gray-500 mt-1">Flat amount paid per shift, regardless of hours worked.</div>
            </div>
          )}

          <div className="flex items-center justify-between mt-5 flex-wrap gap-3 pt-4 border-t border-gray-200">
            <div className="text-[11px] text-gray-500">Default PIN <span className="bb-mono text-orange-600">0000</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setShowAdd(false)}><X size={14} /> Cancel</Button>
              <Button onClick={addWorker}><Check size={14} /> Save worker</Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden bb-slide">
        <div className="overflow-x-auto bb-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-mono border-b border-gray-200">
                <th className="px-5 py-3 font-medium">Worker</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium text-right">Pay</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                  {workers.length === 0 ? 'No workers yet â€” click "Add worker" to create the first one.' : 'No workers match this filter.'}
                </td></tr>
              )}
              {filtered.map((w) => (
                <tr key={w.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center bb-display font-semibold text-sm">{w.name[0]}</div>
                      <div>
                        <div className="font-medium text-gray-900">{w.name}</div>
                        <div className="text-[11px] text-gray-500 bb-mono">PIN â€¢â€¢â€¢â€¢</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><WorkerTypeBadge type={w.workerType} /></td>
                  <td className="px-5 py-3.5">{payCell(w)}</td>
                  <td className="px-5 py-3.5">
                    {w.active ? <Pill tone="live">Active</Pill> : <Pill tone="muted">Disabled</Pill>}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {confirmDeleteId === w.id ? (
                      <div className="inline-flex items-center gap-2">
                        <span className="text-[11px] text-red-700 font-medium">Delete?</span>
                        <button
                          onClick={() => deleteWorker(w.id)}
                          className="px-2.5 py-1 rounded-md text-[11px] bg-red-600 text-white hover:bg-red-500 font-semibold"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 rounded-md text-[11px] text-gray-600 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingId(w.id)}
                          className="px-2.5 py-1.5 rounded-md text-[11px] text-orange-700 hover:bg-orange-50 bb-body font-medium inline-flex items-center gap-1.5"
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => toggleActive(w.id)}
                          className="px-2.5 py-1.5 rounded-md text-[11px] text-gray-600 hover:text-gray-900 hover:bg-gray-100 bb-body font-medium"
                        >
                          {w.active ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(w.id)}
                          className="p-1.5 rounded-md text-gray-500 hover:text-red-700 hover:bg-red-50"
                          aria-label="Delete worker"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4 bb-slide bg-gray-50 border-dashed">
        <div className="text-[11px] text-gray-600 leading-relaxed space-y-1">
          <div><strong className="text-gray-800">Drivers</strong> â€” paid hourly. First 8 hrs at base, hours 8â€“10 at the "after 8h" rate, anything past 10 at the "after 10h" rate. 30 min unpaid break is auto-deducted once a shift exceeds 6 hrs.</div>
          <div><strong className="text-gray-800">Subcontractors</strong> â€” paid a flat day rate per closed shift, regardless of hours. Don't see Fuel.</div>
        </div>
      </Card>

      {/* Edit drawer */}
      {editingWorker && (
        <EditDriverDrawer
          driver={editingWorker}
          onClose={() => setEditingId(null)}
          onSave={(patch) => { updateWorker(editingWorker.id, patch); setEditingId(null); }}
        />
      )}
    </div>
  );
}

function EditDriverDrawer({ driver, onClose, onSave }) {
  // The "driver" prop is any worker. Type can be changed here too.
  const [type, setType]   = useState(driver.workerType || 'driver');
  const [name, setName]   = useState(driver.name);
  const [baseRate, setBaseRate] = useState((driver.baseRate ?? 33.09).toString());
  const [otRate, setOtRate] = useState((driver.otRate ?? 49.64).toString());
  const [dtRate, setDtRate] = useState((driver.dtRate ?? 66.18).toString());
  const [dayRate, setDayRate] = useState((driver.dayRate ?? 480).toString());

  const save = () => {
    const patch = {
      name: name.trim() || driver.name,
      workerType: type,
    };
    if (type === 'driver') {
      patch.baseRate = parseFloat(baseRate) || driver.baseRate || 33.09;
      patch.otRate   = parseFloat(otRate)   || driver.otRate   || 49.64;
      patch.dtRate   = parseFloat(dtRate)   || driver.dtRate   || 66.18;
    } else if (type === 'subcontractor') {
      patch.dayRate = parseFloat(dayRate) || 0;
    }
    onSave(patch);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40" onClick={onClose}>
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl border border-gray-200 shadow-2xl bb-slide max-h-[90vh] overflow-y-auto bb-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center bb-display font-semibold">
              {driver.name[0]}
            </div>
            <div>
              <div className="bb-display text-lg font-semibold">{driver.name}</div>
              <div className="text-[11px] text-gray-500 bb-mono uppercase tracking-wider">Edit worker</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"><X size={16} /></button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Name</label>
            <input className="bb-input w-full mt-1 px-3 py-2.5 rounded-lg" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Worker type</label>
            <div className="grid sm:grid-cols-3 gap-2 mt-1.5">
              {WORKER_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`text-left p-2.5 rounded-lg border-2 transition-all ${
                    type === t.id
                      ? 'border-orange-600 bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="bb-display font-semibold text-xs text-gray-900">{t.label}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{t.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-orange-600 bb-mono mb-3">Pay rates</div>

            {type === 'driver' && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 bb-mono">Base $/hr</label>
                    <input className="bb-input w-full mt-1 px-3 py-2.5 rounded-lg bb-mono text-base" type="number" step="0.01" value={baseRate} onChange={e => setBaseRate(e.target.value)} />
                    <div className="text-[10px] text-gray-500 mt-1">first 8 paid hrs</div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 bb-mono">After 8 hrs</label>
                    <input className="bb-input w-full mt-1 px-3 py-2.5 rounded-lg bb-mono text-base" type="number" step="0.01" value={otRate} onChange={e => setOtRate(e.target.value)} />
                    <div className="text-[10px] text-gray-500 mt-1">overtime</div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 bb-mono">After 10 hrs</label>
                    <input className="bb-input w-full mt-1 px-3 py-2.5 rounded-lg bb-mono text-base" type="number" step="0.01" value={dtRate} onChange={e => setDtRate(e.target.value)} />
                    <div className="text-[10px] text-gray-500 mt-1">double time</div>
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 mt-3 leading-relaxed">
                  30 min unpaid break is auto-applied once a shift exceeds 6 hours of work. So a 10-hour shift pays for 9.5 hours.
                </div>
              </>
            )}

            {type === 'subcontractor' && (
              <div className="max-w-xs">
                <label className="text-[10px] uppercase tracking-wider text-gray-500 bb-mono">Day rate ($)</label>
                <input className="bb-input w-full mt-1 px-3 py-2.5 rounded-lg bb-mono text-base" type="number" step="0.01" value={dayRate} onChange={e => setDayRate(e.target.value)} />
                <div className="text-[11px] text-gray-500 mt-1">Flat amount paid per shift, regardless of hours.</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl sm:rounded-b-2xl sticky bottom-0">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save}><Check size={14} /> Save changes</Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- HOURS ---------- */
function HoursView() {
  const { employees, shifts, setShifts } = useData();
  const now = useNow(1000);
  const { start, end } = getWeekRange();
  const drivers = employees.filter(e => e.role === 'driver');
  const [filterId, setFilterId] = useState('all');

  const visible = shifts
    .filter(s => filterId === 'all' || s.employeeId === filterId)
    .filter(s => s.startTime >= start.getTime() && s.startTime <= end.getTime())
    .sort((a, b) => b.startTime - a.startTime);

  let totalPaidHrs = 0, totalEarned = 0;
  visible.forEach(s => {
    const drv = employees.find(e => e.id === s.employeeId);
    const w = wageForShift(s, drv, now);
    totalPaidHrs += w.paidHrs;
    totalEarned += w.earned;
  });

  const removeShift = (id) => {
    setShifts(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap bb-slide">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-orange-600 bb-mono mb-2">Time</div>
          <h1 className="bb-display text-3xl md:text-4xl font-semibold">Hours Â· this week</h1>
          <div className="text-sm text-gray-500 mt-1.5">
            {fmtDate(start)} â†’ {fmtDate(end)} Â· {visible.length} shifts Â·{' '}
            <span className="text-orange-600 bb-mono">{fmtHrs(totalPaidHrs)}</span> paid Â·{' '}
            <span className="text-emerald-700 bb-mono">{fmtMoney(totalEarned)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="bb-input rounded-lg px-3 py-2 text-sm" value={filterId} onChange={e => setFilterId(e.target.value)}>
            <option value="all">All drivers</option>
            {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <Button variant="border" size="sm"><Download size={13} /> CSV</Button>
        </div>
      </div>

      <Card className="overflow-hidden bb-slide">
        <div className="overflow-x-auto bb-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-mono border-b border-gray-200">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Driver</th>
                <th className="px-5 py-3 font-medium">Plate</th>
                <th className="px-5 py-3 font-medium">Start</th>
                <th className="px-5 py-3 font-medium">Finish</th>
                <th className="px-5 py-3 font-medium text-right">Worked</th>
                <th className="px-5 py-3 font-medium text-right">Break</th>
                <th className="px-5 py-3 font-medium text-right">Paid hrs</th>
                <th className="px-5 py-3 font-medium text-right">Wages</th>
                <th className="px-5 py-3 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr><td colSpan={10} className="px-5 py-12 text-center text-gray-500">No shifts in this week yet.</td></tr>
              )}
              {visible.map(s => {
                const drv = employees.find(e => e.id === s.employeeId);
                const w = wageForShift(s, drv, now);
                const live = !s.endTime;
                const isSub = (drv?.workerType || 'driver') === 'subcontractor';
                return (
                  <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <div className="font-medium">{fmtDow(s.startTime)} {fmtDate(s.startTime)}</div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-800">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>{drv?.name || 'â€”'}</span>
                        {isSub && <WorkerTypeBadge type="subcontractor" />}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {isSub ? <span className="text-gray-400 text-xs">â€”</span> : <PlateBadge plate={s.location} />}
                    </td>
                    <td className="px-5 py-3.5 bb-mono">
                      {isSub ? <Pill tone="live"><Check size={11} /> Worked</Pill> : fmtTime(s.startTime)}
                    </td>
                    <td className="px-5 py-3.5 bb-mono">
                      {isSub ? <span className="text-gray-400 text-xs">â€”</span>
                        : live ? <span className="text-emerald-600 inline-flex items-center gap-1.5"><LiveDot /> live</span>
                        : fmtTime(s.endTime)}
                    </td>
                    <td className="px-5 py-3.5 text-right bb-mono text-gray-700">
                      {isSub ? <span className="text-gray-400">â€”</span> : `${(w.workedMs / 3600000).toFixed(2)}h`}
                    </td>
                    <td className="px-5 py-3.5 text-right bb-mono text-gray-500">
                      {isSub ? <span className="text-gray-400">â€”</span> : (w.breakHrs > 0 ? '30m' : 'â€”')}
                    </td>
                    <td className="px-5 py-3.5 text-right bb-mono text-orange-600 font-semibold">
                      {isSub ? <span className="text-gray-400">â€”</span> : fmtHrs(w.paidHrs)}
                    </td>
                    <td className="px-5 py-3.5 text-right bb-mono text-emerald-700 font-semibold">{fmtMoney(w.earned)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => removeShift(s.id)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ---------- FUEL (admin) â€” dollars only, no litres ---------- */
function FuelView() {
  const { employees, fuel, setFuel } = useData();
  // Only drivers track fuel â€” subcontractors don't (no plates, no fuel entries)
  const drivers = employees.filter(e => e.role === 'driver' && (e.workerType || 'driver') === 'driver');
  const driverIds = new Set(drivers.map(d => d.id));
  const { start, end } = getWeekRange();

  // Defensively filter out any fuel entries from non-driver workers
  const weekFuel = fuel
    .filter(f => f.date >= start.getTime() && f.date <= end.getTime())
    .filter(f => driverIds.has(f.driverId))
    .sort((a, b) => b.date - a.date);

  const totalCost = weekFuel.reduce((a, f) => a + (f.cost || 0), 0);

  // By-driver $ for pie chart
  const byDriver = drivers.map(d => {
    const sum = weekFuel.filter(f => f.driverId === d.id).reduce((a, f) => a + (f.cost || 0), 0);
    return { name: d.name.split(' ')[0], value: +sum.toFixed(2), id: d.id };
  }).filter(d => d.value > 0);

  const colors = ['#ea580c', '#059669', '#2563eb', '#db2777', '#7c3aed', '#dc2626'];

  // Days with no entries this week (only for days up to "today")
  const daysWithEntries = new Set(weekFuel.map(f => dayKey(f.date)));
  const noEntryDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (d > new Date()) continue;
    if (!daysWithEntries.has(dayKey(d))) noEntryDays.push(fmtDateLong(d));
  }

  const cardInvalidCount = weekFuel.filter(f => f.cardInvalid).length;

  const remove = (id) => {
    setFuel(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap bb-slide">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-orange-600 bb-mono mb-2">Fuel</div>
          <h1 className="bb-display text-3xl md:text-4xl font-semibold">Fuel Â· this week</h1>
          <div className="text-sm text-gray-500 mt-1.5">
            {weekFuel.length} {weekFuel.length === 1 ? 'entry' : 'entries'} Â·{' '}
            <span className="bb-mono text-emerald-700 font-semibold">{fmtMoney(totalCost)}</span> total spend
            {cardInvalidCount > 0 && (
              <> Â· <span className="bb-mono text-red-700 font-semibold">{cardInvalidCount}</span> card {cardInvalidCount === 1 ? 'issue' : 'issues'}</>
            )}
          </div>
        </div>
        <Button variant="border" size="sm"><Download size={13} /> CSV</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 bb-slide">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Driver split</div>
              <h3 className="bb-display text-lg font-semibold mt-0.5">Spend by driver Â· this week</h3>
            </div>
            <Pill tone="muted">Fri â†’ Thu</Pill>
          </div>
          {byDriver.length === 0 ? (
            <div className="text-sm text-gray-500 py-8 text-center">No fuel entries yet.</div>
          ) : (
            <div className="space-y-2.5">
              {byDriver
                .sort((a, b) => b.value - a.value)
                .map(d => {
                  const fullDrv = drivers.find(x => x.id === d.id);
                  const pct = totalCost > 0 ? (d.value / totalCost) * 100 : 0;
                  // How many distinct plates this driver used this week
                  const plates = Array.from(new Set(
                    weekFuel
                      .filter(f => f.driverId === d.id && f.truck)
                      .map(f => f.truck)
                  ));
                  return (
                    <div key={d.id} className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 shrink-0 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center bb-display font-semibold text-sm">
                            {fullDrv?.name?.[0] || d.name[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{fullDrv?.name || d.name}</div>
                            <div className="text-[10px] text-gray-500 bb-mono">
                              {plates.length === 0 ? 'no plate' : `${plates.length} ${plates.length === 1 ? 'plate' : 'plates'} this week`}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="bb-mono text-sm text-emerald-700 font-semibold">{fmtMoney(d.value)}</div>
                          <div className="text-[10px] text-gray-500 bb-mono">{pct.toFixed(0)}% of week</div>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full bg-orange-600 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </Card>

        <Card className="p-5 bb-slide" style={{ animationDelay: '50ms' }}>
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-mono">No-fuel days</div>
          <h3 className="bb-display text-lg font-semibold mt-0.5 mb-3">Gaps this week</h3>
          {noEntryDays.length === 0 ? (
            <div className="text-sm text-gray-500 py-4">All days have entries âœ“</div>
          ) : (
            <div className="space-y-2">
              {noEntryDays.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-orange-50 border border-orange-200 text-orange-800">
                  <AlertCircle size={12} /> {d}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="overflow-hidden bb-slide">
        <div className="overflow-x-auto bb-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-mono border-b border-gray-200">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Driver</th>
                <th className="px-5 py-3 font-medium">Plate</th>
                <th className="px-5 py-3 font-medium text-right">Spend</th>
                <th className="px-5 py-3 font-medium">Note</th>
                <th className="px-5 py-3 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody>
              {weekFuel.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">No fuel entries this week yet.</td></tr>
              )}
              {weekFuel.map(f => {
                const drv = employees.find(e => e.id === f.driverId);
                return (
                  <tr key={f.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-5 py-3.5 font-medium">{fmtDow(f.date)} {fmtDate(f.date)}</td>
                    <td className="px-5 py-3.5 text-gray-800">{drv?.name || 'â€”'}</td>
                    <td className="px-5 py-3.5"><PlateBadge plate={f.truck} size="sm" /></td>
                    <td className="px-5 py-3.5 text-right bb-mono">
                      {f.cardInvalid
                        ? <Pill tone="red"><AlertCircle size={11} /> Card invalid</Pill>
                        : f.noFuel
                          ? <Pill tone="muted">No fuel</Pill>
                          : <span className="text-emerald-700 font-semibold">{fmtMoney(f.cost || 0)}</span>}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{f.notes || 'â€”'}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => remove(f.id)} className="p-1.5 rounded-md text-gray-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ---------- REPORTS ---------- */
function ReportsView() {
  const { employees, shifts, fuel } = useData();
  const drivers = employees.filter(e => e.role === 'driver');
  const now = useNow(60000);

  // weekOffset: 0 = current week, -1 = last week, -2 = two weeks ago, etc.
  const [weekOffset, setWeekOffset] = useState(0);

  // Compute the displayed week's range
  const { start, end, isCurrent } = useMemo(() => {
    const ref = new Date();
    ref.setDate(ref.getDate() + weekOffset * 7);
    const r = getWeekRange(ref);
    return { ...r, isCurrent: weekOffset === 0 };
  }, [weekOffset]);

  // Per-worker pay for the selected week (handles all 3 worker types)
  const perDriver = useMemo(() => drivers.map(d => {
    const we = weeklyEarnings(d, shifts, start.getTime(), end.getTime(), now);
    return {
      ...d,
      shifts: we.shiftCount,
      paidHrs: +we.paidHrs.toFixed(2),
      earned: +we.earned.toFixed(2),
      payBasis: we.payBasis,
    };
  }), [drivers, shifts, now, start.getTime(), end.getTime()]);

  // Week summary
  const weekTotals = useMemo(() => {
    const driverIds = new Set(employees.filter(e => (e.workerType || 'driver') === 'driver').map(e => e.id));
    const fuelEntries = fuel.filter(f =>
      f.date >= start.getTime() && f.date <= end.getTime() && driverIds.has(f.driverId)
    );
    const fuelSpend = fuelEntries.reduce((a, f) => a + (f.cost || 0), 0);
    const cardIssues = fuelEntries.filter(f => f.cardInvalid).length;
    const totalHrs = perDriver.reduce((a, d) => a + d.paidHrs, 0);
    const totalWages = perDriver.reduce((a, d) => a + d.earned, 0);
    return { fuelSpend, cardIssues, totalHrs, totalWages };
  }, [fuel, perDriver, employees, start.getTime(), end.getTime()]);

  // Pretty week label
  const weekLabel = isCurrent
    ? 'This week'
    : weekOffset === -1
      ? 'Last week'
      : `${Math.abs(weekOffset)} weeks ago`;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 bb-slide flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-orange-600 bb-mono mb-2">Reports</div>
          <h1 className="bb-display text-3xl md:text-4xl font-semibold">Payroll summary</h1>
          <div className="text-sm text-gray-500 mt-1.5">Friday â†’ Thursday cycle Â· 30-min unpaid break after 6 hrs Â· OT after 8h, DT after 10h</div>
        </div>
        <div className="flex gap-2">
          <Button variant="border" size="sm"><Download size={13} /> CSV</Button>
          <Button variant="border" size="sm"><FileText size={13} /> PDF</Button>
        </div>
      </div>

      {/* Week selector */}
      <Card className="p-4 bb-slide flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setWeekOffset(o => o - 1)}
            className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:border-orange-400 hover:text-orange-600 transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setWeekOffset(o => Math.min(0, o + 1))}
            disabled={isCurrent}
            className={`p-2 rounded-lg border transition-colors ${
              isCurrent
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-200 text-gray-700 hover:border-orange-400 hover:text-orange-600'
            }`}
            aria-label="Next week"
          >
            <ChevronRight size={16} />
          </button>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-gray-500 bb-mono">{weekLabel}</div>
            <div className="bb-display text-base font-semibold mt-0.5">
              {fmtDateLong(start)} â†’ {fmtDateLong(end)}
            </div>
          </div>
        </div>
        {!isCurrent && (
          <Button variant="border" size="sm" onClick={() => setWeekOffset(0)}>
            Jump to this week
          </Button>
        )}
        {isCurrent && <Pill tone="live"><LiveDot /> Live</Pill>}
      </Card>

      {/* Week-totals strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KpiTile label="Total hours" value={fmtHrs(weekTotals.totalHrs)} sub={`${perDriver.reduce((a, d) => a + d.shifts, 0)} shifts`} icon={Clock} delay={0} />
        <KpiTile label="Total wages" value={fmtMoney(weekTotals.totalWages)} sub="all drivers" accent icon={TrendingUp} delay={50} />
        <KpiTile label="Fuel spend" value={fmtMoney(weekTotals.fuelSpend)} sub="this week" icon={Fuel} delay={100} />
        <KpiTile label="Card issues" value={weekTotals.cardIssues} sub={weekTotals.cardIssues === 1 ? 'invalid card' : 'invalid cards'} icon={AlertCircle} delay={150} />
      </div>

      {/* Payroll summary table */}
      <Card className="p-5 bb-slide" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Per worker</div>
            <h3 className="bb-display text-lg font-semibold mt-0.5">Pay breakdown</h3>
          </div>
          <Pill tone="muted">{fmtDate(start)} â†’ {fmtDate(end)}</Pill>
        </div>
        <div className="overflow-x-auto bb-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-mono border-b border-gray-200">
                <th className="py-3 font-medium">Worker</th>
                <th className="py-3 font-medium">Type</th>
                <th className="py-3 font-medium text-right">Shifts</th>
                <th className="py-3 font-medium text-right">Pay basis</th>
                <th className="py-3 font-medium text-right">Hrs</th>
                <th className="py-3 font-medium text-right">Pay</th>
              </tr>
            </thead>
            <tbody>
              {perDriver.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-gray-500">No workers in roster yet.</td></tr>
              )}
              {perDriver.map(d => {
                const t = d.workerType || 'driver';
                const basis = t === 'subcontractor'
                  ? `$${(d.dayRate ?? 0).toFixed(2)}/day`
                  : `$${(d.baseRate ?? 33.09).toFixed(2)}/hr`;
                return (
                  <tr key={d.id} className="border-b border-gray-200">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center bb-display font-semibold text-xs">{d.name[0]}</div>
                        <div className="font-medium">{d.name}</div>
                      </div>
                    </td>
                    <td className="py-3"><WorkerTypeBadge type={t} /></td>
                    <td className="py-3 text-right bb-mono text-gray-600">{d.shifts}</td>
                    <td className="py-3 text-right bb-mono text-gray-700">{basis}</td>
                    <td className="py-3 text-right bb-mono text-orange-600 font-semibold">{fmtHrs(d.paidHrs)}</td>
                    <td className="py-3 text-right bb-mono text-emerald-700 font-semibold">{fmtMoney(d.earned)}</td>
                  </tr>
                );
              })}
              {perDriver.length > 0 && (() => {
                const totals = perDriver.reduce((a, d) => ({
                  shifts: a.shifts + d.shifts,
                  paidHrs: a.paidHrs + d.paidHrs,
                  earned: a.earned + d.earned,
                }), { shifts: 0, paidHrs: 0, earned: 0 });
                return (
                  <tr className="bg-gray-50 font-semibold">
                    <td className="py-3 px-0 text-gray-900">Totals</td>
                    <td className="py-3"></td>
                    <td className="py-3 text-right bb-mono text-gray-700">{totals.shifts}</td>
                    <td className="py-3"></td>
                    <td className="py-3 text-right bb-mono text-orange-700">{fmtHrs(totals.paidHrs)}</td>
                    <td className="py-3 text-right bb-mono text-emerald-700">{fmtMoney(totals.earned)}</td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   DRIVER APP (mobile-first)
   ============================================================ */
function DriverApp() {
  const { session, setSession, employees, setEmployees, shifts, setShifts } = useData();
  const me = employees.find(e => e.id === session.userId);
  const [tab, setTab] = useState('home');
  const now = useNow(1000);

  if (!me) return null;

  const myShifts = shifts.filter(s => s.employeeId === me.id);
  const activeShift = myShifts.find(s => !s.endTime);
  const { start, end } = getWeekRange();

  const todayKey = dayKey(new Date());
  const todayMs = myShifts
    .filter(s => dayKey(s.startTime) === todayKey)
    .reduce((a, s) => a + Math.max(0, (s.endTime || now) - s.startTime - (s.breakMinutes || 0) * 60000), 0);
  const weekMs = myShifts
    .filter(s => s.startTime >= start.getTime() && s.startTime <= end.getTime())
    .reduce((a, s) => a + Math.max(0, (s.endTime || now) - s.startTime - (s.breakMinutes || 0) * 60000), 0);

  const startWork = (plate) => {
    const cleanPlate = (plate || '').trim().toUpperCase();
    if (!cleanPlate) return;
    setShifts(prev => [...prev, {
      id: uid(),
      employeeId: me.id,
      startTime: Date.now(),
      endTime: null,
      breakMinutes: 0,
      location: cleanPlate,
      notes: '',
      editedAt: null,
    }]);
  };
  const stopWork = () => {
    setShifts(prev => prev.map(s => s.id === activeShift.id ? { ...s, endTime: Date.now() } : s));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 bb-body pb-24">
      <style>{GLOBAL_STYLES}</style>

      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-gray-200">
        <div className="px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BlackbirdLogo size={20} />
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Driver</div>
              <div className="text-sm font-semibold">{me.name}</div>
            </div>
          </div>
          <button onClick={() => setSession(null)} className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="px-5 py-6 max-w-md mx-auto">
        {tab === 'home' && (
          (me.workerType || 'driver') === 'subcontractor'
            ? <SubcontractorHome me={me} now={now} />
            : <DriverHome me={me} now={now} activeShift={activeShift} todayMs={todayMs} weekMs={weekMs} startWork={startWork} stopWork={stopWork} />
        )}
        {tab === 'history' && <DriverHistory me={me} now={now} />}
        {tab === 'fuel'    && <DriverFuel me={me} />}
        {tab === 'profile' && <DriverProfile me={me} />}
      </main>

      {/* Bottom tab bar (mobile-style, stays on desktop too) */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200">
        {(() => {
          const showFuel = (me.workerType || 'driver') === 'driver';
          const tabs = [
            { id: 'home',    label: 'Home',    icon: Home },
            { id: 'history', label: 'History', icon: History },
            ...(showFuel ? [{ id: 'fuel', label: 'Fuel', icon: Fuel }] : []),
            { id: 'profile', label: 'Profile', icon: CircleUser },
          ];
          return (
            <div className={`max-w-md mx-auto grid ${tabs.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
              {tabs.map(t => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`py-3 flex flex-col items-center gap-1 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                      active ? 'text-orange-600' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={18} strokeWidth={active ? 2.4 : 2} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          );
        })()}
      </nav>
    </div>
  );
}

/* ---------- Subcontractor home â€” single "work today" toggle, resets each day ---------- */
function SubcontractorHome({ me, now }) {
  const { shifts, setShifts } = useData();
  const todayK = dayKey(new Date());

  // Find today's shift if any. Subcontractor "shifts" are zero-duration day markers.
  const todaysShift = shifts.find(s => s.employeeId === me.id && dayKey(s.startTime) === todayK);
  const workedToday = !!todaysShift;

  // This-week stats
  const { start, end } = getWeekRange();
  const weekShifts = shifts.filter(s =>
    s.employeeId === me.id && s.startTime >= start.getTime() && s.startTime <= end.getTime()
  );
  const weekDays = weekShifts.length;
  const weekEarned = weekDays * (me.dayRate ?? 0);

  const markWorked = () => {
    // Mark today as worked: zero-duration shift at noon, no plate, no breaks
    const t = new Date(); t.setHours(12, 0, 0, 0);
    setShifts(prev => [...prev, {
      id: uid(),
      employeeId: me.id,
      startTime: t.getTime(),
      endTime: t.getTime(), // closed immediately = paid
      breakMinutes: 0,
      location: '',
      notes: '',
      isDayMark: true,
      editedAt: null,
    }]);
  };

  const undoToday = () => {
    if (!todaysShift) return;
    setShifts(prev => prev.filter(s => s.id !== todaysShift.id));
  };

  return (
    <div className="space-y-6">
      <div className="bb-slide">
        <div className="text-[10px] uppercase tracking-[0.22em] text-orange-600 bb-mono mb-2 flex items-center gap-2">
          {fmtDateLong(now)}
          <WorkerTypeBadge type="subcontractor" />
        </div>
        <h1 className="bb-display text-3xl font-semibold leading-tight">
          {workedToday
            ? <>Today is <span className="text-emerald-600">marked.</span></>
            : <>Did you work <span className="text-orange-600">today?</span></>
          }
        </h1>
        <div className="text-sm text-gray-500 mt-1.5">
          {workedToday
            ? <>You'll be paid your day rate for {fmtDateLong(now)}.</>
            : <>Tap the button below if you worked today. Resets at midnight.</>
          }
        </div>
      </div>

      {/* Hero "Worked today" card */}
      <Card className={`p-6 relative overflow-hidden bb-slide ${workedToday ? 'border-emerald-200' : ''}`} style={{ animationDelay: '50ms' }}>
        {workedToday && <div className="absolute inset-0 bb-shimmer opacity-30 pointer-events-none" />}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-mono">
              {workedToday ? 'Today' : 'Daily check-in'}
            </div>
            {workedToday && <Pill tone="live"><Check size={11} /> Worked</Pill>}
          </div>

          {/* Big status display */}
          <div className="bb-display text-3xl md:text-4xl font-semibold leading-none">
            {workedToday
              ? <span className="text-emerald-600">{fmtMoney(me.dayRate ?? 0)}</span>
              : <span className="text-gray-300">{fmtMoney(me.dayRate ?? 0)}</span>
            }
          </div>
          <div className="text-xs text-gray-500 mt-1.5 bb-mono">
            day rate Â· {workedToday ? 'earned today' : 'tap below to claim'}
          </div>

          <div className="mt-6">
            {workedToday ? (
              <button
                onClick={undoToday}
                className="w-full py-5 rounded-xl bg-white border-2 border-gray-300 text-gray-700 text-base font-semibold hover:border-red-300 hover:text-red-700 transition-colors flex items-center justify-center gap-2 bb-display tracking-tight"
              >
                <X size={18} /> Undo Â· I didn't work today
              </button>
            ) : (
              <button
                onClick={markWorked}
                className="w-full py-5 rounded-xl bg-orange-600 text-white text-base font-semibold hover:bg-orange-500 transition-colors flex items-center justify-center gap-2 bb-display tracking-tight shadow-md"
              >
                <Check size={18} /> Work today
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Weekly stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bb-slide" style={{ animationDelay: '100ms' }}>
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Week Â· days</div>
          <div className="bb-display text-2xl font-semibold mt-1.5">{weekDays}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">{weekDays === 1 ? 'day' : 'days'} marked</div>
        </Card>
        <Card className="p-4 bb-slide" style={{ animationDelay: '150ms' }}>
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Week Â· earned</div>
          <div className="bb-display text-2xl font-semibold text-emerald-700 mt-1.5">{fmtMoney(weekEarned)}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Fri â†’ Thu</div>
        </Card>
      </div>
    </div>
  );
}


function DriverHome({ me, now, activeShift, todayMs, weekMs, startWork, stopWork }) {
  const live = !!activeShift;
  const elapsed = activeShift ? now - activeShift.startTime : 0;
  const wt = me.workerType || 'driver';
  const needsPlate = wt === 'driver';
  // Plates are different every day â€” start blank, driver enters today's plate fresh each shift
  const [plate, setPlate] = useState('');
  const trimmedPlate = plate.trim();
  // Drivers must enter a plate; subcontractors can start without one
  const canStart = needsPlate ? trimmedPlate.length > 0 : true;

  const handleStart = () => {
    if (!canStart) return;
    startWork(needsPlate ? trimmedPlate : '');
  };

  return (
    <div className="space-y-6">
      <div className="bb-slide">
        <div className="text-[10px] uppercase tracking-[0.22em] text-orange-600 bb-mono mb-2 flex items-center gap-2">
          {fmtDateLong(now)}
          <WorkerTypeBadge type={wt} />
        </div>
        <h1 className="bb-display text-3xl font-semibold leading-tight">
          {live ? <>You're <span className="text-emerald-600">on shift.</span></> : <>Ready when <span className="text-orange-600">you are.</span></>}
        </h1>
        <div className="text-sm text-gray-500 mt-1.5">
          {live
            ? needsPlate
              ? <>Driving truck <span className="bb-mono text-gray-900 font-semibold">{activeShift.location || 'â€”'}</span> Â· {fmtTime(now)}</>
              : <>Started at {fmtTime(activeShift.startTime)} Â· {fmtTime(now)}</>
            : needsPlate
              ? <>{fmtTime(now)} â€” confirm your truck below to start</>
              : <>{fmtTime(now)} â€” tap below to start your shift</>
          }
        </div>
      </div>

      {/* Hero start/stop */}
      <Card className={`p-6 relative overflow-hidden bb-slide ${live ? 'border-emerald-200' : ''}`} style={{ animationDelay: '50ms' }}>
        {live && <div className="absolute inset-0 bb-shimmer opacity-30 pointer-events-none" />}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-mono">
              {live ? 'Active session' : 'Current session'}
            </div>
            {live && <Pill tone="live"><LiveDot /> Working</Pill>}
          </div>
          <div className="bb-mono text-5xl md:text-6xl font-semibold tabular-nums leading-none">
            {live ? (
              <span className="text-emerald-600">{fmtDurationLong(elapsed)}</span>
            ) : (
              <span className="text-gray-300">0h 00m 00s</span>
            )}
          </div>
          {live && (
            <div className="text-xs text-gray-500 mt-2 bb-mono">
              Started at {fmtTime(activeShift.startTime)}
              {needsPlate && activeShift.location && <> Â· Truck <span className="text-gray-900 font-semibold">{activeShift.location}</span></>}
            </div>
          )}

          {/* Plate input â€” only for drivers, only when not on a shift */}
          {!live && needsPlate && (
            <div className="mt-6">
              <label className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">
                Number plate / Truck rego <span className="text-red-600">*</span>
              </label>
              <input
                className="bb-input w-full mt-1.5 px-4 py-3 rounded-lg bb-mono text-lg uppercase tracking-widest"
                placeholder="e.g. RC1"
                value={plate}
                onChange={e => setPlate(e.target.value.toUpperCase())}
                maxLength={10}
                autoCapitalize="characters"
                autoCorrect="off"
              />
              <div className="text-[11px] text-gray-500 mt-1.5">
                {canStart
                  ? <>Confirmed plate <span className="bb-mono text-gray-900">{trimmedPlate}</span> â€” tap below to start.</>
                  : 'Enter your truck plate to enable Start Working.'
                }
              </div>
            </div>
          )}

          <div className="mt-6">
            {live ? (
              <button
                onClick={stopWork}
                className="w-full py-5 rounded-xl bg-red-600 text-white text-base font-semibold hover:bg-red-500 transition-colors flex items-center justify-center gap-2 bb-display tracking-tight"
              >
                <Square size={18} fill="currentColor" /> Stop Working
              </button>
            ) : (
              <button
                onClick={handleStart}
                disabled={!canStart}
                className={`w-full py-5 rounded-xl text-base font-semibold transition-colors flex items-center justify-center gap-2 bb-display tracking-tight shadow-md ${
                  canStart
                    ? 'bg-orange-600 text-white hover:bg-orange-500'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Play size={18} fill="currentColor" /> Start Working
              </button>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bb-slide" style={{ animationDelay: '100ms' }}>
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Today</div>
          <div className="bb-display text-2xl font-semibold mt-1.5">{fmtDuration(todayMs)}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">hours worked</div>
        </Card>
        <Card className="p-4 bb-slide" style={{ animationDelay: '150ms' }}>
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Week</div>
          <div className="bb-display text-2xl font-semibold text-orange-600 mt-1.5">{fmtDuration(weekMs)}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Fri â†’ Thu</div>
        </Card>
      </div>
    </div>
  );
}

function DriverHistory({ me, now }) {
  const { shifts, setShifts } = useData();
  const myShifts = shifts.filter(s => s.employeeId === me.id).sort((a, b) => b.startTime - a.startTime);
  const [editingId, setEditingId] = useState(null);
  const isSub = (me.workerType || 'driver') === 'subcontractor';

  const editing = shifts.find(s => s.id === editingId);

  const updateShift = (id, patch) => {
    setShifts(prev => prev.map(s => s.id === id ? { ...s, ...patch, editedAt: Date.now() } : s));
  };

  const deleteShift = (id) => {
    setShifts(prev => prev.filter(s => s.id !== id));
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="bb-slide">
        <div className="text-[10px] uppercase tracking-[0.22em] text-orange-600 bb-mono mb-2">Your time</div>
        <h1 className="bb-display text-2xl font-semibold">{isSub ? 'Worked days' : 'Shift history'}</h1>
        <div className="text-sm text-gray-500 mt-1">
          {myShifts.length} {isSub ? (myShifts.length === 1 ? 'day' : 'days') : 'total shifts'}
          {!isSub && ' Â· tap a shift to edit or delete'}
          {isSub && ' Â· tap a day to remove it'}
        </div>
      </div>

      <div className="space-y-2.5">
        {myShifts.length === 0 && <Card className="p-6 text-center text-sm text-gray-500">{isSub ? 'No worked days yet.' : 'No shifts yet.'}</Card>}
        {myShifts.map(s => {
          const dur = Math.max(0, (s.endTime || now) - s.startTime - (s.breakMinutes || 0) * 60000);
          const live = !s.endTime;
          // Subcontractor day-mark rendering â€” simpler, no times or plate
          if (isSub) {
            return (
              <Card
                key={s.id}
                className="p-4 bb-slide cursor-pointer hover:border-orange-300 active:bg-gray-50 transition-colors"
                onClick={() => setEditingId(s.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">{fmtDow(s.startTime)} {fmtDate(s.startTime)}</span>
                      <Pill tone="live"><Check size={11} /> Worked</Pill>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1.5">Day rate Â· {fmtMoney(me.dayRate ?? 0)}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="bb-mono text-lg font-semibold text-emerald-700">{fmtMoney(me.dayRate ?? 0)}</div>
                      <div className="text-[10px] text-gray-500 bb-mono">earned</div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (confirm('Remove this worked day?')) deleteShift(s.id); }}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-700 hover:bg-red-50"
                      aria-label="Remove worked day"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          }
          // Driver rendering (existing)
          return (
            <Card
              key={s.id}
              className={`p-4 bb-slide ${live ? '' : 'cursor-pointer hover:border-orange-300 active:bg-gray-50 transition-colors'}`}
              onClick={() => { if (!live) setEditingId(s.id); }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">{fmtDow(s.startTime)} {fmtDate(s.startTime)}</span>
                    <PlateBadge plate={s.location} size="sm" />
                    {s.editedAt && <span className="text-[9px] uppercase tracking-wider text-orange-600 bb-mono">edited</span>}
                  </div>
                  <div className="text-sm bb-mono mt-1.5">{fmtTime(s.startTime)} â†’ {live ? <span className="text-emerald-600 inline-flex items-center gap-1.5"><LiveDot /> live</span> : fmtTime(s.endTime)}</div>
                  {s.breakMinutes > 0 && <div className="text-[11px] text-gray-500 mt-0.5">â€“ {s.breakMinutes}m break</div>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className="bb-mono text-lg font-semibold text-orange-600">{fmtDuration(dur)}</div>
                    <div className="text-[10px] text-gray-500 bb-mono">{live ? 'so far' : 'total'}</div>
                  </div>
                  {!live && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingId(s.id); }}
                      className="p-2 rounded-lg text-orange-600 bg-orange-50 hover:bg-orange-100"
                      aria-label="Edit shift"
                    >
                      <Edit3 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {editing && (
        <ShiftEditDrawer
          shift={editing}
          onClose={() => setEditingId(null)}
          onSave={(patch) => { updateShift(editing.id, patch); setEditingId(null); }}
          onDelete={() => deleteShift(editing.id)}
        />
      )}
    </div>
  );
}

// Helpers for datetime-local input <-> timestamp
function toLocalInput(ts) {
  const d = new Date(ts);
  const pad = n => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(str) {
  if (!str) return NaN;
  return new Date(str).getTime();
}

function ShiftEditDrawer({ shift, onClose, onSave, onDelete }) {
  const [startStr, setStartStr] = useState(toLocalInput(shift.startTime));
  const [endStr, setEndStr] = useState(shift.endTime ? toLocalInput(shift.endTime) : toLocalInput(Date.now()));
  const [plate, setPlate] = useState(shift.location || '');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const startTs = fromLocalInput(startStr);
  const endTs = fromLocalInput(endStr);
  const valid = !isNaN(startTs) && !isNaN(endTs) && endTs > startTs && plate.trim().length > 0;

  const save = () => {
    if (!valid) return;
    onSave({
      startTime: startTs,
      endTime: endTs,
      location: plate.trim().toUpperCase(),
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40" onClick={onClose}>
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl border border-gray-200 shadow-2xl bb-slide"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-orange-600 bb-mono">Edit shift</div>
            <div className="bb-display text-lg font-semibold mt-0.5">{fmtDateLong(shift.startTime)}</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"><X size={16} /></button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Number plate</label>
            <input
              className="bb-input w-full mt-1.5 px-4 py-3 rounded-lg bb-mono text-base uppercase tracking-widest"
              value={plate}
              onChange={e => setPlate(e.target.value.toUpperCase())}
              placeholder="e.g. RC1"
              maxLength={10}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Start</label>
              <input
                type="datetime-local"
                className="bb-input w-full mt-1.5 px-3 py-2.5 rounded-lg bb-mono text-sm"
                value={startStr}
                onChange={e => setStartStr(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Finish</label>
              <input
                type="datetime-local"
                className="bb-input w-full mt-1.5 px-3 py-2.5 rounded-lg bb-mono text-sm"
                value={endStr}
                onChange={e => setEndStr(e.target.value)}
              />
            </div>
          </div>

          {!valid && (
            <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>Finish time must be after start time, and number plate is required.</span>
            </div>
          )}

          <div className="text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <strong className="text-gray-700">Heads up:</strong> edits are visible to admin and tagged in reports. The 30 min break and overtime rules are recalculated automatically.
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bb-body font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200"
            >
              <Trash2 size={14} /> Delete shift
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-700 font-medium">Delete this shift?</span>
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bb-body font-semibold bg-red-600 text-white hover:bg-red-500"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1.5"
              >
                Cancel
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={!valid}><Check size={14} /> Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DriverFuel({ me }) {
  const { fuel, setFuel, shifts } = useData();
  const myFuel = fuel.filter(f => f.driverId === me.id).sort((a, b) => b.date - a.date);
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [noFuel, setNoFuel] = useState(false);
  const [cardInvalid, setCardInvalid] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  // Plate to attach to fuel entry: live shift first, else today's most recent, else blank
  const myShifts = shifts.filter(s => s.employeeId === me.id);
  const liveShift = myShifts.find(s => !s.endTime);
  const todayKeyV = dayKey(new Date());
  const todayShifts = myShifts.filter(s => dayKey(s.startTime) === todayKeyV).sort((a, b) => b.startTime - a.startTime);
  const currentPlate = liveShift?.location || todayShifts[0]?.location || '';

  // No fuel + Fuel card invalid are mutually exclusive
  const toggleNoFuel = () => {
    setNoFuel(v => !v);
    if (!noFuel) setCardInvalid(false);
    setError('');
  };
  const toggleCardInvalid = () => {
    setCardInvalid(v => !v);
    if (!cardInvalid) setNoFuel(false);
    setError('');
  };

  const skipAmount = noFuel || cardInvalid;

  const save = () => {
    const costN = skipAmount ? 0 : parseFloat(cost) || 0;
    if (!skipAmount && costN <= 0) {
      setError('Enter the dollar amount, tick "No fuel today", or tick "Fuel card invalid".');
      return;
    }
    setError('');
    setFuel(prev => [...prev, {
      id: uid(),
      driverId: me.id,
      date: Date.now(),
      cost: costN,
      noFuel,
      cardInvalid,
      notes: notes.trim(),
      truck: currentPlate,
    }]);
    setCost(''); setNotes(''); setNoFuel(false); setCardInvalid(false);
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="bb-slide">
        <div className="text-[10px] uppercase tracking-[0.22em] text-orange-600 bb-mono mb-2">Fuel</div>
        <h1 className="bb-display text-2xl font-semibold">Log fuel</h1>
        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
          <span>{fmtDateLong(Date.now())}</span>
          {currentPlate && (
            <>
              <span>Â·</span>
              <span>truck</span>
              <PlateBadge plate={currentPlate} size="sm" />
            </>
          )}
        </div>
      </div>

      <Card className="p-5 bb-slide">
        <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono mb-3">Today's fuel</div>

        {/* Status toggles */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={toggleNoFuel}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors ${
              noFuel
                ? 'border-orange-600 bg-orange-50 text-orange-700'
                : 'border-gray-300 text-gray-600 hover:border-gray-400 bg-white'
            }`}
          >
            {noFuel ? <Check size={13} /> : <X size={13} />} No fuel today
          </button>
          <button
            onClick={toggleCardInvalid}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors ${
              cardInvalid
                ? 'border-red-600 bg-red-50 text-red-700'
                : 'border-gray-300 text-gray-600 hover:border-gray-400 bg-white'
            }`}
          >
            {cardInvalid ? <AlertCircle size={13} /> : <X size={13} />} Fuel card invalid
          </button>
        </div>

        <div className={skipAmount ? 'opacity-40 pointer-events-none' : ''}>
          <label className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Amount ($)</label>
          <div className="relative mt-1.5">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 bb-mono text-lg">$</span>
            <input
              className="bb-input w-full pl-9 pr-4 py-3 rounded-lg bb-mono text-lg"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="0.00"
              value={cost}
              onChange={e => { setCost(e.target.value); setError(''); }}
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">Notes (optional)</label>
          <input
            className="bb-input w-full mt-1.5 px-4 py-2.5 rounded-lg text-sm"
            placeholder={cardInvalid ? 'What happened? e.g. card declined at BP' : 'e.g. station, receipt #'}
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-3">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <Button size="lg" className="w-full mt-4" onClick={save}>
          {confirmed ? <><Check size={16} /> Saved</> : <>Save entry <ArrowRight size={16} /></>}
        </Button>
      </Card>

      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono mb-2">Recent entries</div>
        <div className="space-y-2">
          {myFuel.length === 0 && <Card className="p-4 text-center text-sm text-gray-500">No entries yet.</Card>}
          {myFuel.slice(0, 8).map(f => (
            <Card key={f.id} className="p-3.5 flex items-center justify-between bb-slide">
              <div className="min-w-0 flex-1">
                <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500 bb-mono">{fmtDow(f.date)} {fmtDate(f.date)}</div>
                {f.notes && <div className="text-xs text-gray-600 mt-0.5 truncate">{f.notes}</div>}
              </div>
              <div className="shrink-0">
                {f.cardInvalid
                  ? <Pill tone="red"><AlertCircle size={11} /> Card invalid</Pill>
                  : f.noFuel
                    ? <Pill tone="muted">No fuel</Pill>
                    : <span className="bb-mono text-emerald-700 font-semibold text-lg">{fmtMoney(f.cost || 0)}</span>
                }
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function DriverProfile({ me }) {
  const { setSession } = useData();
  return (
    <div className="space-y-5">
      <div className="bb-slide">
        <div className="text-[10px] uppercase tracking-[0.22em] text-orange-600 bb-mono mb-2">Profile</div>
        <h1 className="bb-display text-2xl font-semibold">{me.name}</h1>
      </div>
      <Card className="p-5 space-y-4 bb-slide">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center bb-display font-semibold text-2xl">
            {me.name[0]}
          </div>
          <div>
            <div className="text-sm font-medium">{me.name}</div>
            <div className="text-[11px] text-gray-500 bb-mono">DRIVER Â· BLACKBIRD LOGISTICS</div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 grid gap-3">
          <Row label="Joined"       value={new Date(me.createdAt).toLocaleDateString('en-AU')} />
          <Row label="Status"       value={me.active ? 'Active' : 'Disabled'} />
          <Row label="Week cycle"   value="Friday â†’ Thursday" />
        </div>
      </Card>
      <Button variant="border" className="w-full" onClick={() => setSession(null)}>
        <LogOut size={14} /> Sign out
      </Button>
    </div>
  );
}

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-900 bb-mono">{value}</span>
  </div>
);

/* ============================================================
   ROOT
   ============================================================ */
function App() {
  const { session, loaded } = useData();

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gray-50 text-orange-600 flex items-center justify-center">
        <style>{GLOBAL_STYLES}</style>
        <div className="flex items-center gap-3 bb-mono text-sm">
          <BlackbirdLogo size={22} className="bb-live-dot" /> LOADINGâ€¦
        </div>
      </div>
    );
  }
  if (!session) return <LoginScreen />;
  if (session.role === 'admin') return <AdminApp />;
  return <DriverApp />;
}

function Root() {
  return (
    <DataProvider>
      <App />
    </DataProvider>
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(<Root />);

