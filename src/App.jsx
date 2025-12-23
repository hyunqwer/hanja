import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Home, Star, Timer, Trophy, ArrowRight, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

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
  <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in">
    <div className="text-center space-y-2">
      <h1 className="text-5xl font-black text-yellow-500 tracking-tighter drop-shadow-md">
        한자 척척박사
      </h1>
      <p className="text-xl text-gray-600 font-bold">재미있게 배우고 신나게 놀자!</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md px-4">
      <button 
        onClick={onStartPractice}
        className="group relative bg-white border-4 border-blue-400 rounded-3xl p-8 hover:bg-blue-50 transition-all transform hover:-translate-y-2 hover:shadow-xl"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Star size={64} className="text-blue-500" />
        </div>
        <div className="text-6xl mb-4">✍️</div>
        <h2 className="text-2xl font-bold text-blue-600">따라 쓰기</h2>
        <p className="text-gray-500 mt-2">순서대로 쓱쓱 그려봐요</p>
      </button>

      <button 
        onClick={onStartGame}
        className="group relative bg-white border-4 border-green-400 rounded-3xl p-8 hover:bg-green-50 transition-all transform hover:-translate-y-2 hover:shadow-xl"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Trophy size={64} className="text-green-500" />
        </div>
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-2xl font-bold text-green-600">짝꿍 게임</h2>
        <p className="text-gray-500 mt-2">한자와 뜻을 맞춰봐요</p>
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

    // 기존 캔버스 초기화
    containerRef.current.innerHTML = '';

    const writer = window.HanziWriter.create(containerRef.current, currentHanja.char, {
      width: 280,
      height: 280,
      padding: 20,
      showOutline: true,
      strokeAnimationSpeed: 1, // 애니메이션 속도
      delayBetweenStrokes: 200, // 획 사이 딜레이
      strokeColor: '#3B82F6', // 파란색 획
      radicalColor: '#166534', // 부수 색상 (옵션)
    });

    writerRef.current = writer;
    
    // 시작 시 퀴즈 모드 활성화
    writer.quiz({
      onMistake: function(strokeData) {
        setFeedback("앗! 순서가 틀렸어요. 다시 해볼까요? 🤔");
        // 틀리면 힌트 애니메이션 보여줌
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

  const animateCharacter = () => {
    if (writerRef.current) {
      writerRef.current.animateCharacter();
    }
  };

  const resetQuiz = () => {
    if (writerRef.current) {
      setFeedback("");
      writerRef.current.quiz();
    }
  };

  return (
    <div className="flex flex-col items-center h-full p-4 animate-fade-in">
      {/* 상단 네비게이션 */}
      <div className="w-full max-w-lg flex justify-between items-center mb-6">
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <Home className="text-gray-600" />
        </button>
        <span className="text-lg font-bold text-gray-700 bg-white px-4 py-1 rounded-full shadow-sm border">
          {currentIndex + 1} / {HANJA_DATA.length}
        </span>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* 메인 학습 카드 */}
      <div className="bg-white rounded-[2rem] shadow-xl p-6 w-full max-w-md border-4 border-blue-100 flex flex-col items-center">
        {/* 한자 뜻/음 표시: 순서 수정 (뜻 + 음) */}
        <div className="text-center mb-4">
          <h2 className="text-3xl font-black text-gray-800 mb-1">{currentHanja.sound} {currentHanja.meaning}</h2>
          <p className="text-gray-400 text-sm">획순을 따라 그려보세요!</p>
        </div>

        {/* Hanzi Writer 영역 */}
        <div 
          className="bg-blue-50 rounded-3xl shadow-inner border-2 border-blue-100 relative overflow-hidden mb-6"
          style={{ width: '280px', height: '280px' }}
        >
           {!isScriptLoaded && <div className="absolute inset-0 flex items-center justify-center text-gray-400">로딩중...</div>}
           <div ref={containerRef} className="cursor-pointer"></div>
        </div>

        {/* 피드백 메시지 */}
        <div className="h-8 mb-4">
          <p className={`text-center font-bold transition-all ${feedback.includes('틀렸') ? 'text-red-500' : 'text-green-600'}`}>
            {feedback}
          </p>
        </div>

        {/* 컨트롤 버튼 */}
        <div className="flex gap-3 w-full justify-center">
          <button 
            onClick={animateCharacter}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white py-3 rounded-xl font-bold shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Play size={20} fill="currentColor" /> 보는 법
          </button>
          <button 
            onClick={resetQuiz}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} /> 다시 쓰기
          </button>
        </div>
      </div>

      {/* 이전/다음 네비게이션 */}
      <div className="flex justify-between w-full max-w-md mt-8">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${currentIndex === 0 ? 'bg-gray-200 text-gray-400' : 'bg-white text-blue-600 shadow-md hover:bg-blue-50'}`}
        >
          <ArrowLeft size={20} /> 이전
        </button>
        <button 
          onClick={handleNext}
          disabled={currentIndex === HANJA_DATA.length - 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${currentIndex === HANJA_DATA.length - 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-500 text-white shadow-md hover:bg-blue-600'}`}
        >
          다음 <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

// --- 컴포넌트: 게임 모드 ---
const GameMode = ({ onBack }) => {
  const GAME_TIME = 40; // 40초
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameState, setGameState] = useState('ready'); // ready, playing, won, lost
  const [score, setScore] = useState(0);

  // 게임 초기화
  const initGame = useCallback(() => {
    // 5개 랜덤 선택
    const shuffledHanja = [...HANJA_DATA].sort(() => 0.5 - Math.random()).slice(0, 6);
    
    // 카드 쌍 생성 (한자 카드 + 뜻 카드)
    let gameTiles = [];
    shuffledHanja.forEach(item => {
      gameTiles.push({ id: item.id, type: 'hanja', content: item.char, uniqueId: `${item.id}-h` });
      // 순서 수정: (뜻 + 음) 예: "날" + "일"
      gameTiles.push({ id: item.id, type: 'meaning', content: `${item.sound} ${item.meaning}`, uniqueId: `${item.id}-m` });
    });

    // 타일 섞기
    gameTiles.sort(() => 0.5 - Math.random());

    setTiles(gameTiles);
    setMatchedIds([]);
    setSelectedTiles([]);
    setTimeLeft(GAME_TIME);
    setScore(0);
    setGameState('playing');
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // 타이머 로직
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // 타일 클릭 핸들러
  const handleTileClick = (tile) => {
    if (gameState !== 'playing') return;
    if (matchedIds.includes(tile.id)) return; // 이미 맞춘 타일
    if (selectedTiles.find(t => t.uniqueId === tile.uniqueId)) return; // 이미 선택한 타일
    if (selectedTiles.length >= 2) return; // 이미 2개 선택 중

    const newSelected = [...selectedTiles, tile];
    setSelectedTiles(newSelected);

    if (newSelected.length === 2) {
      // 매칭 검사
      if (newSelected[0].id === newSelected[1].id) {
        // 성공
        setMatchedIds(prev => [...prev, newSelected[0].id]);
        setScore(prev => prev + 100 + (timeLeft * 2)); // 점수: 기본점수 + 남은시간 보너스
        setSelectedTiles([]);
        
        // 승리 조건
        if (matchedIds.length + 1 === tiles.length / 2) {
          setGameState('won');
        }
      } else {
        // 실패 (1초 후 선택 해제)
        setTimeout(() => {
          setSelectedTiles([]);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center h-full p-4 relative animate-fade-in">
      {/* 상단 UI */}
      <div className="w-full max-w-lg flex justify-between items-center mb-4 bg-white p-3 rounded-2xl shadow-sm border-2 border-green-100">
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <Home size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
           <Timer className={`text-${timeLeft < 10 ? 'red' : 'green'}-500`} />
           <span className={`text-2xl font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
             {timeLeft}s
           </span>
        </div>
        <div className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
          {score}점
        </div>
      </div>

      {/* 게임 그리드 */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-lg flex-1 content-center">
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
                aspect-square rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md transition-all transform
                ${isMatched ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
                ${isSelected 
                  ? 'bg-yellow-100 border-4 border-yellow-400 text-yellow-800 -translate-y-2' 
                  : 'bg-white border-b-4 border-gray-200 text-gray-700 hover:border-gray-300 hover:-translate-y-1 active:border-b-0 active:translate-y-1'
                }
                ${isHanja ? 'font-serif text-3xl' : 'text-lg word-break-keep'}
              `}
            >
              {tile.content}
            </button>
          );
        })}
      </div>

      {/* 결과 모달 */}
      {(gameState === 'won' || gameState === 'lost') && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-yellow-300 animate-bounce-in">
            <div className="text-6xl mb-4">
              {gameState === 'won' ? '🎉' : '⏰'}
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">
              {gameState === 'won' ? '대단해요!' : '시간 초과!'}
            </h2>
            <p className="text-gray-500 mb-6 font-bold">
              {gameState === 'won' ? `모든 카드를 맞췄어요! (+${score}점)` : '아쉽지만 다시 도전해봐요!'}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={onBack}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300"
              >
                나가기
              </button>
              <button 
                onClick={initGame}
                className="flex-1 bg-yellow-400 text-white py-3 rounded-xl font-bold hover:bg-yellow-500 shadow-md"
              >
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
  const [view, setView] = useState('home'); // home, practice, game
  const isScriptLoaded = useHanziWriterScript();

  return (
    <div className="w-full h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 overflow-hidden font-sans select-none">
      <div className="max-w-xl mx-auto h-full shadow-2xl bg-white/50 relative">
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

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        .word-break-keep {
          word-break: keep-all;
        }
      `}</style>
    </div>
  );
}