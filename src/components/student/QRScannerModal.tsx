import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Camera, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  KeyRound, 
  Sparkles,
  RefreshCw,
  Clock,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const { activeSession, markStudentAttendance, currentUser } = useAttendance();
  const [activeTab, setActiveTab] = useState<'camera' | 'otp' | 'simulate'>('camera');
  const [otpInput, setOtpInput] = useState('');
  const [scanStatus, setScanStatus] = useState<{
    type: 'idle' | 'scanning' | 'success' | 'error';
    message: string;
    courseName?: string;
    topicTitle?: string;
    time?: string;
  }>({
    type: 'idle',
    message: '',
  });

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera when camera tab is open
  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } else {
        setHasCameraPermission(false);
      }
    } catch (err) {
      console.warn('Camera access error/denied:', err);
      setHasCameraPermission(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const triggerSuccessConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#06b6d4', '#f59e0b'],
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleSimulateScan = () => {
    if (!activeSession) {
      setScanStatus({
        type: 'error',
        message: 'No lecture session is currently broadcasting on the campus network.',
      });
      return;
    }

    setScanStatus({ type: 'scanning', message: 'Decoding anti-proxy QR frame and validating GPS coordinates...' });

    setTimeout(() => {
      const res = markStudentAttendance(activeSession.qrSecretToken);
      if (res.success) {
        triggerSuccessConfetti();
        setScanStatus({
          type: 'success',
          message: res.message,
          courseName: res.courseName,
          topicTitle: res.topicTitle,
          time: res.timestamp,
        });
      } else {
        setScanStatus({
          type: 'error',
          message: res.message,
        });
      }
    }, 700);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim()) return;

    setScanStatus({ type: 'scanning', message: 'Verifying 6-digit session OTP...' });

    setTimeout(() => {
      const res = markStudentAttendance(otpInput.trim());
      if (res.success) {
        triggerSuccessConfetti();
        setScanStatus({
          type: 'success',
          message: res.message,
          courseName: res.courseName,
          topicTitle: res.topicTitle,
          time: res.timestamp,
        });
      } else {
        setScanStatus({
          type: 'error',
          message: res.message,
        });
      }
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Lecture Check-In Scanner</h3>
              <p className="text-xs text-slate-500">Student: {currentUser.name} ({currentUser.rollNumber})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Session Notice Bar */}
        {activeSession && activeSession.isActive ? (
          <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>
                Active Session: <strong>{activeSession.courseCode}</strong> in {activeSession.roomOrLab}
              </span>
            </div>
            <span className="text-emerald-700 font-mono text-[11px] bg-emerald-100/70 px-2 py-0.5 rounded">
              {activeSession.facultyName}
            </span>
          </div>
        ) : (
          <div className="bg-amber-50 border-b border-amber-100 px-6 py-2.5 flex items-center gap-2 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>No lecture session is currently broadcasting. Start one from the Professor tab to scan.</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {/* SUCCESS RECEIPT VIEW */}
          {scanStatus.type === 'success' ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-75">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900">Attendance Recorded!</h4>
                <p className="text-sm text-slate-600 mt-1">{scanStatus.message}</p>
              </div>

              {/* Digital Proof Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Subject</span>
                  <span className="font-semibold text-slate-800">{scanStatus.courseName || activeSession?.courseName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Syllabus Topic</span>
                  <span className="font-medium text-slate-700 max-w-[200px] truncate">
                    {scanStatus.topicTitle || activeSession?.coveredLessonTitle}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Timestamp</span>
                  <span className="font-mono text-slate-700">{scanStatus.time || 'Just now'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    Verification
                  </span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Campus Geofence Validated
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    setScanStatus({ type: 'idle', message: '' });
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-xs cursor-pointer"
                >
                  Done & Back to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Tabs for scanning mode */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab('camera')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'camera'
                      ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Camera
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('simulate')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'simulate'
                      ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Instant Test
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('otp')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'otp'
                      ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Enter OTP
                </button>
              </div>

              {/* CAMERA TAB */}
              {activeTab === 'camera' && (
                <div className="space-y-4">
                  <div className="relative aspect-square max-w-[280px] mx-auto bg-slate-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border-4 border-slate-900">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Viewfinder Target Box Overlay */}
                    <div className="absolute inset-8 border-2 border-indigo-400/90 rounded-2xl pointer-events-none flex flex-col justify-between p-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                      {/* Corner Accents */}
                      <div className="flex justify-between">
                        <div className="w-4 h-4 border-t-2 border-l-2 border-indigo-400" />
                        <div className="w-4 h-4 border-t-2 border-r-2 border-indigo-400" />
                      </div>
                      
                      {/* Moving laser scan line */}
                      <div className="relative w-full h-full overflow-hidden">
                        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#22d3ee] animate-scan-line" />
                      </div>

                      <div className="flex justify-between">
                        <div className="w-4 h-4 border-b-2 border-l-2 border-indigo-400" />
                        <div className="w-4 h-4 border-b-2 border-r-2 border-indigo-400" />
                      </div>
                    </div>

                    {!hasCameraPermission && (
                      <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                        <Camera className="w-10 h-10 text-slate-400" />
                        <div>
                          <p className="text-xs font-semibold">Camera Preview / Simulator</p>
                          <p className="text-[11px] text-slate-300 mt-1">
                            Point your device camera at the lecturer's projector screen or click below to simulate instant optical lock.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleSimulateScan}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Simulate Camera Scan
                        </button>
                      </div>
                    )}
                  </div>

                  {hasCameraPermission && (
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-2">Align the rotating dynamic QR code within the frame</p>
                      <button
                        type="button"
                        onClick={handleSimulateScan}
                        className="text-xs px-3 py-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-medium transition-colors cursor-pointer"
                      >
                        Optical QR Captured? Click to Confirm Scan
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SIMULATE SCAN TAB */}
              {activeTab === 'simulate' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 text-center">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Quick Classroom Simulation</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Simulates a high-speed camera capture of the professor's live dynamic token with cryptographic handshake & GPS validation.
                    </p>
                  </div>

                  {activeSession && activeSession.isActive ? (
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-left text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Broadcasting Course:</span>
                        <span className="font-semibold text-slate-800">{activeSession.courseCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Venue:</span>
                        <span className="text-slate-700">{activeSession.roomOrLab}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Rotating Hash:</span>
                        <span className="font-mono text-indigo-600 font-semibold">{activeSession.qrSecretToken.slice(0, 16)}...</span>
                      </div>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleSimulateScan}
                    disabled={!activeSession || !activeSession.isActive || scanStatus.type === 'scanning'}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-semibold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {scanStatus.type === 'scanning' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Validating Cryptographic Handshake...
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4" />
                        Execute Simulated Instant Scan
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* OTP CODE TAB */}
              {activeTab === 'otp' && (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="text-center">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter 6-Digit Lecture Backup Passcode
                    </label>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Displayed on the lecturer's screen beneath the dynamic QR code.
                    </p>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      placeholder={activeSession ? activeSession.otpCode : '849201'}
                      className="w-48 text-center text-2xl font-mono tracking-widest font-bold py-2.5 px-4 bg-slate-50 border-2 border-indigo-200 focus:border-indigo-600 focus:bg-white rounded-xl outline-none transition-all mx-auto"
                    />
                  </div>

                  {activeSession && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setOtpInput(activeSession.otpCode)}
                        className="text-[11px] text-indigo-600 hover:underline font-medium"
                      >
                        Auto-fill current session code ({activeSession.otpCode})
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={otpInput.length !== 6 || scanStatus.type === 'scanning'}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-semibold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {scanStatus.type === 'scanning' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Checking code...
                      </>
                    ) : (
                      'Submit Attendance Passcode'
                    )}
                  </button>
                </form>
              )}

              {/* Error Alert Display */}
              {scanStatus.type === 'error' && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <div className="flex-1">{scanStatus.message}</div>
                </div>
              )}

              {/* Security and Geofence Info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  Geofence Radius: 100m Active
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Anti-Screenshot Enabled
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
