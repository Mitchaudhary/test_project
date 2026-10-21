import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { ShieldCheck, RefreshCw, KeyRound, Maximize2, Minimize2, Radio } from 'lucide-react';

interface DynamicQRCodeProps {
  token: string;
  otpCode: string;
  refreshIntervalSec?: number;
  lastUpdatedAt: number;
  onManualRefresh?: () => void;
  courseCode: string;
  topicTitle: string;
  classroom: string;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

export const DynamicQRCode: React.FC<DynamicQRCodeProps> = ({
  token,
  otpCode,
  refreshIntervalSec = 15,
  lastUpdatedAt,
  onManualRefresh,
  courseCode,
  topicTitle,
  classroom,
  isFullScreen = false,
  onToggleFullScreen,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(refreshIntervalSec);

  // Render QR code onto canvas
  useEffect(() => {
    if (!canvasRef.current || !token) return;

    QRCode.toCanvas(
      canvasRef.current,
      token,
      {
        width: isFullScreen ? 340 : 220,
        margin: 2,
        color: {
          dark: '#0f172a', // Slate 900
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      },
      (error) => {
        if (error) console.error('QR code generation error', error);
      }
    );
  }, [token, isFullScreen]);

  // Countdown timer for rotating token
  useEffect(() => {
    const updateCountdown = () => {
      const elapsed = Math.floor((Date.now() - lastUpdatedAt) / 1000);
      const remaining = Math.max(0, refreshIntervalSec - (elapsed % refreshIntervalSec));
      setSecondsRemaining(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lastUpdatedAt, refreshIntervalSec]);

  const progressPercent = ((refreshIntervalSec - secondsRemaining) / refreshIntervalSec) * 100;

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm ${isFullScreen ? 'max-w-2xl mx-auto p-10 shadow-2xl' : ''}`}>
      {/* Header with Anti-Proxy Protection Badge */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Dynamic Anti-Proxy Active
          </span>
        </div>

        {onToggleFullScreen && (
          <button
            onClick={onToggleFullScreen}
            title={isFullScreen ? 'Exit Full Screen' : 'Projector Full Screen'}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* QR Canvas Container with pulsing border */}
      <div className="relative p-3 bg-slate-50 rounded-2xl border-2 border-indigo-200/80 shadow-inner flex items-center justify-center">
        <canvas ref={canvasRef} className="rounded-xl shadow-xs" />
        
        {/* Center University Security Badge Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white shadow-md text-white font-bold text-xs">
            UNI
          </div>
        </div>
      </div>

      {/* Dynamic Token Expiry Progress Bar */}
      <div className="w-full mt-4 space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <RefreshCw className={`w-3 h-3 ${secondsRemaining <= 3 ? 'animate-spin text-amber-500' : 'text-slate-400'}`} />
            Auto-rotates in <strong className="text-slate-800 font-mono">{secondsRemaining}s</strong>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Hash: {token.slice(-8)}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              secondsRemaining <= 4 ? 'bg-amber-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${100 - progressPercent}%` }}
          />
        </div>
      </div>

      {/* Fallback 6-digit OTP Code for manual input */}
      <div className="mt-4 w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 uppercase font-semibold">Manual Backup Code</div>
            <div className="text-lg font-mono font-bold tracking-widest text-slate-900">{otpCode}</div>
          </div>
        </div>
        
        {onManualRefresh && (
          <button
            onClick={onManualRefresh}
            className="text-xs px-2.5 py-1.5 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-md border border-slate-200 transition-all cursor-pointer font-medium"
          >
            Force Refresh
          </button>
        )}
      </div>

      {/* Lecture Info Footer */}
      <div className="mt-3 text-center">
        <p className="text-xs font-semibold text-slate-700">{courseCode} • {classroom}</p>
        <p className="text-[11px] text-slate-500 truncate max-w-xs">{topicTitle}</p>
      </div>
    </div>
  );
};
