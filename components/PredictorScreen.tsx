
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { User } from '../types';
import { usePrediction } from '../services/authService';
import Sidebar from './Sidebar';
import TestPostbackScreen from './TestPostbackScreen';
import GuideModal from './GuideModal';
import AdminAuthModal from './AdminAuthModal';
import { useLanguage } from '../contexts/LanguageContext';

interface PredictorScreenProps {
  user: User;
  onLogout: () => void;
}

// --- Icons ---

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const GuideIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

const RefreshIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

// Custom Star Icon - Filled style
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white drop-shadow-sm">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

// --- Limit Reached View ---

const LimitReachedView = React.memo(({ handleDepositRedirect }: { handleDepositRedirect: () => void; }) => {
  const { t } = useLanguage();

  return (
     <div 
        className="w-full h-screen flex flex-col font-poppins relative overflow-hidden items-center justify-center p-4 bg-[#0088ff]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0ea5e9] via-[#0284c7] to-[#0c4a6e] z-0"></div>

        <div className="w-full max-w-sm bg-[#082f49]/40 backdrop-blur-md rounded-2xl p-8 border border-[#38bdf8]/20 text-center shadow-2xl z-10">
            <h1 className="text-3xl font-russo uppercase text-white mb-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {t('reDepositMessageTitle')}
            </h1>
            <p className="text-white/90 font-poppins text-sm leading-relaxed mb-8">{t('limitReachedText')}</p>
            
            <button 
                onClick={handleDepositRedirect}
                className="w-full py-4 bg-gradient-to-r from-[#4ade80] to-[#16a34a] text-[#064e3b] font-russo text-xl uppercase rounded-xl transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-green-900/30 border-b-4 border-[#14532d] active:border-b-0 active:translate-y-1"
            >
                {t('depositNow')}
            </button>
        </div>
    </div>
  );
});

type GridItemType = 'empty' | 'star' | 'mine';

const PredictorView = React.memo((props: {
    onOpenSidebar: () => void;
    onOpenGuide: () => void;
    gridState: GridItemType[];
    selectedTraps: number;
    setSelectedTraps: (val: number) => void;
    isSignalActive: boolean; 
    onGetSignal: () => void;
    onRefresh: () => void;
    confidence: number | null;
    isLoading: boolean;
}) => {
    const { t } = useLanguage();
    const [isMinesMenuOpen, setIsMinesMenuOpen] = useState(false);
    const minesMenuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (minesMenuRef.current && !minesMenuRef.current.contains(event.target as Node)) {
                setIsMinesMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMinesMenu = () => {
        if (!props.isSignalActive) {
            setIsMinesMenuOpen(!isMinesMenuOpen);
        }
    };

    const handleSelectMines = (count: number) => {
        props.setSelectedTraps(count);
        setIsMinesMenuOpen(false);
    };
    
    return (
        <div className="w-full min-h-screen flex flex-col relative font-poppins overflow-hidden bg-[#0066cc]">
            {/* Background */}
            <div className="absolute inset-0 bg-[#0080ff] z-0"></div>

            {/* Top Bar (Guide & Menu) */}
            <header className="absolute top-0 right-0 p-5 z-20 flex gap-3">
                <button onClick={props.onOpenGuide} className="p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition active:scale-90" aria-label={t('openGuide')}>
                    <GuideIcon className="w-7 h-7 drop-shadow-md" />
                </button>
                <button onClick={props.onOpenSidebar} className="p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition active:scale-90" aria-label={t('openMenu')}>
                    <MenuIcon className="w-7 h-7 drop-shadow-md" />
                </button>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 z-10 relative space-y-6">
                
                {/* Mines Selector & Switch Button Group */}
                <div className="flex flex-col items-center gap-3 w-full relative z-30 mt-10">
                    
                    {/* Mines Dropdown Button */}
                    <div className="relative" ref={minesMenuRef}>
                        <button
                            onClick={toggleMinesMenu}
                            disabled={props.isSignalActive}
                            className={`
                                flex items-center justify-between gap-3 px-6 py-2 bg-[#003366] rounded-full text-white font-russo text-lg uppercase tracking-wide shadow-lg border border-[#004080]
                                ${props.isSignalActive ? 'opacity-70 cursor-not-allowed' : 'active:scale-95 cursor-pointer'}
                            `}
                        >
                            <span>MINES: {props.selectedTraps}</span>
                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${isMinesMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isMinesMenuOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#003366] border border-[#004080] rounded-xl overflow-hidden shadow-xl flex flex-col animate-fade-in z-40">
                                {[1, 3, 5].map((count) => (
                                    <button
                                        key={count}
                                        onClick={() => handleSelectMines(count)}
                                        className={`py-3 font-russo text-white hover:bg-[#004080] transition-colors ${props.selectedTraps === count ? 'bg-[#004080]' : ''}`}
                                    >
                                        MINES {count}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Switch Multiple Button (Visual Only) */}
                    <button className="px-8 py-2 bg-[#ff9900] rounded-full text-white font-russo text-sm uppercase tracking-wide shadow-md transform hover:brightness-110 transition cursor-default">
                        SWITCH MULTIPLE
                    </button>
                </div>

                {/* 5x5 Grid */}
                <div className="w-full aspect-square max-w-[340px] grid grid-cols-5 grid-rows-5 gap-2.5">
                    {props.gridState.map((item, index) => (
                        <div 
                            key={index}
                            className={`
                                relative w-full h-full rounded-lg shadow-sm flex items-center justify-center
                                ${item === 'star' 
                                    ? 'bg-[#ffaa00] border-b-4 border-[#cc8800]' // Orange for Stars
                                    : 'bg-[#003366] border-b-4 border-[#002244]' // Dark Blue for Empty
                                }
                            `}
                        >
                            {item === 'empty' || item === 'mine' ? (
                                <div className="w-4 h-4 rounded-full bg-[#002244]/50 shadow-inner"></div>
                            ) : (
                                <div className="w-4/5 h-4/5 animate-pop-in">
                                    <StarIcon />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom Controls */}
                <div className="w-full max-w-[340px] flex items-center gap-4 mt-4">
                    {/* Refresh Button - Circular Blue */}
                    <button
                        onClick={props.onRefresh}
                        disabled={!props.isSignalActive}
                        className={`
                            w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all transform border-b-4
                            ${props.isSignalActive 
                                ? 'bg-[#0055aa] border-[#003366] text-white hover:scale-105 active:scale-95 active:border-b-0 active:translate-y-1' 
                                : 'bg-[#002244] border-[#001122] text-white/30 cursor-not-allowed'}
                        `}
                    >
                        <RefreshIcon className={`w-8 h-8 ${props.isSignalActive ? 'animate-spin-once' : ''}`} />
                    </button>

                    {/* Get Signal Button - Wide Green */}
                    <button
                        onClick={props.onGetSignal}
                        disabled={props.isSignalActive || props.isLoading}
                        className={`
                            flex-1 h-16 rounded-full font-russo text-2xl uppercase tracking-wider shadow-lg transition-all transform border-b-4 flex items-center justify-center
                            ${!props.isSignalActive && !props.isLoading
                                ? 'bg-[#33cc33] border-[#228822] text-white hover:brightness-110 active:scale-95 active:border-b-0 active:translate-y-1'
                                : 'bg-[#002244] border-[#001122] text-white/30 cursor-not-allowed'}
                        `}
                    >
                        {props.isLoading ? (
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-0"></div>
                                <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-150"></div>
                                <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-300"></div>
                            </div>
                        ) : (
                            t('getSignal')
                        )}
                    </button>
                </div>

            </main>
            
            <style>{`
                @keyframes pop-in {
                    0% { transform: scale(0); opacity: 0; }
                    60% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1); }
                }
                .animate-pop-in {
                    animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                @keyframes spin-once {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-once {
                    animation: spin-once 0.5s ease-out;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
});

const PredictorScreen: React.FC<PredictorScreenProps> = ({ user, onLogout }) => {
  const [predictionsLeft, setPredictionsLeft] = useState(user.predictionsLeft);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('predictor'); // 'predictor' or 'testPostback'
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const { t } = useLanguage();

  // Mines Specific State
  const [selectedTraps, setSelectedTraps] = useState<number>(1); // Default to 1 trap
  const [gridState, setGridState] = useState<GridItemType[]>(Array(25).fill('empty'));
  const [isSignalActive, setIsSignalActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const storedPic = localStorage.getItem(`profile_pic_${user.playerId}`);
    if (storedPic) {
      setProfilePic(storedPic);
    } else {
      setProfilePic(null);
    }
  }, [user.playerId]);
  
  const handleProfilePictureChange = useCallback((newPicUrl: string) => {
    setProfilePic(newPicUrl);
  }, []);

  // Logic to generate Mines signal
  const handleGetSignal = useCallback(async () => {
    if (isSignalActive || predictionsLeft <= 0 || isLoading) return;

    setIsLoading(true);

    try {
      // 1. Consume Prediction via API
      const result = await usePrediction(user.playerId);
      if (!result.success) {
        alert(`${t('errorLabel')}: ${result.message || t('couldNotUsePrediction')}`);
        setIsLoading(false);
        return;
      }
      
      setPredictionsLeft(prev => prev - 1);

      // 2. Generate Grid Logic
      // Random 70-99% confidence
      const randomConfidence = Math.floor(Math.random() * (99 - 70 + 1)) + 70;
      const totalCells = 25;
      let newGrid: GridItemType[] = Array(totalCells).fill('empty');

      if (selectedTraps === 1) {
        // Special logic for 1 Trap: Randomly reveal 5 cells
        const allIndices = Array.from({ length: totalCells }, (_, i) => i);
        
        // Shuffle indices
        for (let i = allIndices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
        }

        const selectedIndices = allIndices.slice(0, 5);
        
        newGrid = newGrid.map((_, index) => {
          if (selectedIndices.includes(index)) return 'star';
          return 'empty';
        });

      } else {
        // Existing logic for other trap counts (3, 5, etc.)
        const numberOfMines = selectedTraps;
        const allIndices = Array.from({ length: totalCells }, (_, i) => i);
        
        // Shuffle indices securely
        for (let i = allIndices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
        }

        const mineIndices = allIndices.slice(0, numberOfMines);
        
        newGrid = newGrid.map((_, index) => {
          if (mineIndices.includes(index)) return 'mine'; // Boom
          return 'star'; // Rest are stars
        });
      }

      // Simulate network delay for realism
      setTimeout(() => {
          setGridState(newGrid);
          setConfidence(randomConfidence);
          setIsSignalActive(true); // This locks Get Signal and unlocks Refresh
          setIsLoading(false);
      }, 600);

    } catch (error) {
       console.error("Failed to get signal:", error);
       alert(t('unexpectedErrorSignal'));
       setIsLoading(false);
    }
  }, [user.playerId, isSignalActive, predictionsLeft, isLoading, t, selectedTraps]);
  
  // Logic to reset the grid (Refresh button)
  const handleRefresh = useCallback(() => {
    setGridState(Array(25).fill('empty'));
    setIsSignalActive(false); // This unlocks Get Signal and locks Refresh
    setConfidence(null);
  }, []);

  const handleDepositRedirect = useCallback(async () => {
    try {
        const response = await fetch('/api/get-affiliate-link');
        const data = await response.json();
        if (response.ok && data.success) {
            if (window.top) {
                window.top.location.href = data.link;
            } else {
                window.location.href = data.link;
            }
        } else {
            alert(data.message || t('depositLinkNotAvailable'));
        }
    } catch (error) {
        console.error('Failed to fetch deposit link:', error);
        alert(t('unexpectedErrorOccurred'));
    }
  }, [t]);
  
  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const handleNavigate = useCallback((view: string) => { setCurrentView(view); setIsSidebarOpen(false); }, []);
  const handleTestPostbackClick = useCallback(() => { setIsSidebarOpen(false); setShowAdminModal(true); }, []);
  const handleAdminSuccess = useCallback(() => { setShowAdminModal(false); setCurrentView('testPostback'); }, []);
  const handleAdminClose = useCallback(() => setShowAdminModal(false), []);
  const handleBackToPredictor = useCallback(() => setCurrentView('predictor'), []);

  if (predictionsLeft <= 0 && !isLoading) {
    return <LimitReachedView handleDepositRedirect={handleDepositRedirect} />;
  }
  
  return (
    <div className="w-full min-h-screen bg-gray-900">
      {isGuideOpen && <GuideModal onClose={() => setIsGuideOpen(false)} />}
      {showAdminModal && <AdminAuthModal onSuccess={handleAdminSuccess} onClose={handleAdminClose} />}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        isLoggedIn={true}
        playerId={user.playerId}
        onProfilePictureChange={handleProfilePictureChange}
        onTestPostbackClick={handleTestPostbackClick}
      />
      {currentView === 'predictor' && (
        <PredictorView 
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
            gridState={gridState}
            selectedTraps={selectedTraps}
            setSelectedTraps={setSelectedTraps}
            isSignalActive={isSignalActive}
            onGetSignal={handleGetSignal}
            onRefresh={handleRefresh}
            confidence={confidence}
            isLoading={isLoading}
        />
      )}
      {currentView === 'testPostback' && 
        <TestPostbackScreen onBack={handleBackToPredictor} />
      }
    </div>
  );
};

export default React.memo(PredictorScreen);
