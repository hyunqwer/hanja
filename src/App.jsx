import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Home, Star, Timer, Trophy, ArrowRight, ArrowLeft, CheckCircle, Zap, Puzzle, Volume2, Sparkles } from 'lucide-react';
import { LEVELS } from './hanjaData'; // 분리된 데이터 파일 불러오기!

// Tailwind 동적 클래스 매핑
const LEVEL_STYLES = {
  yellow: { bg: 'bg-yellow-400', text: 'text-white', ring: 'ring-yellow-200' },
  green: { bg: 'bg-green-400', text: 'text-white', ring: 'ring-green-200' },
  blue: { bg: 'bg-blue-400', text: 'text-white', ring: 'ring-blue-200' },
  purple: { bg: 'bg-purple-400', text: 'text-white', ring: 'ring-purple-200' },
  red: { bg: 'bg-red-400', text: 'text-white', ring: 'ring-red-200' },
};

// 칭찬 문구 리스트 (20개)
const PRAISE_PHRASES = [
  "참 잘했어요! 🎉", "글씨가 예술이에요! 🎨", "한자 박사님이네요! 🎓", "완벽해요! 💯",
  "정말 멋져요! ✨", "대단해요! 👍", "최고예요! 🌟", "노력하는 모습이 아름다워요! 💖",
  "획순이 정확해요! 📏", "천재인가 봐요! 😲", "매일매일 실력이 늘어요! 📈", "브라보! 👏",
  "이대로만 하면 1급도 문제없어요! 🚀", "집중력이 대단해요! 🔥", "글씨가 살아있어요! 🐉",
  "우와, 감동했어요! 😭", "자랑스러워요! 🏆", "선생님보다 잘 쓰는데요? 👨‍🏫",
  "손이 보이지 않아요! ⚡", "슈퍼스타 탄생! 🌈"
];

// --- 유틸리티: 소리 효과 (Web Audio API 최적화) ---
// AudioContext를 싱글톤으로 관리하여 메모리 누수 및 재생 중단 방지
const audioCtxRef = { current: null };

const getAudioContext = () => {
  if (!audioCtxRef.current) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtxRef.current = new AudioContext();
    }
  }
  // 브라우저 정책으로 인해 suspended 된 경우 재개
  if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
    audioCtxRef.current.resume();
  }
  return audioCtxRef.current;
};

const playSound = (type) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'success') {
      // 딩동댕 (도-미-솔)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // 도
      osc.frequency.linearRampToValueAtTime(659.25, now + 0.1); // 미
      osc.frequency.linearRampToValueAtTime(783.99, now + 0.2); // 솔
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'error') {
      // 땡 (낮은 톱니파)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'click') {
      // 뽁 (짧은 클릭음)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

// --- 유틸리티: TTS ---
const speak = (text) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  
  // 기존 음성 중단 (빠른 반응을 위해)
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
};

// --- 유틸리티: 진동 ---
const vibrateSuccess = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(50);
  }
};

const vibrateError = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([100, 50, 100]);
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
              onClick={() => {
                if (!level.locked) {
                  onSelectLevel(level.id);
                  playSound('click');
                }
              }}
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
        onClick={() => { playSound('click'); onStartPractice(); }}
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
        onClick={() => { playSound('click'); onStartGame(); }}
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
        onClick={() => { playSound('click'); onStartSoundPuzzle(); }}
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
  // 라운드별 난이도 설정 (3개 라운드당 1초씩 감소)
  const getRoundConfig = (round) => {
    // 기본 시간 20초에서 시작, (round-1)/3 만큼 감소. 최소 5초 보장.
    const timeDecrease = Math.floor((round - 1) / 3);
    const time = Math.max(5, 20 - timeDecrease);

    // 방해 블록 수
    let distractors = 1;
    if (round > 2) distractors = 2;
    if (round > 5) distractors = 3;
    if (round > 10) distractors = 4;

    return { time, distractors };
  };

  const [round, setRound] = useState(1);
  const [maxTime, setMaxTime] = useState(20);
  const [timeLeft, setTimeLeft] = useState(20);
  
  const [currentWord, setCurrentWord] = useState(null);
  const [poolBlocks, setPoolBlocks] = useState([]); 
  const [answerBlocks, setAnswerBlocks] = useState([]); 
  const [gameState, setGameState] = useState('ready'); 
  const [score, setScore] = useState(0);
  
  // 데이터 준비
  const initRound = useCallback((roundNum) => {
    const config = getRoundConfig(roundNum);
    setMaxTime(config.time);
    setTimeLeft(config.time);
    setRound(roundNum);
    setAnswerBlocks([]);
    setGameState('playing');

    const randomWord = data[Math.floor(Math.random() * data.length)];
    setCurrentWord(randomWord);

    const allSyllables = data.flatMap(w => w.syllables);
    const distractors = [];
    while (distractors.length < config.distractors) {
      const s = allSyllables[Math.floor(Math.random() * allSyllables.length)];
      if (!randomWord.syllables.includes(s)) distractors.push(s);
    }

    const mixed = [...randomWord.syllables.map((s, i) => ({ id: `ans-${i}`, text: s, type: 'answer' })), 
                   ...distractors.map((s, i) => ({ id: `dist-${i}`, text: s, type: 'distractor' }))];
    
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
          vibrateError(); 
          playSound('error');
          return 0; 
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);
    return () => clearInterval(timer);
  }, [gameState]);

  const handlePoolBlockClick = (block) => {
    if (gameState !== 'playing') return;
    playSound('click'); 
    speak(block.text); // 블록 글자 읽기
    
    if (answerBlocks.length >= currentWord.syllables.length) return;

    setPoolBlocks(prev => prev.filter(b => b.id !== block.id));
    setAnswerBlocks(prev => [...prev, block]);
  };

  const handleAnswerBlockClick = (block) => {
    if (gameState !== 'playing') return;
    playSound('click');
    
    setAnswerBlocks(prev => prev.filter(b => b.id !== block.id));
    setPoolBlocks(prev => [...prev, block]);
  };

  // 정답 체크
  useEffect(() => {
    if (!currentWord || answerBlocks.length !== currentWord.syllables.length) return;

    const userAnswer = answerBlocks.map(b => b.text).join('');
    
    if (userAnswer === currentWord.reading) {
      // 정답!
      setGameState('correct');
      setScore(prev => prev + 100 + Math.ceil(timeLeft * 10));
      vibrateSuccess();
      playSound('success');
      
      // 정답 단어만 읽어줌 (예문 읽지 않음)
      speak(currentWord.reading); 
      
      // 정답 확인 후 빠르게 넘어감 (0.8초)
      setTimeout(() => initRound(round + 1), 800); 
    }
  }, [answerBlocks, currentWord, round, timeLeft, initRound]);

  const timePercent = (timeLeft / maxTime) * 100;
  let barColor = 'bg-purple-500';
  if (timePercent < 30) barColor = 'bg-red-500';

  if (!currentWord) return <div>로딩중...</div>;

  const renderSentence = () => {
    const isRevealed = gameState === 'correct' || gameState === 'lost';
    const target = currentWord.reading;
    const sentence = currentWord.example;
    
    // 예문 나누기
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
        {/* 타임 게이지 바 */}
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative">
           <div 
             className={`h-full transition-all duration-100 linear ${barColor}`} 
             style={{ width: `${timePercent}%` }}
           ></div>
           <div className="absolute top-0 right-1 text-[10px] text-gray-500 font-bold">{Math.ceil(timeLeft)}s</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center p-6 pb-24 overflow-y-auto">
        <div className="w-full text-center mb-6">
          <h2 className="text-7xl font-black text-gray-800 drop-shadow-sm hanja-font mb-4">
            {currentWord.hanja}
          </h2>
          {renderSentence()}
        </div>

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

  // 카드 변경 시 TTS 읽어주기
  useEffect(() => {
    if (currentHanja) {
      speak(`${currentHanja.sound} ${currentHanja.meaning}`);
    }
  }, [currentHanja]);

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
        vibrateError(); 
        playSound('error');
      },
      onCorrectStroke: function(strokeData) {
        setFeedback("잘하고 있어요! 👍");
      },
      onComplete: function(summaryData) {
        // 랜덤 칭찬 문구 선택
        const randomPraise = PRAISE_PHRASES[Math.floor(Math.random() * PRAISE_PHRASES.length)];
        setFeedback(randomPraise);
        
        vibrateSuccess();
        playSound('success');
        speak(randomPraise); // 칭찬 문구 읽어주기
        
        // 1.5초 뒤 다음 글자로 자동 이동
        setTimeout(() => {
          // 여기서 handleNext를 직접 호출할 수 없으므로(클로저 문제), 
          // 버튼 클릭과 동일한 로직을 수행해야 합니다.
          // 다만 useEffect 안이라 상태 의존성이 복잡하므로,
          // 아래 handleNext가 호출되도록 리팩토링하거나 간단히 외부 트리거를 사용해야 함.
          // 여기선 간단히 다음 버튼을 누르는 효과를 줍니다.
          const nextBtn = document.getElementById('next-btn');
          if (nextBtn) nextBtn.click();
        }, 1500);
      }
    });

  }, [currentIndex, isScriptLoaded, currentHanja]);

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setFeedback("");
      playSound('click');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setFeedback("");
      playSound('click');
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
            <h2 className="text-4xl font-black text-gray-800 mb-2 tracking-tight flex items-center justify-center gap-2">
              <span>{currentHanja.sound} <span className="text-blue-500">{currentHanja.meaning}</span></span>
              <button 
                onClick={() => speak(`${currentHanja.sound} ${currentHanja.meaning}`)}
                className="p-2 bg-blue-100 rounded-full text-blue-500 hover:bg-blue-200 transition-colors"
              >
                <Volume2 size={20} />
              </button>
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
          id="next-btn" /* 자동 넘김을 위한 ID 추가 */
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
    if (round >= 5) return { time: 12, pairs: 10 };
    return { time: 25, pairs: 6 };
  };

  const [round, setRound] = useState(1);
  const [maxTime, setMaxTime] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25);
  
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [comboEffect, setComboEffect] = useState(null); 

  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem(`hanja-best-score-${levelId}`) || '0');
  });

  const startRound = useCallback((roundNum) => {
    const config = getRoundConfig(roundNum);
    setMaxTime(config.time);
    setTimeLeft(config.time);
    setRound(roundNum);
    setMatchedIds([]);
    setSelectedTiles([]);
    setCombo(0);
    setGameState('playing');

    const pairCount = config.pairs;
    const shuffledHanja = [...data].sort(() => 0.5 - Math.random()).slice(0, pairCount);
    
    let gameTiles = [];
    shuffledHanja.forEach(item => {
      gameTiles.push({ id: item.id, type: 'hanja', content: item.char, uniqueId: `${item.id}-h` });
      gameTiles.push({ id: item.id, type: 'meaning', content: `${item.sound} ${item.meaning}`, uniqueId: `${item.id}-m` });
    });

    gameTiles.sort(() => 0.5 - Math.random());
    setTiles(gameTiles);

  }, [data]);

  useEffect(() => {
    startRound(1);
  }, [startRound]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) { 
          setGameState('lost'); 
          if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem(`hanja-best-score-${levelId}`, score.toString());
          }
          vibrateError(); 
          playSound('error');
          return 0; 
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameState, score, bestScore, levelId]);

  const handleTileClick = (tile) => {
    if (gameState !== 'playing') return;
    if (matchedIds.includes(tile.id)) return;
    if (selectedTiles.find(t => t.uniqueId === tile.uniqueId)) return;
    if (selectedTiles.length >= 2) return;

    playSound('click');
    speak(tile.content);

    const newSelected = [...selectedTiles, tile];
    setSelectedTiles(newSelected);

    if (newSelected.length === 2) {
      if (newSelected[0].id === newSelected[1].id) {
        const newMatchedIds = [...matchedIds, newSelected[0].id];
        setMatchedIds(newMatchedIds);
        
        const newCombo = combo + 1;
        setCombo(newCombo);

        const baseScore = 100;
        let multiplier = 1;
        if (newCombo >= 5) multiplier = 2.0;
        else if (newCombo >= 3) multiplier = 1.5;
        else if (newCombo >= 2) multiplier = 1.2;
        
        const addScore = Math.floor(baseScore * multiplier);
        setScore(prev => prev + addScore);

        let timeBonus = 1;
        if (newCombo >= 2) timeBonus = 2;
        if (newCombo >= 5) timeBonus = 3;

        setTimeLeft(prev => Math.min(prev + timeBonus, maxTime));

        vibrateSuccess();
        playSound('success');

        if (newCombo >= 2) {
          setComboEffect(`${newCombo} COMBO! +${addScore} (⏰+${timeBonus}s)`);
          setTimeout(() => setComboEffect(null), 800);
        }

        setSelectedTiles([]);

        if (newMatchedIds.length === tiles.length / 2) {
          const roundTimeBonus = Math.floor(timeLeft * 10);
          setScore(prev => prev + roundTimeBonus);
          setComboEffect(`CLEAR! +${roundTimeBonus}`);
          
          setGameState('clear');
          playSound('success'); 
          
          setTimeout(() => {
             startRound(round + 1);
          }, 1500);
        }

      } else {
        setCombo(0);
        vibrateError();
        playSound('error');
        setTimeout(() => {
          setSelectedTiles([]);
        }, 600);
      }
    }
  };

  const timePercent = (timeLeft / maxTime) * 100;
  let barColor = 'bg-green-500';
  if (timePercent < 50) barColor = 'bg-yellow-400';
  if (timePercent < 20) barColor = 'bg-red-500';

  return (
    <div className="flex flex-col h-full bg-green-50 animate-fade-in relative">
      <div className="bg-white p-3 shadow-md z-10 rounded-b-3xl border-b-4 border-green-100 space-y-2">
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
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden relative shadow-inner">
           <div 
             className={`h-full transition-all duration-100 ease-linear ${barColor} ${timePercent < 20 ? 'animate-pulse' : ''}`}
             style={{ width: `${timePercent}%` }}
           ></div>
        </div>
      </div>

      {comboEffect && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 animate-bounce-short">
          <div className="text-4xl font-black text-yellow-500 drop-shadow-lg stroke-text-white whitespace-nowrap">
            {comboEffect}
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
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
    return levelObj ? levelObj.data : LEVELS[0].data; 
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