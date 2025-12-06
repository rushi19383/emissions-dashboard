import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { MessageSquare, Send, Globe, Zap, Car, Leaf, Factory, Activity, Info, Server, Database, X, Menu, RefreshCw } from 'lucide-react';

// --- Default Mock Data (Fallback if Backend is offline) ---
const DEFAULT_EMISSION_DATA = [
  { year: '2019', energy: 4000, transport: 2400, industry: 2400, agriculture: 1500, buildings: 800 },
  { year: '2020', energy: 3800, transport: 2000, industry: 2200, agriculture: 1550, buildings: 780 },
  { year: '2021', energy: 4100, transport: 2300, industry: 2500, agriculture: 1600, buildings: 820 },
  { year: '2022', energy: 4300, transport: 2500, industry: 2600, agriculture: 1620, buildings: 850 },
  { year: '2023', energy: 4250, transport: 2600, industry: 2550, agriculture: 1650, buildings: 840 },
];

const DEFAULT_SECTOR_DATA = [
  { name: 'Energy', value: 4250, color: '#3b82f6' },
  { name: 'Transport', value: 2600, color: '#f59e0b' },
  { name: 'Industry', value: 2550, color: '#10b981' },
  { name: 'Agriculture', value: 1650, color: '#8b5cf6' },
  { name: 'Buildings', value: 840, color: '#ef4444' },
];

const API_BASE_URL = "http://localhost:8080/api/v1";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-6 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, type = "neutral" }) => {
  const styles = {
    neutral: "bg-slate-100 text-slate-600",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-rose-100 text-rose-700",
    info: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>
      {children}
    </span>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: "Hello! I'm EcoBot. Ask me about emission trends or industry specific data." }
  ]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const [emissionData, setEmissionData] = useState(DEFAULT_EMISSION_DATA);
  const [sectorData, setSectorData] = useState(DEFAULT_SECTOR_DATA);
  const [dashboardStats, setDashboardStats] = useState({
    totalEmissions: 11890,
    topSector: "Energy",
    netZeroTarget: 2050,
    activeAlerts: 3
  });
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data from backend in parallel with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const [emissionsRes, statsRes, sectorsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/emissions`, { signal: controller.signal }).catch(err => {
          if (err.name === 'AbortError') throw new Error('Request timeout');
          throw err;
        }),
        fetch(`${API_BASE_URL}/dashboard/stats`, { signal: controller.signal }).catch(err => {
          if (err.name === 'AbortError') throw new Error('Request timeout');
          throw err;
        }),
        fetch(`${API_BASE_URL}/dashboard/sectors`, { signal: controller.signal }).catch(err => {
          if (err.name === 'AbortError') throw new Error('Request timeout');
          throw err;
        })
      ]);

      clearTimeout(timeoutId);

      // Check if all responses are OK
      if (!emissionsRes.ok || !statsRes.ok || !sectorsRes.ok) {
        const errors = [];
        if (!emissionsRes.ok) errors.push(`Emissions: ${emissionsRes.status} ${emissionsRes.statusText}`);
        if (!statsRes.ok) errors.push(`Stats: ${statsRes.status} ${statsRes.statusText}`);
        if (!sectorsRes.ok) errors.push(`Sectors: ${sectorsRes.status} ${sectorsRes.statusText}`);
        throw new Error(`Backend errors: ${errors.join(', ')}`);
      }

      // Parse JSON responses
      const [emissions, stats, sectors] = await Promise.all([
        emissionsRes.json().catch(() => null),
        statsRes.json().catch(() => null),
        sectorsRes.json().catch(() => null)
      ]);

      // Validate and transform emission data
      if (emissions && Array.isArray(emissions) && emissions.length > 0) {
        const transformedEmissions = emissions.map(e => ({
          year: e.year || '',
          energy: e.energy || 0,
          transport: e.transport || 0,
          industry: e.industry || 0,
          agriculture: e.agriculture || 0,
          buildings: e.buildings || 0
        }));
        setEmissionData(transformedEmissions);
      } else {
        throw new Error('Invalid emissions data format');
      }

      // Validate and set dashboard stats
      if (stats && typeof stats === 'object') {
        setDashboardStats({
          totalEmissions: stats.totalEmissions || 0,
          topSector: stats.topSector || 'Unknown',
          netZeroTarget: stats.netZeroTarget || 2050,
          activeAlerts: stats.activeAlerts || 0
        });
      } else {
        throw new Error('Invalid stats data format');
      }

      // Validate and set sector data
      if (sectors && Array.isArray(sectors) && sectors.length > 0) {
        setSectorData(sectors);
      } else {
        throw new Error('Invalid sector data format');
      }

      setIsConnected(true);
    } catch (error) {
      console.error("Error fetching data from backend:", error.message);
      setIsConnected(false);
      // Use fallback data
      setEmissionData(DEFAULT_EMISSION_DATA);
      setSectorData(DEFAULT_SECTOR_DATA);
      setDashboardStats({
        totalEmissions: 11890,
        topSector: "Energy",
        netZeroTarget: 2050,
        activeAlerts: 3
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMsg = { id: Date.now(), type: 'user', text: trimmedInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    if (isConnected) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const res = await fetch(`${API_BASE_URL}/chat/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: trimmedInput }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: `HTTP ${res.status}: ${res.statusText}` }));
          throw new Error(errorData.error || `Server error: ${res.status}`);
        }

        const data = await res.json();
        
        if (data && data.response) {
          setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: data.response }]);
        } else if (data && data.error) {
          setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            type: 'bot', 
            text: `Error: ${data.error}. Please try again.` 
          }]);
        } else {
          throw new Error('Invalid response format');
        }
        return;
      } catch (error) {
        console.error("Chat API error:", error.message);
        let errorMessage = "I'm having trouble connecting to the backend. ";
        if (error.name === 'AbortError') {
          errorMessage += "Request timed out.";
        } else if (error.message) {
          errorMessage += error.message;
        } else {
          errorMessage += "Please try again later.";
        }
        setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: errorMessage }]);
        return;
      }
    }

    // Offline mode fallback
    setTimeout(() => {
      let botResponse = "";
      const lowerInput = userMsg.text.toLowerCase();
      if (lowerInput.includes('highest') || lowerInput.includes('most')) {
        botResponse = "Based on the 2023 data, the Energy sector contributes the highest emissions (4250 MtCO2e).";
      } else if (lowerInput.includes('trend')) {
        botResponse = "Emissions dipped in 2020 due to the pandemic but have rebounded.";
      } else {
        botResponse = "I am currently in Offline Mode. Connect the Spring Boot backend to get real AI responses.";
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: botResponse }]);
    }, 1000);
  };

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-2 font-bold text-xl">
          <Leaf className="text-emerald-400" />
          <span>EcoTrack</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      <nav className="mt-6 px-4 space-y-2">
        <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Activity size={20} /><span>Overview</span></button>
        <button onClick={() => setActiveTab('sectors')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'sectors' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Factory size={20} /><span>Sectors</span></button>
        <button onClick={() => setActiveTab('connect')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'connect' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Server size={20} /><span>Server Config</span></button>
      </nav>
      <div className="absolute bottom-0 left-0 w-full p-6">
        <div className={`rounded-lg p-4 border ${isConnected ? 'bg-emerald-900/30 border-emerald-800' : 'bg-rose-900/30 border-rose-800'}`}>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center">{isConnected ? <Zap size={12} className="mr-1 text-emerald-400"/> : <X size={12} className="mr-1 text-rose-400"/>}System Status</h4>
          <span className={`text-sm font-bold ${isConnected ? 'text-emerald-400' : 'text-rose-400'}`}>{isConnected ? 'Online' : 'Offline Mode'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-500"><Menu size={24} /></button>
            <h1 className="text-xl font-bold text-slate-800">
              {activeTab === 'dashboard' && 'Global Emissions Overview'}
              {activeTab === 'sectors' && 'Sector Analysis'}
              {activeTab === 'connect' && 'Backend Configuration'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={fetchData} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"><RefreshCw size={18} className={loading ? "animate-spin" : ""} /></button>
            <button onClick={() => setChatOpen(!chatOpen)} className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${chatOpen ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}><MessageSquare size={18} /><span className="hidden sm:inline">AI Assistant</span></button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 relative">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <div className="flex justify-between items-start">
                    <div><p className="text-sm text-slate-500 font-medium">Total Emissions</p><h3 className="text-2xl font-bold mt-1">{dashboardStats.totalEmissions?.toLocaleString()} <span className="text-sm text-slate-400 font-normal">MtCO2e</span></h3></div>
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><Zap size={20} /></div>
                  </div>
                </Card>
                <Card>
                  <div className="flex justify-between items-start">
                    <div><p className="text-sm text-slate-500 font-medium">Top Sector</p><h3 className="text-2xl font-bold mt-1">{dashboardStats.topSector}</h3></div>
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Factory size={20} /></div>
                  </div>
                </Card>
                 <Card>
                  <div className="flex justify-between items-start">
                    <div><p className="text-sm text-slate-500 font-medium">Net Zero Target</p><h3 className="text-2xl font-bold mt-1">{dashboardStats.netZeroTarget}</h3></div>
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Leaf size={20} /></div>
                  </div>
                </Card>
                 <Card>
                  <div className="flex justify-between items-start">
                    <div><p className="text-sm text-slate-500 font-medium">Active Alerts</p><h3 className="text-2xl font-bold mt-1">{dashboardStats.activeAlerts}</h3></div>
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Info size={20} /></div>
                  </div>
                </Card>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={emissionData}>
                        <defs><linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="energy" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEnergy)" />
                        <Area type="monotone" dataKey="transport" stroke="#f59e0b" fillOpacity={0.1} fill="#f59e0b" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                <Card>
                    <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={sectorData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {sectorData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>
          )}
          {activeTab === 'sectors' && (
             <div className="max-w-7xl mx-auto space-y-6">
               <Card>
                 <h3 className="text-lg font-bold mb-4">Detailed Sector Comparison</h3>
                 <div className="h-[500px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={emissionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="energy" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="transport" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="industry" stackId="a" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
               </Card>
             </div>
          )}
          {activeTab === 'connect' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <Card className="border-l-4 border-l-emerald-500">
                <h3 className="text-xl font-bold mb-2">Connect to Spring Boot Backend</h3>
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300">
                    <p className="text-emerald-400">./mvnw spring-boot:run</p>
                    <p>Connection: <span className={isConnected ? "text-emerald-400" : "text-rose-400"}>{isConnected ? "CONNECTED" : "DISCONNECTED"}</span></p>
                  </div>
                  <button onClick={fetchData} className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-medium">Retry Connection</button>
                </div>
              </Card>
            </div>
          )}
          <div className={`fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${chatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-emerald-600 text-white">
               <span className="font-bold">EcoBot Assistant</span>
               <button onClick={() => setChatOpen(false)}><X size={20} /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
               {messages.map(msg => (<div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.type === 'user' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200'}`}>{msg.text}</div></div>))}
               <div ref={chatEndRef} />
             </div>
             <div className="p-4 bg-white border-t border-slate-100 flex items-center space-x-2">
                 <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} className="flex-1 border border-slate-200 rounded-lg px-4 py-2" />
                 <button onClick={handleSend} className="bg-emerald-600 text-white p-2 rounded-lg"><Send size={18} /></button>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}