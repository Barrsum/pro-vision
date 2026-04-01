import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Upload, Camera, Sun, Moon, Trash2, 
  Zap, Github, Linkedin, Maximize2, X, 
  Check, RefreshCw, SwitchCamera, ArrowRight
} from 'lucide-react';
import { analyzeImage } from './aiService';

export default function App() {
  // --- STATE ---
  const [theme, setTheme] = useState('dark');
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [quota, setQuota] = useState(null);
  
  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); 
  const [stream, setStream] = useState(null);

  // Refs
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // --- THEME EFFECT ---
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // --- CAMERA LOGIC ---
  const startCamera = async () => {
    try {
      if (stream) stream.getTracks().forEach(track => track.stop());
      
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode } 
      });
      setStream(newStream);
      setIsCameraActive(true);
      setImage(null);
      setResult('');
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setStream(null);
    setIsCameraActive(false);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  useEffect(() => {
    if (isCameraActive) startCamera();
  }, [facingMode]);

  useEffect(() => {
    if (isCameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isCameraActive]);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    
    setImage(dataUrl);
    stopCamera();
  };

  // --- FILE LOGIC ---
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setResult(''); 
      };
      reader.readAsDataURL(file);
    }
  };

  // --- AI LOGIC ---
  const runAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const data = await analyzeImage(image);
      setResult(data.text);
      if (data.quota) setQuota(data.quota);
    } catch (err) {
      setResult(`**Error:** ${err.message}`);
    }
    setLoading(false);
  };

  // --- STYLES CONFIG ---
  const s = theme === 'dark' ? {
    bg: 'bg-[#1c1c1c]', // Slightly lighter than pure black for separation
    bar: 'bg-[#000000]', // Pure black for Header/Footer to stand out
    text: 'text-white',
    panel: 'bg-[#0A0A0A] border border-[#222]',
    border: 'border-[#222]',
    buttonPrimary: 'bg-white text-black hover:bg-gray-200',
    buttonSecondary: 'bg-[#151515] border border-[#333] hover:bg-[#202020] text-white',
    footerBtn: 'bg-[#151515] border border-[#333] hover:border-white text-white',
  } : {
    bg: 'bg-[#F5F5F7]', 
    bar: 'bg-white', // Pure white for Header/Footer
    text: 'text-black',
    panel: 'bg-white border border-gray-200 shadow-sm',
    border: 'border-gray-200',
    buttonPrimary: 'bg-black text-white hover:bg-gray-800',
    buttonSecondary: 'bg-white border border-gray-200 hover:bg-gray-50 text-black',
    footerBtn: 'bg-white border border-gray-200 hover:border-black text-black',
  };

  return (
    <div className={`min-h-screen md:h-screen flex flex-col ${s.bg} ${s.text} transition-colors duration-300 font-sans md:overflow-hidden`}>
      
      {/* --- HEADER --- */}
      {/* Added {s.bar} to differentiate from main background */}
      <header className={`h-20 flex-none border-b ${s.border} ${s.bar} px-6 md:px-8 flex items-center justify-between z-20 bg-opacity-95 backdrop-blur-md sticky top-0 md:static`}>
        <div className="flex flex-col justify-center">
          <h1 className="font-display font-black text-xl md:text-2xl tracking-tighter leading-none">
            PRO.VISION
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${theme === 'dark' ? 'bg-green-500' : 'bg-green-600'}`}></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Made By Ram Bapat</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
           {quota && (
             <div className="hidden md:block text-right">
               <div className="text-[10px] font-bold uppercase tracking-widest opacity-50">Daily Quota</div>
               <div className="font-mono text-sm font-bold">{quota}</div>
             </div>
           )}
           <div className={`h-8 w-px ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'} mx-2 hidden md:block`} />
           <button 
             onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
             className={`p-3 rounded-full transition-all active:scale-95 ${s.buttonSecondary}`}
           >
             {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
           </button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col md:flex-row p-4 md:p-8 gap-6 md:overflow-hidden max-w-[1800px] mx-auto w-full">
        
        {/* === LEFT PANEL: VIEWPORT === */}
        <div className={`h-[500px] md:h-auto md:flex-1 flex flex-col rounded-2xl overflow-hidden relative ${s.panel} transition-all shadow-2xl shrink-0`}>
          
          {/* A. CAMERA VIEW */}
          {isCameraActive ? (
            <div className="absolute inset-0 bg-black flex items-center justify-center z-10 p-4">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-contain max-h-full rounded-lg" 
              />
              <div className="absolute top-6 right-6 flex flex-col gap-4">
                 <button onClick={stopCamera} className="p-3 bg-black/60 text-white rounded-full backdrop-blur-md hover:bg-red-500 transition-colors border border-white/10">
                   <X size={24} />
                 </button>
                 <button onClick={switchCamera} className="p-3 bg-black/60 text-white rounded-full backdrop-blur-md hover:bg-white/20 transition-colors border border-white/10">
                   <SwitchCamera size={24} />
                 </button>
              </div>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                 <button 
                   onClick={capturePhoto} 
                   className="group p-1.5 rounded-full border-4 border-white/30 hover:border-white transition-all scale-100 hover:scale-110"
                 >
                   <div className="w-16 h-16 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                 </button>
              </div>
            </div>
          ) 
          
          /* B. IMAGE PREVIEW */
          : image ? (
            <div className="w-full h-full relative bg-black/5 flex items-center justify-center p-4">
               <img src={image} className="max-w-full max-h-full object-contain shadow-lg" alt="Target" />
               <div className="absolute top-6 right-6">
                 <button 
                   onClick={() => { setImage(null); setResult(''); }}
                   className="p-3 rounded-full bg-black/60 text-white backdrop-blur hover:bg-red-600 transition-colors shadow-xl border border-white/10"
                 >
                   <Trash2 size={20} />
                 </button>
               </div>
            </div>
          ) 
          
          /* C. EMPTY STATE */
          : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <Maximize2 size={64} strokeWidth={1} className="mb-6 opacity-80" />
              <p className="font-mono text-xs font-bold uppercase tracking-[0.3em]">Viewport Empty</p>
            </div>
          )}

          {/* CONTROLS */}
          {!isCameraActive && (
            <div className={`p-6 border-t ${s.border} grid grid-cols-2 gap-4 mt-auto relative z-0 bg-opacity-50`}>
              <button 
                onClick={() => fileInputRef.current.click()}
                className={`py-4 rounded-xl font-bold uppercase tracking-wide text-sm flex items-center justify-center gap-3 transition-transform active:scale-95 ${s.buttonSecondary}`}
              >
                <Upload size={18} /> Upload
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

              <button 
                onClick={startCamera}
                className={`py-4 rounded-xl font-bold uppercase tracking-wide text-sm flex items-center justify-center gap-3 transition-transform active:scale-95 ${s.buttonSecondary}`}
              >
                <Camera size={18} /> Camera
              </button>
            </div>
          )}
        </div>


        {/* === RIGHT PANEL: INTELLIGENCE === */}
        <div className={`flex-1 flex flex-col rounded-2xl md:overflow-hidden ${s.panel} transition-all relative shadow-xl min-h-[400px]`}>
          
          {/* Scrollable Content */}
          <div className="flex-1 p-6 md:p-12 md:overflow-y-auto custom-scrollbar flex flex-col">
            
            {!image ? (
              // EMPTY STATE
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 md:space-y-8 animate-in fade-in duration-700">
                <div className={`p-6 md:p-8 rounded-full ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}>
                   <Upload className="opacity-80 w-8 h-8 md:w-12 md:h-12" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl md:text-5xl leading-tight mb-2 md:mb-4 tracking-tighter">
                    UPLOAD IMAGE<br/>
                    <span className="opacity-30">TO BEGIN</span>
                  </h2>
                  <div className="max-w-sm mx-auto space-y-4 md:space-y-12">
                    <p className="text-xs md:text-sm opacity-60 font-medium leading-relaxed">
                      Initialize the neural engine. Select a file or capture a photo to extract semantic visual data.
                    </p>
                    <p className="text-md md:text-md opacity-90 font-medium leading-relaxed">
                      - Made By Ram Bapat -
                    </p>
                  </div>
                </div>
              </div>
            ) : !result ? (
              // READY STATE
              <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300 py-12">
                 {loading ? (
                    <div className="w-full max-w-xs space-y-8">
                       <div className="relative mx-auto w-20 h-20">
                         <div className={`absolute inset-0 border-[6px] border-t-transparent rounded-full animate-spin ${theme === 'dark' ? 'border-white' : 'border-black'}`}></div>
                       </div>
                       <div className="space-y-2">
                         <h3 className="font-mono text-sm font-bold tracking-widest animate-pulse">PROCESSING DATA</h3>
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-8">
                       <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-green-500 text-white shadow-lg shadow-green-500/20">
                         <Check size={30} strokeWidth={3} />
                       </div>
                       
                       <div>
                         <h2 className="text-3xl font-bold tracking-tight mb-2">Target Locked</h2>
                         <p className="text-sm opacity-50">Ready to extract visual data.</p>
                       </div>

                       <button 
                         onClick={runAnalysis}
                         className={`px-12 py-5 rounded-xl text-lg font-black tracking-wide flex items-center gap-3 shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all ${s.buttonPrimary}`}
                       >
                         <Zap size={22} fill="currentColor" /> GENERATE DESCRIPTION
                       </button>
                    </div>
                 )}
              </div>
            ) : (
              // RESULT STATE
              <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="flex justify-between items-center mb-10 border-b border-current border-opacity-10 pb-4">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest opacity-50">Analysis Output</span>
                    <button onClick={() => setResult('')} className="text-xs font-bold opacity-40 hover:opacity-100 flex items-center gap-2 transition-opacity">
                       <RefreshCw size={12} /> RESET
                    </button>
                 </div>
                 
                 <ReactMarkdown 
                   components={{
                     h1: ({node, ...props}) => <h1 className="text-xl font-black mb-4 mt-8 tracking-tight" {...props} />,
                     h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-3 mt-6 opacity-90" {...props} />,
                     p: ({node, ...props}) => <p className="leading-relaxed mb-4 opacity-80" {...props} />,
                     strong: ({node, ...props}) => <strong className="font-bold underline decoration-2 decoration-current underline-offset-2 opacity-100" {...props} />,
                     ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-6 opacity-80" {...props} />
                   }}
                 >
                   {result}
                 </ReactMarkdown>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      {/* Added {s.bar} here too */}
      <footer className={`h-auto py-8 md:py-0 md:h-24 flex-none border-t ${s.border} ${s.bar} z-20 bg-opacity-95 backdrop-blur-md`}>
         <div className="h-full max-w-[1800px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
            
            <div className="flex flex-col justify-center text-center md:text-left">
               <span className="font-display font-bold text-lg leading-none">Made By Ram Bapat</span>
               <span className="text-[10px] font-mono uppercase tracking-widest opacity-50 mt-1">April 2026 ● Open Source ● Connect on Linkedin</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
               <a 
                 href="https://github.com/Barrsum/pro-vision" 
                 target="_blank" 
                 rel="noreferrer" 
                 className={`w-full md:w-auto px-6 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-1 shadow-sm ${s.footerBtn}`}
               >
                 <Github size={18} />
                 <span>GET CODE</span>
               </a>
               
               <a 
                 href="https://linkedin.com/in/ram-bapat-barrsum-diamos" 
                 target="_blank" 
                 rel="noreferrer" 
                 className={`w-full md:w-auto px-6 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-1 shadow-sm ${s.footerBtn}`}
               >
                 <Linkedin size={18} />
                 <span>CONNECT</span>
                 <ArrowRight size={16} className="opacity-50" />
               </a>
            </div>
         </div>
      </footer>

    </div>
  );
}

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos