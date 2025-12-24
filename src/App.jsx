import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Home, Star, Timer, Trophy, ArrowRight, ArrowLeft } from 'lucide-react';

// --- 데이터 (8급 기초 한자 예시) ---
const HANJA_DATA = [
  { id: 1, char: '日', sound: '날', meaning: '일' },
  { id: 2, char: '月', sound: '달', meaning: '월' },
  { id: 3, char: '山', sound: '메', meaning: '산' },
  { id: 4, char: '川', sound: '내', meaning: '천' },
  { id: 5, char: '木', sound: '나무', meaning: '목' },
  { id: 6, char: '火', sound: '불', meaning: '화' },
  { id: 7, char: '水', sound: '물', meaning: '수' },
  { id: 8, char: '金', sound: '쇠', meaning: '금' },
];

// --- 유틸리티: Hanzi Writer 스크립트 로드 ---
const useHanziWriterScript = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.HanziWriter) {
      setLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, []);

  return loaded;
};

// --- 컴포넌트: 메인 화면 ---
const MainMenu = ({ onStartPractice, onStartGame }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in p-6">
    <div className="text-center space-y-2 mb-4">
      <div className="inline-block bg-yellow-300 rounded-full px-6 py-2 mb-2 shadow-sm transform -rotate-2">
        <span className="text-yellow-800 font-bold text-lg">초등 필수 8급</span>
      </div>
      <h1 className="text-6xl font-black text-blue-600 tracking-tighter drop-shadow-sm stroke-text">
        한자<br/>척척박사
      </h1>
      <p className="text-xl text-gray-500 font-bold mt-4">재미있게 배우고 신나게 놀자!</p>
    </div>
    
    <div className="grid grid-cols-1 gap-5 w-full">
      <button 
        onClick={onStartPractice}
        className="group relative bg-white border-b-8 border-blue-200 rounded-3xl p-6 hover:bg-blue-50 hover:border-blue-300 hover:translate-y-1 active:border-b-0 active:translate-y-2 transition-all duration-150 shadow-lg flex items-center gap-6"
      >
        <div className="bg-blue-100 p-4 rounded-2xl group-hover:scale-110 transition-transform">
          <Star size={40} className="text-blue-500 fill-current" />
        </div>
        <div className="text-left">
          <h2 className="text-2xl font-bold text-gray-800">따라 쓰기</h2>
          <p className="text-gray-500 text-sm">순서대로 쓱쓱 그려봐요</p>
        </div>
      </button>

      <button 
        onClick={onStartGame}
        className="group relative bg-white border-b-8 border-green-200 rounded-3xl p-6 hover:bg-green-50 hover:border-green-300 hover:translate-y-1 active:border-b-0 active:translate-y-2 transition-all duration-150 shadow-lg flex items-center gap-6"
      >
        <div className="bg-green-100 p-4 rounded-2xl group-hover:scale-110 transition-transform">
          <Trophy size={40} className="text-green-500 fill-current" />
        </div>
        <div className="text-left">
          <h2 className="text-2xl font-bold text-gray-800">짝꿍 게임</h2>
          <p className="text-gray-500 text-sm">한자와 뜻을 맞춰봐요</p>
        </div>
      </button>
    </div>
  </div>
);

// --- 컴포넌트: 쓰기 연습 모드 ---
const PracticeMode = ({ onBack, isScriptLoaded }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const writerRef = useRef(null);
  const containerRef = useRef(null);
  const [feedback, setFeedback] = useState("");

  const currentHanja = HANJA_DATA[currentIndex];

  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current) return;

    containerRef.current.innerHTML = '';

    const writer = window.HanziWriter.create(containerRef.current, currentHanja.char, {
      width: 260,
      height: 260,
      padding: 20,
      showOutline: true,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 200,
      strokeColor: '#2563EB', // blue-600
      radicalColor: '#16A34A', // green-600
      outlineColor: '#E2E8F0', // gray-200
    });

    writerRef.current = writer;
    
    writer.quiz({
      onMistake: function(strokeData) {
        setFeedback("앗! 순서가 틀렸어요 😅");
        writer.animateStroke(strokeData.strokeNum); 
      },
      onCorrectStroke: function(strokeData) {
        setFeedback("잘하고 있어요! 👍");
      },
      onComplete: function(summaryData) {
        setFeedback("참 잘했어요! 완벽해요! 🎉");
      }
    });

  }, [currentIndex, isScriptLoaded, currentHanja.char]);

  const handleNext = () => {
    if (currentIndex < HANJA_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setFeedback("");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setFeedback("");
    }
  };

  const animateCharacter = () => writerRef.current?.animateCharacter();
  const resetQuiz = () => {
    setFeedback("");
    writerRef.current?.quiz();
  };

  return (
    <div className="flex flex-col h-full bg-blue-50 animate-fade-in relative">
      {/* 헤더 */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between z-10 rounded-b-3xl">
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors">
          <Home size={24} />
        </button>
        <span className="text-xl font-bold text-blue-600 bg-blue-50 px-4 py-1 rounded-full">
          {currentIndex + 1} <span className="text-blue-300">/</span> {HANJA_DATA.length}
        </span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
        {/* 학습 카드 */}
        <div className="bg-white rounded-[2.5rem] shadow-xl p-6 w-full max-w-sm border-4 border-white ring-4 ring-blue-100 flex flex-col items-center mb-6">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-black text-gray-800 mb-2 tracking-tight">
              {currentHanja.sound} <span className="text-blue-500">{currentHanja.meaning}</span>
            </h2>
            <div className="inline-block bg-yellow-100 px-3 py-1 rounded-lg text-yellow-700 font-bold text-sm">
              획순을 따라 그려보세요
            </div>
          </div>

          <div 
            className="bg-gray-50 rounded-[2rem] shadow-inner border-2 border-gray-100 relative overflow-hidden mb-6"
            style={{ width: '260px', height: '260px' }}
          >
             {!isScriptLoaded && <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold">로딩중...</div>}
             <div ref={containerRef} className="cursor-pointer hover:scale-105 transition-transform duration-300"></div>
          </div>

          <div className="h-8 mb-2 w-full flex justify-center items-center">
             {feedback && (
               <div className={`px-4 py-2 rounded-xl font-bold text-white shadow-sm animate-bounce-short ${feedback.includes('틀렸') ? 'bg-orange-400' : 'bg-green-500'}`}>
                 {feedback}
               </div>
             )}
          </div>
        </div>

        {/* 컨트롤 버튼 */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          <button onClick={animateCharacter} className="bg-white border-b-4 border-yellow-300 text-yellow-600 py-3 rounded-2xl font-bold hover:bg-yellow-50 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2">
            <Play size={20} fill="currentColor" /> 보는 법
          </button>
          <button onClick={resetQuiz} className="bg-white border-b-4 border-blue-300 text-blue-600 py-3 rounded-2xl font-bold hover:bg-blue-50 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2">
            <RotateCcw size={20} /> 다시 쓰기
          </button>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="p-4 flex justify-between items-center max-w-sm mx-auto w-full pb-8">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`p-4 rounded-full shadow-lg transition-all ${currentIndex === 0 ? 'bg-gray-200 text-gray-400' : 'bg-white text-blue-500 hover:scale-110 active:scale-95'}`}
        >
          <ArrowLeft size={28} strokeWidth={3} />
        </button>
        <button 
          onClick={handleNext}
          disabled={currentIndex === HANJA_DATA.length - 1}
          className={`p-4 rounded-full shadow-lg transition-all ${currentIndex === HANJA_DATA.length - 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-110 active:scale-95'}`}
        >
          <ArrowRight size={28} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

// --- 컴포넌트: 게임 모드 ---
const GameMode = ({ onBack }) => {
  const GAME_TIME = 40; 
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameState, setGameState] = useState('ready'); 
  const [score, setScore] = useState(0);

  const initGame = useCallback(() => {
    const shuffledHanja = [...HANJA_DATA].sort(() => 0.5 - Math.random()).slice(0, 6);
    
    let gameTiles = [];
    shuffledHanja.forEach(item => {
      gameTiles.push({ id: item.id, type: 'hanja', content: item.char, uniqueId: `${item.id}-h` });
      gameTiles.push({ id: item.id, type: 'meaning', content: `${item.sound} ${item.meaning}`, uniqueId: `${item.id}-m` });
    });

    gameTiles.sort(() => 0.5 - Math.random());

    setTiles(gameTiles);
    setMatchedIds([]);
    setSelectedTiles([]);
    setTimeLeft(GAME_TIME);
    setScore(0);
    setGameState('playing');
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setGameState('lost'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  const handleTileClick = (tile) => {
    if (gameState !== 'playing') return;
    if (matchedIds.includes(tile.id)) return;
    if (selectedTiles.find(t => t.uniqueId === tile.uniqueId)) return;
    if (selectedTiles.length >= 2) return;

    const newSelected = [...selectedTiles, tile];
    setSelectedTiles(newSelected);

    if (newSelected.length === 2) {
      if (newSelected[0].id === newSelected[1].id) {
        setMatchedIds(prev => [...prev, newSelected[0].id]);
        setScore(prev => prev + 100 + (timeLeft * 2));
        setSelectedTiles([]);
        if (matchedIds.length + 1 === tiles.length / 2) setGameState('won');
      } else {
        setTimeout(() => setSelectedTiles([]), 800);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-green-50 animate-fade-in relative">
      <div className="bg-white p-4 shadow-sm flex items-center justify-between z-10 rounded-b-3xl border-b-4 border-green-100">
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <Home size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
           <Timer size={18} className={`text-${timeLeft < 10 ? 'red' : 'green'}-500`} />
           <span className={`text-xl font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
             {timeLeft}s
           </span>
        </div>
        <div className="font-black text-green-600 bg-green-100 px-3 py-1 rounded-full border border-green-200">
          {score}점
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
          {tiles.map(tile => {
            const isSelected = selectedTiles.find(t => t.uniqueId === tile.uniqueId);
            const isMatched = matchedIds.includes(tile.id);
            const isHanja = tile.type === 'hanja';

            return (
              <button
                key={tile.uniqueId}
                onClick={() => handleTileClick(tile)}
                disabled={isMatched}
                className={`
                  aspect-square rounded-2xl flex items-center justify-center font-bold shadow-md transition-all duration-300
                  ${isMatched ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}
                  ${isSelected 
                    ? 'bg-yellow-300 text-yellow-900 border-b-0 translate-y-1 shadow-inner' 
                    : 'bg-white border-b-4 border-green-200 text-gray-700 hover:-translate-y-1 active:border-b-0 active:translate-y-1'
                  }
                  ${isHanja ? 'text-4xl font-serif' : 'text-lg word-break-keep leading-tight'}
                `}
              >
                {tile.content}
              </button>
            );
          })}
        </div>
      </div>

      {(gameState === 'won' || gameState === 'lost') && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-xs text-center shadow-2xl border-8 border-yellow-300 transform transition-all scale-105">
            <div className="text-7xl mb-4 animate-bounce">
              {gameState === 'won' ? '🎉' : '⏰'}
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">
              {gameState === 'won' ? '대단해요!' : '시간 초과!'}
            </h2>
            <p className="text-gray-500 mb-8 font-bold text-lg">
              {gameState === 'won' ? `+${score}점 획득!` : '다시 도전해볼까요?'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onBack} className="bg-gray-100 text-gray-600 py-3 rounded-2xl font-bold hover:bg-gray-200">
                나가기
              </button>
              <button onClick={initGame} className="bg-yellow-400 text-white py-3 rounded-2xl font-bold hover:bg-yellow-500 shadow-md border-b-4 border-yellow-500 active:border-b-0 active:translate-y-1">
                다시 하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 메인 앱 (레이아웃 수정) ---
export default function App() {
  const [view, setView] = useState('home');
  const isScriptLoaded = useHanziWriterScript();

  return (
    <>
      {/* 1. 폰트 로드 (Google Fonts - Jua) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
        
        body { font-family: 'Jua', sans-serif; }
        
        /* 스크롤바 숨기기 (깔끔한 UI) */
        ::-webkit-scrollbar { display: none; }
        
        .word-break-keep { word-break: keep-all; }
        
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-short { animation: bounce-short 0.5s; }
      `}</style>

      {/* 2. 전체 배경 (PC에서 예쁜 패턴 배경) */}
      <div className="min-h-screen w-full flex items-center justify-center bg-yellow-50 overflow-hidden relative">
        {/* 배경 패턴 (땡땡이) */}
        <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(#F59E0B 2px, transparent 2px)',
            backgroundSize: '24px 24px'
        }}></div>

        {/* 3. 스마트폰 프레임 컨테이너 */}
        {/* PC: 중앙 정렬 & 그림자 & 둥근 테두리 / 모바일: 꽉 찬 화면 */}
        <div className="w-full h-[100dvh] md:h-[85vh] md:max-w-[420px] bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden relative md:border-[8px] md:border-white md:ring-8 ring-blue-50/50 flex flex-col transition-all duration-300">
          
          {/* 앱 콘텐츠 */}
          <div className="flex-1 overflow-hidden relative bg-white">
            {view === 'home' && (
              <MainMenu 
                onStartPractice={() => setView('practice')} 
                onStartGame={() => setView('game')} 
              />
            )}
            {view === 'practice' && (
              <PracticeMode 
                onBack={() => setView('home')} 
                isScriptLoaded={isScriptLoaded}
              />
            )}
            {view === 'game' && (
              <GameMode 
                onBack={() => setView('home')} 
              />
            )}
          </div>
          
        </div>
      </div>
    </>
  );
}