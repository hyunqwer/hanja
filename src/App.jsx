import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Home, Star, Timer, Trophy, ArrowRight, ArrowLeft, CheckCircle, Zap, Puzzle } from 'lucide-react';
import { LEVELS } from './hanjaData'; // 분리된 데이터 파일 불러오기!

// Tailwind 동적 클래스 매핑
const LEVEL_STYLES = {
  yellow: { bg: 'bg-yellow-400', text: 'text-white', ring: 'ring-yellow-200' },
  green: { bg: 'bg-green-400', text: 'text-white', ring: 'ring-green-200' },
  blue: { bg: 'bg-blue-400', text: 'text-white', ring: 'ring-blue-200' },
  purple: { bg: 'bg-purple-400', text: 'text-white', ring: 'ring-purple-200' },
  red: { bg: 'bg-red-400', text: 'text-white', ring: 'ring-red-200' },
};

// --- 유틸리티: 진동 효과 ---
const vibrateSuccess = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(50); // 짧게 한 번 (징!)
  }
};

const vibrateError = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([100, 50, 100]); // 길게 두 번 (지잉-지잉)
  }
};

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
const MainMenu = ({ onStartPractice, onStartGame, onStartSoundPuzzle, currentLevel, onSelectLevel }) => (
  <div className="flex flex-col items-center h-full animate-fade-in p-6 overflow-y-auto">
    <div className="text-center space-y-2 mt-4 mb-8">
      <h1 className="text-6xl font-black text-blue-600 tracking-tighter drop-shadow-sm stroke-text">
        한자<br/>척척박사
      </h1>
      <p className="text-xl text-gray-500 font-bold mt-2">재미있게 배우고 신나게 놀자!</p>
    </div>
    
    <div className="w-full mb-8">
      <h3 className="text-lg font-bold text-gray-600 mb-3 text-center">급수를 선택하세요</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {LEVELS.map((level) => {
          const styles = LEVEL_STYLES[level.color];
          return (
            <button
              key={level.id}
              onClick={() => !level.locked && onSelectLevel(level.id)}
              disabled={level.locked}
              className={`
                relative px-4 py-3 rounded-2xl font-black text-lg transition-all duration-200 shadow-md flex items-center gap-2 mb-2
                ${currentLevel === level.id 
                  ? `${styles.bg} ${styles.text} ring-4 ${styles.ring} scale-105 z-10` 
                  : level.locked 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:scale-105'
                }
              `}
            >
              {level.label}
              {currentLevel === level.id && <CheckCircle size={18} className="text-white" />}
              {level.locked && <span className="text-xs font-normal absolute bottom-1 right-0 left-0 text-center text-gray-400">준비중</span>}
            </button>
          );
        })}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 w-full flex-1 content-start">
      <button 
        onClick={onStartPractice}
        className="group relative bg-white border-b-8 border-blue-200 rounded-3xl p-5 hover:bg-blue-50 hover:border-blue-300 hover:translate-y-1 active:border-b-0 active:translate-y-2 transition-all duration-150 shadow-lg flex items-center gap-5"
      >
        <div className="bg-blue-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
          <Star size={32} className="text-blue-500 fill-current" />
        </div>
        <div className="text-left">
          <h2 className="text-xl font-bold text-gray-800">따라 쓰기</h2>
          <p className="text-gray-500 text-sm">획순에 맞춰 써봐요</p>
        </div>
      </button>

      <button 
        onClick={onStartGame}
        className="group relative bg-white border-b-8 border-green-200 rounded-3xl p-5 hover:bg-green-50 hover:border-green-300 hover:translate-y-1 active:border-b-0 active:translate-y-2 transition-all duration-150 shadow-lg flex items-center gap-5"
      >
        <div className="bg-green-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
          <Trophy size={32} className="text-green-500 fill-current" />
        </div>
        <div className="text-left">
          <h2 className="text-xl font-bold text-gray-800">짝꿍 게임</h2>
          <p className="text-gray-500 text-sm">한자와 뜻 연결하기</p>
        </div>
      </button>

      {/* 새로운 독음 조립 퍼즐 버튼 */}
      <button 
        onClick={onStartSoundPuzzle}
        className="group relative bg-white border-b-8 border-purple-200 rounded-3xl p-5 hover:bg-purple-50 hover:border-purple-300 hover:translate-y-1 active:border-b-0 active:translate-y-2 transition-all duration-150 shadow-lg flex items-center gap-5"
      >
        <div className="bg-purple-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
          <Puzzle size={32} className="text-purple-500 fill-current" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">독음 조립</h2>
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">NEW</span>
          </div>
          <p className="text-gray-500 text-sm">블록을 끼워 단어 완성!</p>
        </div>
      </button>
    </div>
  </div>
);

// --- 컴포넌트: 독음 조립 퍼즐 모드 ---
const SoundPuzzleMode = ({ onBack, data, levelId }) => {
  // 라운드별 난이도 설정
  const getRoundConfig = (round) => {
    if (round <= 2) return { time: 20, distractors: 1 }; // R1~2: 쉬움
    if (round <= 4) return { time: 15, distractors: 2 }; // R3~4: 보통
    return { time: 12, distractors: 3 }; // R5+: 어려움
  };

  const [round, setRound] = useState(1);
  const [maxTime, setMaxTime] = useState(20);
  const [timeLeft, setTimeLeft] = useState(20);
  
  const [currentWord, setCurrentWord] = useState(null);
  const [poolBlocks, setPoolBlocks] = useState([]); // 섞인 블록들 (정답+오답)
  const [answerBlocks, setAnswerBlocks] = useState([]); // 사용자가 맞춘 블록들
  const [gameState, setGameState] = useState('ready'); // ready, playing, correct, lost
  const [score, setScore] = useState(0);
  
  // 데이터 준비
  const initRound = useCallback((roundNum) => {
    const config = getRoundConfig(roundNum);
    setMaxTime(config.time);
    setTimeLeft(config.time);
    setRound(roundNum);
    setAnswerBlocks([]);
    setGameState('playing');

    // 1. 문제 출제 (랜덤 단어 1개 선택)
    const randomWord = data[Math.floor(Math.random() * data.length)];
    setCurrentWord(randomWord);

    // 2. 오답 블록 생성 (다른 단어들의 음절에서 랜덤 추출)
    const allSyllables = data.flatMap(w => w.syllables);
    const distractors = [];
    while (distractors.length < config.distractors) {
      const s = allSyllables[Math.floor(Math.random() * allSyllables.length)];
      if (!randomWord.syllables.includes(s)) distractors.push(s);
    }

    // 3. 블록 섞기 (정답 음절 + 오답 음절)
    const mixed = [...randomWord.syllables.map((s, i) => ({ id: `ans-${i}`, text: s, type: 'answer' })), 
                   ...distractors.map((s, i) => ({ id: `dist-${i}`, text: s, type: 'distractor' }))];
    
    // 셔플
    mixed.sort(() => 0.5 - Math.random());
    setPoolBlocks(mixed);

  }, [data]);

  useEffect(() => { initRound(1); }, [initRound]);

  // 타이머
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) { 
          setGameState('lost'); 
          vibrateError(); // 시간 초과 시 진동
          return 0; 
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);
    return () => clearInterval(timer);
  }, [gameState]);

  // 블록 클릭 핸들러 (풀 -> 정답칸 이동)
  const handlePoolBlockClick = (block) => {
    if (gameState !== 'playing') return;
    
    // 정답칸이 꽉 찼으면 무시
    if (answerBlocks.length >= currentWord.syllables.length) return;

    // 풀에서 제거하고 정답칸으로 이동
    setPoolBlocks(prev => prev.filter(b => b.id !== block.id));
    setAnswerBlocks(prev => [...prev, block]);
  };

  // 정답칸 블록 클릭 핸들러 (정답칸 -> 풀 이동)
  const handleAnswerBlockClick = (block) => {
    if (gameState !== 'playing') return;

    // 정답칸에서 제거하고 풀로 이동
    setAnswerBlocks(prev => prev.filter(b => b.id !== block.id));
    setPoolBlocks(prev => [...prev, block]);
  };

  // 정답 체크 (블록이 꽉 찼을 때 자동 체크)
  useEffect(() => {
    if (!currentWord || answerBlocks.length !== currentWord.syllables.length) return;

    const userAnswer = answerBlocks.map(b => b.text).join('');
    
    if (userAnswer === currentWord.reading) {
      // 정답!
      vibrateSuccess(); // 성공 진동
      setGameState('correct');
      setScore(prev => prev + 100 + Math.ceil(timeLeft * 10));
      setTimeout(() => initRound(round + 1), 2000); // 정답 확인 시간 조금 여유있게
    } else {
      // 오답
      vibrateError(); // 실패 진동
    }
  }, [answerBlocks, currentWord, round, timeLeft, initRound]);

  // 시간 바
  const timePercent = (timeLeft / maxTime) * 100;
  let barColor = 'bg-purple-500';
  if (timePercent < 30) barColor = 'bg-red-500';

  if (!currentWord) return <div>로딩중...</div>;

  // 예문 렌더링 헬퍼 함수 (정답 가리기/보여주기)
  const renderSentence = () => {
    const isRevealed = gameState === 'correct' || gameState === 'lost';
    const target = currentWord.reading;
    const sentence = currentWord.example;
    
    // 예문에서 정답 단어를 기준으로 텍스트를 나눕니다.
    const parts = sentence.split(target);

    return (
      <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-100 w-full mb-6 relative">
         <span className="absolute -top-3 left-4 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">예문</span>
         <p className="text-xl text-gray-700 font-bold leading-relaxed text-center break-keep">
           {parts.map((part, index) => (
             <React.Fragment key={index}>
               {part}
               {index < parts.length - 1 && (
                 <span className={`inline-flex items-center justify-center mx-1 px-2 py-1 rounded-lg transition-all duration-500 ${
                   isRevealed 
                     ? "bg-transparent text-purple-600 text-2xl font-black underline decoration-wavy underline-offset-4 scale-110" 
                     : "bg-gray-300 text-transparent min-w-[3rem]"
                 }`}>
                   {isRevealed ? target : '□'.repeat(target.length)}
                 </span>
               )}
             </React.Fragment>
           ))}
         </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-purple-50 animate-fade-in relative">
      {/* 상단 정보 */}
      <div className="bg-white p-3 shadow-md z-10 rounded-b-3xl border-b-4 border-purple-100 space-y-2">
        <div className="flex items-center justify-between">
            <button onClick={onBack} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <Home size={20} className="text-gray-600" />
            </button>
            <div className="flex flex-col items-center">
               <span className="text-xs font-bold text-gray-400">ROUND</span>
               <span className="text-2xl font-black text-purple-600 leading-none">{round}</span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-xs font-bold text-gray-400">SCORE</span>
               <span className="text-2xl font-black text-purple-600 leading-none">{score}</span>
            </div>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
           <div className={`h-full transition-all duration-100 ${barColor}`} style={{ width: `${timePercent}%` }}></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center p-6 pb-24 overflow-y-auto">
        
        {/* 문제 제시 (한자) */}
        <div className="w-full text-center mb-6">
          <h2 className="text-7xl font-black text-gray-800 drop-shadow-sm hanja-font mb-4">
            {currentWord.hanja}
          </h2>
          {/* 예문 표시 (수정된 부분) */}
          {renderSentence()}
        </div>

        {/* 조립 영역 (정답칸) */}
        <div className="flex gap-2 min-h-[80px] items-center justify-center p-4 bg-white rounded-2xl w-full border-4 border-dashed border-purple-200 mb-6 shadow-inner">
          {Array.from({ length: currentWord.syllables.length }).map((_, i) => {
            const block = answerBlocks[i];
            return (
              <div 
                key={i}
                onClick={() => block && handleAnswerBlockClick(block)}
                className={`
                  w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shadow-sm transition-all
                  ${block 
                    ? 'bg-purple-500 text-white cursor-pointer hover:bg-purple-600 hover:-translate-y-1 shadow-md' 
                    : 'bg-gray-100 text-gray-300 border border-gray-200'
                  }
                `}
              >
                {block ? block.text : (i + 1)}
              </div>
            );
          })}
        </div>

        {/* 블록 풀 (선택지) */}
        <div className="flex flex-wrap gap-3 justify-center content-start w-full">
          {poolBlocks.map((block) => (
            <button
              key={block.id}
              onClick={() => handlePoolBlockClick(block)}
              className="bg-white border-b-4 border-purple-200 text-gray-700 w-16 h-16 rounded-xl text-2xl font-bold shadow-md active:border-b-0 active:translate-y-1 hover:bg-purple-50 transition-all"
            >
              {block.text}
            </button>
          ))}
        </div>

        {/* 게임 오버 */}
        {gameState === 'lost' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-xs text-center shadow-2xl border-8 border-purple-400">
              <div className="text-6xl mb-4">⏰</div>
              <h2 className="text-3xl font-black text-gray-800 mb-2">시간 초과!</h2>
              <p className="text-xl font-bold text-gray-500 mb-4">정답은?</p>
              <div className="text-4xl font-black text-purple-600 mb-6 bg-purple-50 p-4 rounded-xl">
                 {currentWord.reading}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={onBack} className="bg-gray-100 text-gray-600 py-3 rounded-2xl font-bold hover:bg-gray-200">나가기</button>
                <button onClick={() => initRound(1)} className="bg-purple-500 text-white py-3 rounded-2xl font-bold hover:bg-purple-600 shadow-md border-b-4 border-purple-700 active:border-b-0 active:translate-y-1">다시 하기</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// --- 기존 컴포넌트들 (PracticeMode, GameMode 등) ---
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
        vibrateError(); // 쓰기 틀림 진동
      },
      onCorrectStroke: function(strokeData) {
        setFeedback("잘하고 있어요! 👍");
      },
      onComplete: function(summaryData) {
        setFeedback("참 잘했어요! 완벽해요! 🎉");
        vibrateSuccess(); // 쓰기 완료 진동
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

const GameMode = ({ onBack, data, levelId }) => {
  // 라운드별 설정
  const getRoundConfig = (round) => {
    if (round === 1) return { time: 25, pairs: 6 };
    if (round === 2) return { time: 20, pairs: 6 };
    if (round === 3) return { time: 18, pairs: 8 };
    if (round === 4) return { time: 15, pairs: 8 };
    if (round >= 5) return { time: 12, pairs: 10 }; // 5라운드 이상은 최고 난이도 유지
    return { time: 25, pairs: 6 };
  };

  const [round, setRound] = useState(1);
  const [maxTime, setMaxTime] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25);
  
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [gameState, setGameState] = useState('ready'); // ready, playing, clear, won, lost
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [comboEffect, setComboEffect] = useState(null); // 콤보 이펙트 표시용

  // 최고 기록 (로컬 스토리지)
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem(`hanja-best-score-${levelId}`) || '0');
  });

  // 라운드 시작
  const startRound = useCallback((roundNum) => {
    const config = getRoundConfig(roundNum);
    setMaxTime(config.time);
    setTimeLeft(config.time);
    setRound(roundNum);
    setMatchedIds([]);
    setSelectedTiles([]);
    setCombo(0);
    setGameState('playing');

    // 카드 생성
    const pairCount = config.pairs;
    // 전체 데이터에서 랜덤하게 필요한 쌍만큼 선택
    const shuffledHanja = [...data].sort(() => 0.5 - Math.random()).slice(0, pairCount);
    
    let gameTiles = [];
    shuffledHanja.forEach(item => {
      gameTiles.push({ id: item.id, type: 'hanja', content: item.char, uniqueId: `${item.id}-h` });
      gameTiles.push({ id: item.id, type: 'meaning', content: `${item.sound} ${item.meaning}`, uniqueId: `${item.id}-m` });
    });

    // 타일 섞기
    gameTiles.sort(() => 0.5 - Math.random());
    setTiles(gameTiles);

  }, [data]);

  // 첫 시작
  useEffect(() => {
    startRound(1);
  }, [startRound]);

  // 타이머 로직
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) { 
          setGameState('lost'); 
          // 최고 기록 갱신
          if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem(`hanja-best-score-${levelId}`, score.toString());
          }
          vibrateError(); // 시간 초과 시 진동
          return 0; 
        }
        return Math.max(0, prev - 0.1); // 0.1초 단위로 부드럽게 감소
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameState, score, bestScore, levelId]);

  // 타일 클릭 핸들러
  const handleTileClick = (tile) => {
    if (gameState !== 'playing') return;
    if (matchedIds.includes(tile.id)) return;
    if (selectedTiles.find(t => t.uniqueId === tile.uniqueId)) return;
    if (selectedTiles.length >= 2) return;

    const newSelected = [...selectedTiles, tile];
    setSelectedTiles(newSelected);

    if (newSelected.length === 2) {
      // 1. 매칭 성공
      if (newSelected[0].id === newSelected[1].id) {
        const newMatchedIds = [...matchedIds, newSelected[0].id];
        setMatchedIds(newMatchedIds);
        
        // 콤보 계산
        const newCombo = combo + 1;
        setCombo(newCombo);

        // 점수 계산 (기본 100 + 콤보 보너스)
        const baseScore = 100;
        let multiplier = 1;
        if (newCombo >= 5) multiplier = 2.0;
        else if (newCombo >= 3) multiplier = 1.5;
        else if (newCombo >= 2) multiplier = 1.2;
        
        const addScore = Math.floor(baseScore * multiplier);
        setScore(prev => prev + addScore);

        // [수정] 시간 보너스 추가
        // 콤보에 따라 시간 추가 (기본 1초, 2콤보 이상 2초, 5콤보 이상 3초)
        let timeBonus = 1;
        if (newCombo >= 2) timeBonus = 2;
        if (newCombo >= 5) timeBonus = 3;

        setTimeLeft(prev => Math.min(prev + timeBonus, maxTime)); // 최대 시간 넘지 않게

        vibrateSuccess(); // 성공 진동

        // 콤보 이펙트 표시 (시간 보너스 표시 추가)
        if (newCombo >= 2) {
          setComboEffect(`${newCombo} COMBO! +${addScore} (⏰+${timeBonus}s)`);
          setTimeout(() => setComboEffect(null), 800);
        }

        setSelectedTiles([]);

        // 라운드 클리어 체크
        if (newMatchedIds.length === tiles.length / 2) {
          // 시간 보너스
          const roundTimeBonus = Math.floor(timeLeft * 10);
          setScore(prev => prev + roundTimeBonus);
          setComboEffect(`CLEAR! +${roundTimeBonus}`);
          
          setGameState('clear');
          
          // 1.5초 후 다음 라운드
          setTimeout(() => {
             startRound(round + 1);
          }, 1500);
        }

      } else {
        // 2. 매칭 실패
        setCombo(0); // 콤보 초기화
        vibrateError(); // 실패 진동
        setTimeout(() => {
          setSelectedTiles([]);
        }, 600);
      }
    }
  };

  // 타임 바 색상 및 퍼센트 계산
  const timePercent = (timeLeft / maxTime) * 100;
  let barColor = 'bg-green-500';
  if (timePercent < 50) barColor = 'bg-yellow-400';
  if (timePercent < 20) barColor = 'bg-red-500';

  return (
    <div className="flex flex-col h-full bg-green-50 animate-fade-in relative">
      {/* 상단 UI (라운드 / 타임바 / 점수) */}
      <div className="bg-white p-3 shadow-md z-10 rounded-b-3xl border-b-4 border-green-100 space-y-2">
        {/* 상단: 홈 / 라운드 / 점수 */}
        <div className="flex items-center justify-between">
            <button onClick={onBack} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <Home size={20} className="text-gray-600" />
            </button>
            
            <div className="flex flex-col items-center">
               <span className="text-xs font-bold text-gray-400">ROUND</span>
               <span className="text-2xl font-black text-blue-600 leading-none">{round}</span>
            </div>

            <div className="flex flex-col items-end">
               <span className="text-xs font-bold text-gray-400">SCORE</span>
               <span className="text-2xl font-black text-green-600 leading-none">{score}</span>
            </div>
        </div>

        {/* 타임 바 */}
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden relative shadow-inner">
           <div 
             className={`h-full transition-all duration-100 ease-linear ${barColor} ${timePercent < 20 ? 'animate-pulse' : ''}`}
             style={{ width: `${timePercent}%` }}
           ></div>
        </div>
      </div>

      {/* 콤보 이펙트 (중앙) */}
      {comboEffect && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 animate-bounce-short">
          <div className="text-4xl font-black text-yellow-500 drop-shadow-lg stroke-text-white whitespace-nowrap">
            {comboEffect}
          </div>
        </div>
      )}

      {/* 게임 그리드 */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
        {/* 라운드 클리어 메시지 */}
        {gameState === 'clear' ? (
           <div className="text-center animate-bounce-short">
             <div className="text-6xl mb-2">🎉</div>
             <h2 className="text-4xl font-black text-green-600">ROUND {round} CLEAR!</h2>
             <p className="text-gray-500 font-bold">다음 라운드로 이동합니다...</p>
           </div>
        ) : (
          <div className={`grid gap-3 w-full max-w-sm ${tiles.length > 12 ? 'grid-cols-4' : 'grid-cols-3'}`}>
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
                    aspect-square rounded-xl flex items-center justify-center font-bold shadow-md transition-all duration-200
                    ${isMatched ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}
                    ${isSelected 
                      ? 'bg-yellow-300 text-yellow-900 border-b-0 translate-y-1 shadow-inner ring-4 ring-yellow-200' 
                      : 'bg-white border-b-4 border-green-200 text-gray-700 hover:-translate-y-1 active:border-b-0 active:translate-y-1'
                    }
                    ${isHanja ? (tiles.length > 12 ? 'text-2xl' : 'text-4xl') : (tiles.length > 12 ? 'text-sm' : 'text-lg')} 
                    ${isHanja ? 'font-serif' : 'word-break-keep leading-tight'}
                  `}
                >
                  {tile.content}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 게임 오버 결과 화면 */}
      {(gameState === 'lost') && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-xs text-center shadow-2xl border-8 border-yellow-400 transform transition-all scale-105">
            <div className="text-7xl mb-4 animate-bounce">
              ⏰
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-1">
              시간 초과!
            </h2>
            <div className="bg-yellow-50 rounded-xl p-4 mb-6 mt-4">
               <p className="text-gray-500 font-bold text-sm mb-1">최종 도달</p>
               <p className="text-4xl font-black text-blue-600 mb-4">ROUND {round}</p>
               
               <div className="h-px bg-gray-200 mb-4"></div>
               
               <p className="text-gray-500 font-bold text-sm mb-1">이번 점수</p>
               <p className="text-3xl font-black text-gray-800">{score}점</p>
               
               {score >= bestScore && score > 0 && (
                 <div className="mt-2 inline-block bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold animate-pulse">
                   🎉 최고 기록 갱신!
                 </div>
               )}
            </div>
            
            <p className="text-green-600 font-bold mb-6 text-sm">
               "다음엔 ROUND {round + 1}까지 가볼까요?"
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onBack} className="bg-gray-100 text-gray-600 py-3 rounded-2xl font-bold hover:bg-gray-200">
                나가기
              </button>
              <button onClick={() => startRound(1)} className="bg-yellow-400 text-white py-3 rounded-2xl font-bold hover:bg-yellow-500 shadow-md border-b-4 border-yellow-500 active:border-b-0 active:translate-y-1">
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
  const [view, setView] = useState('home'); // home, practice, game, soundPuzzle
  const [currentLevel, setCurrentLevel] = useState(8); 
  const isScriptLoaded = useHanziWriterScript();

  // 현재 레벨에 맞는 데이터 가져오기 (기존 한자)
  const getCurrentData = () => {
    // LEVELS 배열은 이제 hanjaData.js에서 가져오므로 여기서도 접근 가능
    const levelObj = LEVELS.find(l => l.id === currentLevel);
    return levelObj ? levelObj.data : LEVELS[0].data; // 기본값 안전 처리
  };

  // 현재 레벨에 맞는 단어 데이터 가져오기 (독음 퍼즐용)
  const getCurrentWordData = () => {
    const levelObj = LEVELS.find(l => l.id === currentLevel);
    // 선택된 레벨의 wordData가 없으면 기본값으로 8급 데이터를 반환 (안전장치)
    return levelObj && levelObj.wordData ? levelObj.wordData : LEVELS[0].wordData;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
        body { font-family: 'Jua', sans-serif; }
        ::-webkit-scrollbar { display: none; }
        .word-break-keep { word-break: keep-all; }
        .stroke-text { -webkit-text-stroke: 1px white; }
        .stroke-text-white { -webkit-text-stroke: 2px white; }
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
                onStartSoundPuzzle={() => setView('soundPuzzle')}
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
                levelId={currentLevel}
              />
            )}
            {view === 'soundPuzzle' && (
              <SoundPuzzleMode 
                onBack={() => setView('home')}
                data={getCurrentWordData()}
                levelId={currentLevel}
              />
            )}
          </div>
          
        </div>
      </div>
    </>
  );
}