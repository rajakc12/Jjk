import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Search, Info, Layers, Maximize2, BrainCircuit, Loader2, Send, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Component to handle map view changes
const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const AIMap = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Center of India
  const [mapZoom, setMapZoom] = useState(5);
  const [groundingUrls, setGroundingUrls] = useState<{title: string, uri: string}[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Regions' },
    { id: 'physical', name: 'Physical Features' },
    { id: 'rivers', name: 'Rivers & Lakes' },
    { id: 'environment', name: 'Environment & Parks' },
    { id: 'history', name: 'History & Heritage' },
    { id: 'current', name: 'Current Affairs' },
  ];

  const allRegions = [
    // Physical
    { id: 'himalayas', category: 'physical', name: 'The Himalayas', coords: [32.7266, 77.5126] as [number, number], zoom: 6, desc: 'Young fold mountains, crucial for climate and water resources.' },
    { id: 'aravallis', category: 'physical', name: 'Aravalli Range', coords: [24.5854, 73.7125] as [number, number], zoom: 7, desc: 'One of the oldest fold mountains in the world.' },
    { id: 'deccan', category: 'physical', name: 'Deccan Plateau', coords: [17.3850, 78.4867] as [number, number], zoom: 6, desc: 'Ancient volcanic plateau, rich in minerals and black soil.' },
    { id: 'western-ghats', category: 'physical', name: 'Western Ghats', coords: [14.9184, 74.0827] as [number, number], zoom: 7, desc: 'Biodiversity hotspots, crucial for monsoon patterns.' },
    
    // Rivers
    { id: 'ganga', category: 'rivers', name: 'Ganga River Basin', coords: [25.3176, 82.9739] as [number, number], zoom: 6, desc: 'Holistic river system, lifeline of North India.' },
    { id: 'brahmaputra', category: 'rivers', name: 'Brahmaputra Valley', coords: [26.1445, 91.7362] as [number, number], zoom: 7, desc: 'Trans-boundary river, known for Majuli island.' },
    { id: 'indus', category: 'rivers', name: 'Indus System', coords: [34.1526, 77.5771] as [number, number], zoom: 6, desc: 'Crucial for Ladakh and Punjab regions.' },
    
    // Environment
    { id: 'kaziranga', category: 'environment', name: 'Kaziranga NP', coords: [26.5775, 93.1711] as [number, number], zoom: 10, desc: 'UNESCO site, home to One-horned Rhinoceros.' },
    { id: 'sundarbans', category: 'environment', name: 'Sundarbans', coords: [21.9497, 89.1833] as [number, number], zoom: 9, desc: 'Largest mangrove forest, Royal Bengal Tiger habitat.' },
    { id: 'nilgiri', category: 'environment', name: 'Nilgiri Biosphere', coords: [11.4102, 76.6950] as [number, number], zoom: 9, desc: 'First biosphere reserve in India.' },
    
    // History
    { id: 'hampi', category: 'history', name: 'Hampi (Vijayanagara)', coords: [15.3350, 76.4600] as [number, number], zoom: 12, desc: 'UNESCO World Heritage site, capital of Vijayanagara Empire.' },
    { id: 'dholavira', category: 'history', name: 'Dholavira', coords: [23.8875, 70.2136] as [number, number], zoom: 10, desc: 'Harappan city in Rann of Kutch, known for water management.' },
    { id: 'ajanta', category: 'history', name: 'Ajanta Caves', coords: [20.5519, 75.7031] as [number, number], zoom: 12, desc: 'Buddhist rock-cut caves, 2nd century BCE to 480 CE.' },
    
    // Current Affairs
    { id: 'red-sea', category: 'current', name: 'Red Sea & Bab-el-Mandeb', coords: [15.5, 42.5] as [number, number], zoom: 5, desc: 'Strategic maritime chokepoint, frequently in news due to trade disruptions.' },
    { id: 'chabahar', category: 'current', name: 'Chabahar Port', coords: [25.2897, 60.6235] as [number, number], zoom: 10, desc: 'India-operated port in Iran, crucial for connectivity to Central Asia.' },
    { id: 'pangong', category: 'current', name: 'Pangong Tso', coords: [33.7595, 78.6674] as [number, number], zoom: 10, desc: 'High-altitude lake in Ladakh, site of border tensions.' },
  ];

  const filteredRegions = selectedCategory === 'all' 
    ? allRegions 
    : allRegions.filter(r => r.category === selectedCategory);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || loading) return;

    setLoading(true);
    setGroundingUrls([]);
    try {
      const prompt = `You are a Geography and History expert for UPSC (Union Public Service Commission) of India. 
      Provide a detailed analytical overview of "${searchQuery}".
      Include:
      1. Geographical Location & Significance (Lat/Long context).
      2. Historical Context (if any, e.g., Ancient/Medieval significance).
      3. Environmental Status (National Park, Wildlife Sanctuary, UNESCO site, Ramsar site).
      4. Economic Importance (Minerals, Agriculture, Tourism).
      5. Potential UPSC Prelims/Mains question angle.
      
      Keep it structured with bullet points and information-dense. Use professional academic tone.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Using 2.5 for Google Maps grounding
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          tools: [{ googleMaps: {} }],
        }
      });

      setAiInsight(response.text || "No insight found.");
      
      // Extract grounding chunks
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const urls = chunks
          .filter(c => c.maps)
          .map(c => ({ title: c.maps?.title || 'Map Link', uri: c.maps?.uri || '' }))
          .filter(u => u.uri);
        setGroundingUrls(urls);
      }

      // Try to find coordinates in text or just center on search if it's a known region
      const regionMatch = allRegions.find(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
      if (regionMatch) {
        setMapCenter(regionMatch.coords);
        setMapZoom(regionMatch.zoom);
      }
    } catch (error) {
      console.error("AI Map Error:", error);
      setAiInsight("Error fetching insight. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegionClick = (region: any) => {
    setSelectedRegion(region.id);
    setSearchQuery(region.name);
    setMapCenter(region.coords);
    setMapZoom(region.zoom);
    
    setLoading(true);
    setGroundingUrls([]);
    const prompt = `You are a Geography and History expert for UPSC. 
    Analyze "${region.name}" focusing on its importance for the Civil Services Examination.
    Include physical features, biodiversity, and historical significance.`;
    
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleMaps: {} }],
      }
    }).then(response => {
      setAiInsight(response.text || "No insight found.");
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const urls = chunks
          .filter(c => c.maps)
          .map(c => ({ title: c.maps?.title || 'Map Link', uri: c.maps?.uri || '' }))
          .filter(u => u.uri);
        setGroundingUrls(urls);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold font-serif mb-2">AI Map Study</h2>
          <p className="text-stone-500">Interactive Geography visualization for UPSC & PSC.</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location (e.g. Aravallis)..." 
              className="bg-white border border-stone-200 rounded-full pl-12 pr-6 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500 w-64"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="p-2.5 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card overflow-hidden relative min-h-[500px] z-0">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: '500px', width: '100%' }}
            scrollWheelZoom={true}
          >
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredRegions.map(r => (
              <Marker key={r.id} position={r.coords}>
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold mb-1">{r.name}</h4>
                    <p className="text-xs text-stone-600">{r.desc}</p>
                    <button 
                      onClick={() => handleRegionClick(r)}
                      className="mt-2 text-[10px] font-bold text-amber-600 uppercase tracking-wider"
                    >
                      Analyze Region
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-[1000]">
            <button 
              onClick={() => { setMapCenter([20.5937, 78.9629]); setMapZoom(5); }}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-stone-50 transition-colors"
              title="Reset View"
            >
              <Navigation size={20} className="text-stone-600" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-serif">Map Layers</h3>
            <Layers size={18} className="text-stone-400" />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'bg-white border border-stone-200 text-stone-500 hover:border-stone-400'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredRegions.map((region) => (
              <motion.div 
                key={region.id}
                whileHover={{ x: 5 }}
                onClick={() => handleRegionClick(region)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                  selectedRegion === region.id 
                    ? 'bg-amber-50 border-amber-200 shadow-sm' 
                    : 'bg-white border-stone-100 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-stone-900">{region.name}</h4>
                  <Info size={16} className="text-stone-400" />
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">{region.desc}</p>
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {aiInsight && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="glass-card p-6 bg-stone-900 text-stone-100"
              >
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <BrainCircuit size={18} className="text-amber-500" />
                  AI Insight: {searchQuery}
                </h4>
                <div className="text-xs text-stone-400 leading-relaxed max-h-64 overflow-y-auto custom-scrollbar mb-4">
                  {aiInsight}
                </div>
                
                {groundingUrls.length > 0 && (
                  <div className="pt-4 border-t border-stone-800">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">Google Maps Sources</h5>
                    <div className="flex flex-wrap gap-2">
                      {groundingUrls.map((url, i) => (
                        <a 
                          key={i} 
                          href={url.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] bg-stone-800 hover:bg-stone-700 px-2 py-1 rounded text-amber-500 transition-colors"
                        >
                          {url.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
