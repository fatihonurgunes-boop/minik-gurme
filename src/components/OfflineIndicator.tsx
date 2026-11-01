import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex items-center gap-2 rounded-xl bg-stone-800 text-white px-3 py-2 text-xs font-semibold shadow-lg border border-stone-700 animate-bounce">
      <WifiOff className="w-4 h-4 text-amber-400" />
      <span>Çevrimdışı Mod — Kayıtlar cihazınızda saklanıyor.</span>
    </div>
  );
};
