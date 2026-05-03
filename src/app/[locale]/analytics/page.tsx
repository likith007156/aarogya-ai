"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, HeartPulse, IndianRupee, ShieldCheck, Map, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import dynamic from "next/dynamic";

// Map needs to be dynamically imported to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then(m => m.CircleMarker), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then(m => m.Tooltip), { ssr: false });

const LANGUAGES_DATA = [
  { name: 'Hindi', value: 45, color: '#3b82f6' },
  { name: 'Tamil', value: 18, color: '#10b981' },
  { name: 'Telugu', value: 12, color: '#f59e0b' },
  { name: 'Bengali', value: 10, color: '#8b5cf6' },
  { name: 'Marathi', value: 8, color: '#ec4899' },
  { name: 'Others', value: 7, color: '#64748b' },
];

const DISEASES_DATA = [
  { name: 'TB', count: 1240 },
  { name: 'Anemia', count: 3102 },
  { name: 'Diabetes', count: 2150 },
  { name: 'Hypertension', count: 2890 },
  { name: 'Malaria', count: 850 },
];

const HEATMAP_DATA = [
  { id: 1, lat: 26.8467, lng: 80.9462, cases: 4500, state: "Uttar Pradesh" },
  { id: 2, lat: 25.0961, lng: 85.3131, cases: 3200, state: "Bihar" },
  { id: 3, lat: 19.0760, lng: 72.8777, cases: 2100, state: "Maharashtra" },
  { id: 4, lat: 13.0827, lng: 80.2707, cases: 1800, state: "Tamil Nadu" },
  { id: 5, lat: 22.9868, lng: 87.8550, cases: 1500, state: "West Bengal" },
  { id: 6, lat: 15.3173, lng: 75.7139, cases: 1200, state: "Karnataka" },
  { id: 7, lat: 21.2787, lng: 81.8661, cases: 900, state: "Chhattisgarh" },
  { id: 8, lat: 27.0238, lng: 74.2179, cases: 1100, state: "Rajasthan" },
  { id: 9, lat: 23.0225, lng: 72.5714, cases: 1400, state: "Gujarat" },
  { id: 10, lat: 17.3850, lng: 78.4867, cases: 1350, state: "Telangana" }
];

const AnimatedCounter = ({ value, prefix = "", suffix = "", isCurrency = false }: { value: number, prefix?: string, suffix?: string, isCurrency?: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {prefix}
      {isCurrency ? (count / 10000000).toFixed(1) : count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 border-b border-slate-300/50 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md border border-slate-200 flex-shrink-0">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
                alt="Emblem of India" 
                className="w-12 h-16 object-contain opacity-90" 
              />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-serif">National Impact Dashboard</h1>
              <p className="text-slate-700 font-medium text-lg">Ministry of Health & Family Welfare | Aarogya AI Mission</p>
            </div>
          </div>
          <div className="text-left md:text-right glass-card p-3 rounded-lg border-white/60 inline-block">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Report Date</div>
            <div className="text-blue-800 font-bold text-lg">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl border-l-4 border-l-blue-600 shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Users className="w-32 h-32 text-blue-600" />
            </div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Total Screenings</p>
            </div>
            <h2 className="text-4xl font-black text-slate-900 relative z-10">
              <AnimatedCounter value={12847} />
            </h2>
            <p className="text-xs text-green-700 font-bold mt-2 bg-green-100/50 inline-block px-2 py-1 rounded-md relative z-10">▲ 12% vs last month</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl border-l-4 border-l-green-500 shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <HeartPulse className="w-32 h-32 text-green-600" />
            </div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Lives Saved (Est.)</p>
            </div>
            <h2 className="text-4xl font-black text-slate-900 relative z-10">
              <AnimatedCounter value={234} />
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-2 relative z-10">Critical early detections</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-2xl border-l-4 border-l-purple-500 shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <ShieldCheck className="w-32 h-32 text-purple-600" />
            </div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">ABHA IDs Created</p>
            </div>
            <h2 className="text-4xl font-black text-slate-900 relative z-10">
              <AnimatedCounter value={8921} />
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-2 relative z-10">Rural citizens digitized</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-2xl border-l-4 border-l-amber-500 bg-amber-50/40 shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <IndianRupee className="w-32 h-32 text-amber-700" />
            </div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <p className="text-sm font-bold text-amber-900 uppercase tracking-wider">Money Saved</p>
            </div>
            <h2 className="text-4xl font-black text-amber-700 relative z-10">
              <AnimatedCounter value={23000000} prefix="₹" suffix=" Cr" isCurrency={true} />
            </h2>
            <p className="text-xs text-amber-800 font-medium mt-2 relative z-10">Reduced OOP expenses</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Diseases Bar Chart */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="glass-panel p-6 rounded-2xl lg:col-span-2 shadow-xl border-white/50">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-blue-700" />
              <h3 className="text-xl font-bold text-slate-800">Diseases Caught Early (Top 5)</h3>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DISEASES_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#475569" fontSize={13} fontWeight="bold" tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={13} fontWeight="bold" tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} 
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={45}>
                    {DISEASES_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#ef4444', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6'][index % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Languages Pie Chart */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="glass-panel p-6 rounded-2xl shadow-xl border-white/50">
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Language Distribution</h3>
            <div className="h-80 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={LANGUAGES_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {LANGUAGES_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} 
                    formatter={(value) => [`${value}%`, 'Usage']}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Heatmap */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-panel p-6 rounded-2xl mb-12 shadow-xl border-white/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Map className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-bold text-slate-800">District-wise Case Heatmap</h3>
            </div>
            <div className="text-sm font-bold text-slate-500 bg-white/50 px-3 py-1 rounded-full border border-white/60">Live Feed</div>
          </div>
          <div className="h-[450px] w-full rounded-xl overflow-hidden border-2 border-white/60 shadow-inner relative z-0">
              <MapContainer center={[22.5937, 78.9629]} zoom={4.5} style={{ height: "100%", width: "100%" }} zoomControl={false} scrollWheelZoom={false}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {HEATMAP_DATA.map(point => (
                  <CircleMarker
                    key={point.id}
                    center={[point.lat, point.lng]}
                    radius={Math.max(12, point.cases / 120)}
                    fillColor="#ef4444"
                    fillOpacity={0.6}
                    color="#991b1b"
                    weight={2}
                  >
                    <Tooltip className="glass-card !border-0 !shadow-xl !p-3">
                      <div className="font-bold text-slate-800 text-base border-b border-slate-200 pb-1 mb-1">{point.state}</div>
                      <div className="text-sm text-red-600 font-bold">{point.cases.toLocaleString()} cases flagged</div>
                    </Tooltip>
                  </CircleMarker>
                ))}
              </MapContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
