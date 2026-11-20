import { useState, useEffect } from 'react';
import { AlertCircle, WifiOff } from 'lucide-react';

export const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    const handleCustomOffline = (e) => {
      setIsOffline(e.detail.offline);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('api:offline', handleCustomOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('api:offline', handleCustomOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-[#B42318] text-white px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 sticky top-0 z-50">
      <WifiOff className="w-4 h-4 shrink-0" strokeWidth={1.75} />
      <span>Can't reach the server. Retrying...</span>
    </div>
  );
};
