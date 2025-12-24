import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Home, Star, Timer, Trophy, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

// --- 데이터: 8급 배정한자 (총 50자) ---
const HANJA_DATA_LEVEL_8 = [
  // [숫자]
  { id: 1, char: '一', sound: '한', meaning: '일' },
  { id: 2, char: '二', sound: '두', meaning: '이' },
  { id: 3, char: '三', sound: '석', meaning: '삼' },
  { id: 4, char: '四', sound: '넉', meaning: '사' },
  { id: 5, char: '五', sound: '다섯', meaning: '오' },
  { id: 6, char: '六', sound: '여섯', meaning: '육' },
  { id: 7, char: '七', sound: '일곱', meaning: '칠' },
  { id: 8, char: '八', sound: '여덟', meaning: '팔' },
  { id: 9, char: '九', sound: '아홉', meaning: '구' },
  { id: 10, char: '十', sound: '열', meaning: '십' },
  { id: 11, char: '萬', sound: '일만', meaning: '만' },

  // [요일/자연]
  { id: 12, char: '日', sound: '날', meaning: '일' },
  { id: 13, char: '月', sound: '달', meaning: '월' },
  { id: 14, char: '火', sound: '불', meaning: '화' },
  { id: 15, char: '水', sound: '물', meaning: '수' },
  { id: 16, char: '木', sound: '나무', meaning: '목' },
  { id: 17, char: '金', sound: '쇠', meaning: '금' },
  { id: 18, char: '土', sound: '흙', meaning: '토' },
  { id: 19, char: '山', sound: '메', meaning: '산' },

  // [방향/위치/크기]
  { id: 20, char: '東', sound: '동녘', meaning: '동' },
  { id: 21, char: '西', sound: '서녘', meaning: '서' },
  { id: 22, char: '南', sound: '남녘', meaning: '남' },
  { id: 23, char: '北', sound: '북녘', meaning: '북' },
  { id: 24, char: '大', sound: '큰', meaning: '대' },
  { id: 25, char: '小', sound: '작은', meaning: '소' },
  { id: 26, char: '中', sound: '가운데', meaning: '중' },
  { id: 27, char: '外', sound: '바깥', meaning: '외' },

  // [가족/사람]
  { id: 28, char: '人', sound: '사람', meaning: '인' },
  { id: 29, char: '父', sound: '아비', meaning: '부' },
  { id: 30, char: '母', sound: '어미', meaning: '모' },
  { id: 31, char: '兄', sound: '맏', meaning: '형' },
  { id: 32, char: '弟', sound: '아우', meaning: '제' },
  { id: 33, char: '女', sound: '계집', meaning: '녀' },
  { id: 34, char: '民', sound: '백성', meaning: '민' },

  // [학교/교육]
  { id: 35, char: '學', sound: '배울', meaning: '학' },
  { id: 36, char: '校', sound: '학교', meaning: '교' },
  { id: 37, char: '先', sound: '먼저', meaning: '선' },
  { id: 38, char: '生', sound: '날', meaning: '생' },
  { id: 39, char: '敎', sound: '가르칠', meaning: '교' },
  { id: 40, char: '室', sound: '집', meaning: '실' },
  { id: 41, char: '門', sound: '문', meaning: '문' },

  // [국가/사회]
  { id: 42, char: '國', sound: '나라', meaning: '국' },
  { id: 43, char: '軍', sound: '군사', meaning: '군' },
  { id: 44, char: '王', sound: '임금', meaning: '왕' },
  { id: 45, char: '韓', sound: '나라', meaning: '한' },

  // [기타 기초]
  { id: 46, char: '年', sound: '해', meaning: '년' },
  { id: 47, char: '白', sound: '흰', meaning: '백' },
  { id: 48, char: '靑', sound: '푸를', meaning: '청' },
  { id: 49, char: '長', sound: '길', meaning: '장' },
  { id: 50, char: '寸', sound: '마디', meaning: '촌' },
];

// 레벨 목록 정의
const LEVELS = [
  { id: 8, label: '8급', data: HANJA_DATA_LEVEL_8, color: 'yellow' },
  { id: 7, label: '7급', data: [], color: 'gray', locked: true }, // 추후 추가 예정
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
const MainMenu = ({ onStartPractice, onStartGame, currentLevel, onSelectLevel }) => (
  <div className="flex flex-col items-center h-full animate-fade-in p-6 overflow-y-auto">
    {/* 타이틀 영역 */}
    <div className="text-center space-y-2 mt-4 mb-8">
      <h1 className="text-6xl font-black text-blue-600 tracking-tighter drop-shadow-sm stroke-text">
        한자<br/>척척박사
      </h1>
      <p className="text-xl text-gray-500 font-bold mt-2">재미있게 배우고 신나게 놀자!</p>
    </div>
    
    {/* 급수 선택 영역 */}
    <div className="w-full mb-8">
      <h3 className="text-lg font-bold text-gray-600 mb-3 text-center">급수를 선택하세요</h3>
      <div className="flex justify-center gap-3">
        {LEVELS.map((level) => (
          <button
            key={level.id}
            onClick={() => !level.locked && onSelectLevel(level.id)}
            disabled={level.locked}
            className={`
              relative px-6 py-3 rounded-2xl font-black text-xl transition-all duration-200 shadow-md flex items-center gap-2
              ${currentLevel === level.id 
                ? 'bg-yellow-400 text-white ring-4 ring-yellow-200 scale-105 z-10' 
                : level.locked 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-600 hover:bg-yellow-50 hover:scale-105'
              }
            `}
          >
            {level.label}
            {currentLevel === level.id && <CheckCircle size={20} className="text-white" />}
            {level.locked && <span className="text-xs font-normal absolute bottom-1 right-0 left-0 text-center text-gray-400">준비중</span>}
          </button>
        ))}
      </div>
    </div>

    {/* 활동 선택 버튼 */}
    <div className="grid grid-cols-1 gap-5 w-full flex-1 content-start">
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
const PracticeMode = ({ onBack, isScriptLoaded, data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const writerRef = useRef(null);
  const containerRef = useRef(null);
  const [feedback, setFeedback] = useState("");

  const currentHanja = data[currentIndex];

  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current || !currentHanja) return;

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

  }, [currentIndex, isScriptLoaded, currentHanja]);

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
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

  if (!currentHanja) return <div>데이터가 없습니다.</div>;

  return (
    <div className="flex flex-col h-full bg-blue-50 animate-fade-in relative">
      {/* 헤더 */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between z-10 rounded-b-3xl">
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors">
          <Home size={24} />
        </button>
        <span className="text-xl font-bold text-blue-600 bg-blue-50 px-4 py-1 rounded-full">
          {currentIndex + 1} <span className="text-blue-300">/</span> {data.length}
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
          disabled={currentIndex === data.length - 1}
          className={`p-4 rounded-full shadow-lg transition-all ${currentIndex === data.length - 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-110 active:scale-95'}`}
        >
          <ArrowRight size={28} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

// --- 컴포넌트: 게임 모드 ---
const GameMode = ({ onBack, data }) => {
  const GAME_TIME = 60; // 데이터가 많아졌으므로 시간을 조금 더 줌
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameState, setGameState] = useState('ready'); 
  const [score, setScore] = useState(0);

  const initGame = useCallback(() => {
    // 50개 중 6개 랜덤 선택
    const shuffledHanja = [...data].sort(() => 0.5 - Math.random()).slice(0, 6);
    
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
  }, [data]);

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

// --- 메인 앱 ---
export default function App() {
  const [view, setView] = useState('home');
  const [currentLevel, setCurrentLevel] = useState(8); // 기본값 8급
  const isScriptLoaded = useHanziWriterScript();

  // 현재 레벨에 맞는 데이터 가져오기
  const getCurrentData = () => {
    const levelObj = LEVELS.find(l => l.id === currentLevel);
    return levelObj ? levelObj.data : HANJA_DATA_LEVEL_8;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
        body { font-family: 'Jua', sans-serif; }
        ::-webkit-scrollbar { display: none; }
        .word-break-keep { word-break: keep-all; }
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-short { animation: bounce-short 0.5s; }
      `}</style>

      <div className="min-h-screen w-full flex items-center justify-center bg-yellow-50 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(#F59E0B 2px, transparent 2px)',
            backgroundSize: '24px 24px'
        }}></div>

        <div className="w-full h-[100dvh] md:h-[85vh] md:max-w-[420px] bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden relative md:border-[8px] md:border-white md:ring-8 ring-blue-50/50 flex flex-col transition-all duration-300">
          
          <div className="flex-1 overflow-hidden relative bg-white">
            {view === 'home' && (
              <MainMenu 
                onStartPractice={() => setView('practice')} 
                onStartGame={() => setView('game')} 
                currentLevel={currentLevel}
                onSelectLevel={setCurrentLevel}
              />
            )}
            {view === 'practice' && (
              <PracticeMode 
                onBack={() => setView('home')} 
                isScriptLoaded={isScriptLoaded}
                data={getCurrentData()}
              />
            )}
            {view === 'game' && (
              <GameMode 
                onBack={() => setView('home')} 
                data={getCurrentData()}
              />
            )}
          </div>
          
        </div>
      </div>
    </>
  );
}