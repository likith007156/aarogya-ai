"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

export default function PHCMapPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en-IN';
  const [phcs, setPhcs] = useState<any[]>([]);
  const [booked, setBooked] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/phc")
      .then(res => res.json())
      .then(data => setPhcs(data))
      .catch(console.error);
    
    // Fix leaflet marker icon issue in Next.js
    import("leaflet").then(L => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });
  }, []);

  return (
    <div className="flex flex-col h-screen font-sans">
      <header className="bg-white border-b border-slate-200 p-4 flex items-center gap-4">
        <Link href={`/${locale}/chat`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <h1 className="text-xl font-bold">Nearest PHCs</h1>
      </header>
      
      <div className="flex-1 relative">
          <MapContainer center={[12.97, 77.59]} zoom={11} className="w-full h-full z-0">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {phcs.map(phc => (
              <Marker key={phc.id} position={[phc.latitude, phc.longitude]}>
                <Popup>
                  <div className="p-1">
                    <h3 className="font-bold mb-1 text-base">{phc.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">Available Slots: {phc.slots}</p>
                    
                    {booked === phc.id ? (
                      <div className="bg-green-100 text-green-800 p-2 rounded text-sm text-center font-bold">
                        Booked! Token: #42
                      </div>
                    ) : (
                      <Button onClick={() => setBooked(phc.id)} className="w-full bg-green-600 hover:bg-green-700 h-8 text-xs">
                        Book Now
                      </Button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
      </div>
    </div>
  );
}
