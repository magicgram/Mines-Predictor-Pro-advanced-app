
import React, { useState, useCallback, useEffect } from 'react';
import { verifyUser, VerificationResponse } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';

// --- Icons ---

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const GuideIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);

const GamepadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const RefreshIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
  </svg>
);

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l13.96 7.376c1.268.67 1.268 2.514 0 3.184l-13.96 7.376c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-sm">
    <path 
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
        fill="#ffffff" 
        stroke="none"
    />
  </svg>
);


const DepositMessage: React.FC<{
  onBack: () => void;
  onRegister: () => void;
  isRegistering: boolean;
}> = React.memo(({ onBack, onRegister, isRegistering }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-sm mx-auto text-white text-center animate-fade-in-up">
      <h2 className="text-2xl font-russo font-bold mb-4">{t('depositMessageTitle')}</h2>
      <div className="mb-6 font-poppins space-y-3 text-gray-200 text-sm">
          <p>{t('depositMessageSync')}</p>
          <p>{t('depositMessageDeposit')}</p>
          <p>{t('depositMessageAccess')}</p>
      </div>
      <div className="space-y-4">
        <button
          onClick={onRegister}
          disabled={isRegistering}
          className="w-full py-3 px-4 min-h-[56px] h-auto whitespace-normal break-words leading-tight bg-gradient-to-r from-[#4ade80] to-[#16a34a] text-[#064e3b] font-poppins font-bold text-lg uppercase rounded-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 shadow-lg shadow-black/30 border-b-4 border-[#14532d] active:border-b-0 active:translate-y-1 flex items-center justify-center"
        >
          {isRegistering ? (
            <div className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#064e3b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('redirecting')}...
            </div>
          ) : (
             <span>{t('depositAndGetAccess').toUpperCase()}</span>
          )}
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 px-4 min-h-[56px] h-auto whitespace-normal break-words leading-tight bg-[#083344]/50 border-2 border-[#38bdf8]/50 text-white font-poppins font-bold text-lg uppercase rounded-xl transition-colors hover:bg-[#083344]/80 flex items-center justify-center"
        >
          {t('back').toUpperCase()}
        </button>
      </div>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
});

const ReDepositMessage: React.FC<{
  onBack: () => void;
  onRegister: () => void;
  isRegistering: boolean;
}> = React.memo(({ onBack, onRegister, isRegistering }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-sm mx-auto text-white text-center animate-fade-in-up">
      <h2 className="text-2xl font-russo font-bold mb-4">{t('reDepositMessageTitle')}</h2>
      <p className="mb-6 font-poppins text-gray-200 text-sm">{t('reDepositMessageContinue')}</p>
      <div className="space-y-4">
        <button
          onClick={onRegister}
          disabled={isRegistering}
          className="w-full py-3 px-4 min-h-[56px] h-auto whitespace-normal break-words leading-tight bg-gradient-to-r from-[#4ade80] to-[#16a34a] text-[#064e3b] font-poppins font-bold text-lg uppercase rounded-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 shadow-lg shadow-black/30 border-b-4 border-[#14532d] active:border-b-0 active:translate-y-1 flex items-center justify-center"
        >
          {isRegistering ? (
            <div className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#064e3b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('redirecting')}...
            </div>
          ) : (
            <span>{t('depositAgain').toUpperCase()}</span>
          )}
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 px-4 min-h-[56px] h-auto whitespace-normal break-words leading-tight bg-[#083344]/50 border-2 border-[#38bdf8]/50 text-white font-poppins font-bold text-lg uppercase rounded-xl transition-colors hover:bg-[#083344]/80 flex items-center justify-center"
        >
          {t('back').toUpperCase()}
        </button>
      </div>
    </div>
  );
});

// --- Demo View Component ---
type GridItemType = 'empty' | 'star';
const DEMO_LIMIT_KEY = 'demo_prediction_count';

const DemoView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [gridState, setGridState] = useState<GridItemType[]>(Array(25).fill('empty'));
    const [isSignalActive, setIsSignalActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [demoAttempts, setDemoAttempts] = useState(0);
    const { t } = useLanguage();

    // Initial load of demo attempts
    useEffect(() => {
        const stored = localStorage.getItem(DEMO_LIMIT_KEY);
        if (stored) {
            setDemoAttempts(parseInt(stored, 10));
        }
    }, []);

    const handleGetSignal = () => {
        if (isSignalActive || isLoading) return;

        if (demoAttempts >= 2) {
            setShowLoginPrompt(true);
            return;
        }

        setIsLoading(true);

        // Generate Grid Logic for 1 Trap (Randomly reveal 5 cells)
        const totalCells = 25;
        let newGrid: GridItemType[] = Array(totalCells).fill('empty');
        const allIndices = Array.from({ length: totalCells }, (_, i) => i);
        // Shuffle indices
        for (let i = allIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
        }
        const selectedIndices = allIndices.slice(0, 5);
        newGrid = newGrid.map((_, index) => selectedIndices.includes(index) ? 'star' : 'empty');

        setTimeout(() => {
            setGridState(newGrid);
            setIsSignalActive(true);
            setIsLoading(false);
            
            // Increment usage
            const newCount = demoAttempts + 1;
            setDemoAttempts(newCount);
            localStorage.setItem(DEMO_LIMIT_KEY, newCount.toString());
        }, 600);
    };

    const handleRefresh = () => {
        setGridState(Array(25).fill('empty'));
        setIsSignalActive(false);
    };

    const handleTrapClick = () => {
        setShowLoginPrompt(true);
    };

    return (
        <div className="w-full h-full flex flex-col items-center relative animate-fade-in-up">
            {/* Header */}
            <div className="w-full flex justify-center items-center mb-6 relative">
                 <h1 className="text-3xl font-russo text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] to-[#cceeff] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] tracking-wide">
                    {t('demoMode')}
                </h1>
                <button 
                    onClick={onExit}
                    className="absolute right-0 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Grid */}
            <div className="bg-[#082f49]/40 p-3 rounded-2xl border border-[#bae6fd]/20 shadow-2xl backdrop-blur-sm w-full aspect-square max-w-[320px] mb-6">
                <div className="grid grid-cols-5 grid-rows-5 gap-2 w-full h-full">
                    {gridState.map((item, index) => (
                        <div 
                            key={index}
                            className={`
                                relative w-full h-full rounded-lg flex items-center justify-center overflow-hidden
                                border-t border-l border-r border-b-[4px]
                                ${item === 'star' 
                                    ? 'bg-gradient-to-b from-[#fbbf24] to-[#f59e0b] border-t-[#ffffff]/50 border-l-[#fcd34d] border-r-[#fcd34d] border-b-[#b45309]' 
                                    : 'bg-[#0c4a6e] border-t-[#38bdf8]/30 border-l-[#38bdf8]/10 border-r-[#38bdf8]/10 border-b-[#062c44]'
                                }
                            `}
                        >
                            {item === 'empty' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]/40 shadow-inner"></div>
                            )}
                            {item === 'star' && (
                                <div className="w-[65%] h-[65%] flex items-center justify-center animate-pop-in">
                                    <StarIcon />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Traps */}
            <div className="flex justify-between w-full max-w-[320px] gap-3 mb-5">
                <button className="flex-1 py-2 rounded-full font-russo text-sm tracking-wider bg-[#0ea5e9] border border-white/50 text-white shadow-[0_0_15px_rgba(14,165,233,0.6)] scale-105">
                    1 {t('trap')}
                </button>
                <button onClick={handleTrapClick} className="flex-1 py-2 rounded-full font-russo text-sm tracking-wider bg-[#0c4a6e] border border-[#075985] text-gray-400 hover:bg-[#0f5c85] opacity-60">
                    3 {t('traps')}
                </button>
                <button onClick={handleTrapClick} className="flex-1 py-2 rounded-full font-russo text-sm tracking-wider bg-[#0c4a6e] border border-[#075985] text-gray-400 hover:bg-[#0f5c85] opacity-60">
                    5 {t('traps')}
                </button>
            </div>

            {/* Buttons */}
             <div className="w-full max-w-[320px] flex gap-3 mb-5 min-h-[56px] h-auto items-stretch">
                <button
                    onClick={handleRefresh}
                    disabled={!isSignalActive}
                    className={`min-h-[56px] h-auto w-[56px] rounded-2xl flex items-center justify-center border-b-4 transition-all flex-shrink-0
                        ${isSignalActive 
                            ? 'bg-[#3b82f6] border-[#1d4ed8] text-white shadow-lg active:border-b-0 active:translate-y-1 hover:brightness-110 cursor-pointer' 
                            : 'bg-[#1e293b] border-[#0f172a] text-gray-600 cursor-not-allowed'}
                    `}
                >
                    <RefreshIcon className={`w-7 h-7 ${isSignalActive ? 'animate-spin-once' : ''}`} />
                </button>

                <button
                    onClick={handleGetSignal}
                    disabled={isSignalActive || isLoading}
                    className={`
                        flex-1 min-h-[56px] h-auto py-2 px-2 rounded-2xl flex items-center justify-center gap-2 font-russo text-xl tracking-wide border-b-4 transition-all shadow-xl whitespace-normal break-words leading-tight
                        ${!isSignalActive && !isLoading
                            ? 'bg-gradient-to-r from-[#4ade80] to-[#16a34a] border-[#14532d] text-[#064e3b] hover:brightness-110 active:border-b-0 active:translate-y-1'
                            : 'bg-[#1e293b] border-[#0f172a] text-gray-500 cursor-not-allowed'}
                    `}
                >
                    {isLoading ? (
                         <div className="flex space-x-1">
                            <div className="w-2.5 h-2.5 bg-current rounded-full animate-bounce delay-0"></div>
                            <div className="w-2.5 h-2.5 bg-current rounded-full animate-bounce delay-150"></div>
                            <div className="w-2.5 h-2.5 bg-current rounded-full animate-bounce delay-300"></div>
                        </div>
                    ) : (
                         <>
                            <PlayIcon className="w-7 h-7 flex-shrink-0" />
                            <span>{t('getSignal')}</span>
                        </>
                    )}
                </button>
            </div>

            {/* Login Prompt Modal */}
            {showLoginPrompt && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm rounded-xl">
                    <div className="w-full max-w-xs bg-[#082f49] border border-[#38bdf8]/30 rounded-2xl p-6 relative shadow-2xl animate-fade-in-up">
                         <button 
                            onClick={() => setShowLoginPrompt(false)}
                            className="absolute top-3 right-3 text-white/50 hover:text-white"
                         >
                            <CloseIcon className="w-5 h-5" />
                         </button>
                         <h3 className="text-xl font-russo text-white text-center mb-2">{t('lockedFeature')}</h3>
                         <p className="text-gray-300 text-center font-poppins text-sm mb-6">
                            {t('loginToUnlockTraps')}
                         </p>
                         <button
                            onClick={onExit}
                            className="w-full py-3 px-4 min-h-[50px] h-auto whitespace-normal break-words leading-tight bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-poppins font-bold text-sm uppercase rounded-xl shadow-lg border-b-4 border-[#1e40af] active:border-b-0 active:translate-y-1 hover:brightness-110"
                         >
                            {t('getPrediction')}
                         </button>
                    </div>
                </div>
            )}
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
            `}</style>
        </div>
    );
};

// --- End Demo View ---


interface LoginScreenProps {
  onLoginSuccess: (playerId: string, predictionsLeft: number) => void;
  onOpenSidebar: () => void;
  onOpenGuide: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ 
    onLoginSuccess,
    onOpenSidebar,
    onOpenGuide 
}) => {
  const [playerId, setPlayerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsDeposit, setNeedsDeposit] = useState(false);
  const [needsReDeposit, setNeedsReDeposit] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState<Record<string, number>>({});
  
  // Demo State
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoUsedExceeded, setDemoUsedExceeded] = useState(false);

  const { t } = useLanguage();

  const handleContinue = async () => {
    setIsLoading(true);
    setError(null);
    setNeedsDeposit(false);
    setNeedsReDeposit(false);
    
    const idToVerify = playerId;

    try {
        const response: VerificationResponse = await verifyUser(idToVerify);
        if (response.success && typeof response.predictionsLeft !== 'undefined') {
            onLoginSuccess(idToVerify, response.predictionsLeft);
        } else {
            setPlayerId(''); // Clear input on failure
            if (response.status === 'NEEDS_DEPOSIT') {
                setNeedsDeposit(true);
            } else if (response.status === 'NEEDS_REDEPOSIT') {
                setNeedsReDeposit(true);
            } else if (response.status === 'NOT_REGISTERED') {
                const currentAttempts = loginAttempts[idToVerify] || 0;
                const newAttemptsCount = currentAttempts + 1;
                setLoginAttempts(prev => ({ ...prev, [idToVerify]: newAttemptsCount }));

                if (newAttemptsCount >= 3) {
                    setError(t('noRegistrationFoundAfterAttempts'));
                } else {
                    setError(t('notRegisteredError'));
                }
            } else {
                 if (response.success) {
                    setError(t('loginFailedNoCount'));
                } else {
                    setError(response.message || t('unexpectedErrorOccurred'));
                }
            }
        }
    } catch (err) {
        setPlayerId('');
        setError(t('unexpectedErrorOccurred'));
        console.error("Login attempt failed:", err);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleRegister = useCallback(async () => {
    setIsRegistering(true);
    setError(null); // Clear previous errors
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
        setError(data.message || t('registrationLinkNotAvailable'));
        setIsRegistering(false);
      }
    } catch (error) {
      console.error('Failed to fetch registration link:', error);
      setError(t('unexpectedErrorOccurred'));
      setIsRegistering(false);
    }
  }, [t]);

  const handleBackFromDeposit = useCallback(() => setNeedsDeposit(false), []);
  const handleBackFromReDeposit = useCallback(() => setNeedsReDeposit(false), []);

  const handleDemoClick = () => {
      // Check limits before opening
      const stored = localStorage.getItem(DEMO_LIMIT_KEY);
      const attempts = stored ? parseInt(stored, 10) : 0;
      
      if (attempts >= 2) {
          setError(t('demoLimitReached'));
          return;
      }
      setIsDemoMode(true);
      setError(null);
  };

  const handleExitDemo = () => {
      setIsDemoMode(false);
  };

  // Image URL for the login screen
  const loginImgSrc = "https://i.postimg.cc/yNGG1XNC/1.webp";

  return (
    <div 
        className="w-full min-h-screen flex flex-col items-center justify-between p-4 relative overflow-hidden font-poppins bg-[#0088ff]" 
    >
      {/* Gradient Background matching reference */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0ea5e9] via-[#0284c7] to-[#0c4a6e] z-0"></div>

      {/* Top Bar */}
      <div className="absolute top-6 left-4 z-30">
        {!isDemoMode && !needsDeposit && !needsReDeposit && (
             <button 
                onClick={handleDemoClick}
                className="p-2 px-3 rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40 flex items-center gap-2 font-russo text-sm" 
                aria-label="Demo Mode"
            >
                <GamepadIcon className="w-5 h-5" />
                <span>{t('demo')}</span>
            </button>
        )}
      </div>

      <div className="absolute top-6 right-4 flex items-center space-x-2 z-30">
        <button onClick={onOpenGuide} className="p-2 rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40" aria-label="Open Guide">
            <GuideIcon className="w-6 h-6" />
        </button>
        <button onClick={onOpenSidebar} className="p-2 rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40" aria-label="Open Menu">
            <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      <main className="flex flex-col items-center justify-center flex-grow w-full max-w-sm text-center z-20">
        {isDemoMode ? (
            <DemoView onExit={handleExitDemo} />
        ) : needsDeposit ? (
            <div className="w-full bg-[#082f49]/40 backdrop-blur-md rounded-2xl p-6 md:p-8 text-white border border-[#38bdf8]/20 shadow-2xl">
              <DepositMessage onBack={handleBackFromDeposit} onRegister={handleRegister} isRegistering={isRegistering} />
            </div>
        ) : needsReDeposit ? (
            <div className="w-full bg-[#082f49]/40 backdrop-blur-md rounded-2xl p-6 md:p-8 text-white border border-[#38bdf8]/20 shadow-2xl">
              <ReDepositMessage onBack={handleBackFromReDeposit} onRegister={handleRegister} isRegistering={isRegistering} />
            </div>
        ) : (
          <>
            <div className="relative w-48 h-48 mb-4 mx-auto">
              <img 
                src={loginImgSrc} 
                alt={t('unlockPredictions')} 
                className="w-full h-full object-contain relative z-10" 
                style={{filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.4))'}} 
                draggable="false" 
                onContextMenu={(e) => e.preventDefault()}
              />
              <div 
                className="shine-mask z-20" 
                style={{
                  maskImage: `url(${loginImgSrc})`,
                  WebkitMaskImage: `url(${loginImgSrc})`
                }}
              />
            </div>
            
            <h1 className="text-4xl font-russo uppercase text-white tracking-wider mx-auto max-w-[260px] leading-none" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>{t('unlockPredictions')}</h1>
            <p className="text-sm font-poppins font-light text-white/80 mt-2 mb-8 uppercase tracking-wide">{t('enterPlayerIdToSync')}</p>
            
            <div className="w-full space-y-5">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-[#38bdf8]/70" />
                    </div>
                    <input
                        id="playerId"
                        type="text"
                        value={playerId}
                        onChange={(e) => setPlayerId(e.target.value)}
                        placeholder={t('playerIdLabel')}
                        className="w-full pl-12 pr-5 py-3 bg-[#083344]/60 border border-[#38bdf8]/30 text-white placeholder-gray-400 font-poppins text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition shadow-inner"
                    />
                </div>

                <button
                    onClick={handleContinue}
                    disabled={isLoading || !playerId}
                    className="w-full py-3 px-4 min-h-[56px] h-auto whitespace-normal break-words leading-tight bg-gradient-to-r from-[#4ade80] to-[#16a34a] text-[#064e3b] font-poppins font-bold text-lg uppercase rounded-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 shadow-lg shadow-black/30 border-b-4 border-[#14532d] active:border-b-0 active:translate-y-1 flex items-center justify-center"
                >
                    {isLoading ? (
                        <div className="flex justify-center items-center h-[28px]">
                            <svg className="animate-spin h-5 w-5 text-[#064e3b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : (
                       t('continue')
                    )}
                </button>
            </div>

            <p className="text-center text-xs text-white/80 font-poppins pt-8">{t('dontHaveAccount')}</p>
            
            <div className="w-full mt-2">
              <button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="w-full py-3 px-4 min-h-[56px] h-auto whitespace-normal break-words leading-tight bg-[#083344]/50 border-2 border-[#38bdf8]/50 text-white font-poppins font-bold text-lg uppercase rounded-xl transition-all hover:bg-[#083344]/80 disabled:opacity-50 flex items-center justify-center"
              >
                {isRegistering ? (
                    <div className="flex justify-center items-center h-[28px]">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : (
                   t('registerHere').toUpperCase()
                )}
              </button>
            </div>

            {error && (
                <div className="w-full mt-4 p-3 text-center text-sm bg-red-500/50 text-white border border-red-400/50 font-poppins rounded-lg">
                    {error}
                </div>
            )}
          </>
        )}
      </main>

      {!isDemoMode && <p className="text-white/50 text-sm font-poppins z-20 pb-2">v15.9.0</p>}
    </div>
  );
};

export default LoginScreen;
