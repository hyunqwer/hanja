import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Home, Star, Timer, Trophy, ArrowRight, ArrowLeft, CheckCircle, Zap } from 'lucide-react';

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

// --- 7급 전체 배정한자 (준7급 + 7급 신규 100자) ---
const HANJA_DATA_LEVEL_7_FULL = [
  // ㄱ (14자)
  { id: 51, char: '家', sound: '집', meaning: '가' },
  { id: 52, char: '歌', sound: '노래', meaning: '가' },
  { id: 53, char: '間', sound: '사이', meaning: '간' },
  { id: 54, char: '江', sound: '강', meaning: '강' },
  { id: 55, char: '車', sound: '수레', meaning: '차' },
  { id: 56, char: '工', sound: '장인', meaning: '공' },
  { id: 57, char: '空', sound: '빌', meaning: '공' },
  { id: 58, char: '口', sound: '입', meaning: '구' },
  { id: 59, char: '氣', sound: '기운', meaning: '기' },
  { id: 60, char: '記', sound: '기록할', meaning: '기' },
  { id: 61, char: '旗', sound: '기', meaning: '기' },
  { id: 62, char: '其', sound: '그', meaning: '기' },
  
  // ㄴ (5자)
  { id: 63, char: '男', sound: '사내', meaning: '남' },
  { id: 64, char: '內', sound: '안', meaning: '내' },
  { id: 65, char: '農', sound: '농사', meaning: '농' },
  
  // ㄷ (9자)
  { id: 66, char: '答', sound: '대답', meaning: '답' },
  { id: 67, char: '道', sound: '길', meaning: '도' },
  { id: 68, char: '冬', sound: '겨울', meaning: '동' },
  { id: 69, char: '動', sound: '움직일', meaning: '동' },
  { id: 70, char: '同', sound: '한가지', meaning: '동' },
  { id: 71, char: '洞', sound: '골', meaning: '동' },
  { id: 72, char: '登', sound: '오를', meaning: '등' },

  // ㄹ (6자)
  { id: 73, char: '來', sound: '올', meaning: '래' },
  { id: 74, char: '力', sound: '힘', meaning: '력' },
  { id: 75, char: '老', sound: '늙을', meaning: '로' },
  { id: 76, char: '里', sound: '마을', meaning: '리' },
  { id: 77, char: '林', sound: '수풀', meaning: '림' },
  { id: 78, char: '立', sound: '설', meaning: '립' },

  // ㅁ (8자)
  { id: 79, char: '每', sound: '매양', meaning: '매' },
  { id: 80, char: '面', sound: '낯', meaning: '면' },
  { id: 81, char: '名', sound: '이름', meaning: '명' },
  { id: 82, char: '命', sound: '목숨', meaning: '명' },
  { id: 83, char: '文', sound: '글월', meaning: '문' },
  { id: 84, char: '問', sound: '물을', meaning: '문' },
  { id: 85, char: '物', sound: '물건', meaning: '물' },

  // ㅂ (8자)
  { id: 86, char: '方', sound: '모', meaning: '방' },
  { id: 87, char: '百', sound: '일백', meaning: '백' },
  { id: 88, char: '夫', sound: '지아비', meaning: '부' },
  { id: 89, char: '不', sound: '아닐', meaning: '부' },
  
  // ㅅ (15자)
  { id: 90, char: '事', sound: '일', meaning: '사' },
  { id: 91, char: '算', sound: '셈할', meaning: '산' },
  { id: 92, char: '上', sound: '위', meaning: '상' },
  { id: 93, char: '色', sound: '빛', meaning: '색' },
  { id: 94, char: '夕', sound: '저녁', meaning: '석' },
  { id: 95, char: '姓', sound: '성', meaning: '성' },
  { id: 96, char: '世', sound: '인간', meaning: '세' },
  { id: 97, char: '少', sound: '적을', meaning: '소' },
  { id: 98, char: '所', sound: '바', meaning: '소' },
  { id: 99, char: '手', sound: '손', meaning: '수' },
  { id: 100, char: '數', sound: '셈', meaning: '수' },
  { id: 101, char: '市', sound: '저자', meaning: '시' },
  { id: 102, char: '時', sound: '때', meaning: '시' },
  { id: 103, char: '食', sound: '밥', meaning: '식' },
  { id: 104, char: '植', sound: '심을', meaning: '식' },
  { id: 105, char: '心', sound: '마음', meaning: '심' },

  // ㅇ (11자)
  { id: 106, char: '安', sound: '편안', meaning: '안' },
  { id: 107, char: '語', sound: '말씀', meaning: '어' },
  { id: 108, char: '然', sound: '그러할', meaning: '연' },
  { id: 109, char: '午', sound: '낮', meaning: '오' },
  { id: 110, char: '右', sound: '오른', meaning: '우' },
  { id: 111, char: '有', sound: '있을', meaning: '유' },
  { id: 112, char: '育', sound: '기를', meaning: '육' },
  { id: 113, char: '邑', sound: '고을', meaning: '읍' },
  { id: 114, char: '入', sound: '들', meaning: '입' },

  // ㅈ (15자)
  { id: 115, char: '子', sound: '아들', meaning: '자' },
  { id: 116, char: '字', sound: '글자', meaning: '자' },
  { id: 117, char: '自', sound: '스스로', meaning: '자' },
  { id: 118, char: '場', sound: '마당', meaning: '장' },
  { id: 119, char: '全', sound: '온전', meaning: '전' },
  { id: 120, char: '前', sound: '앞', meaning: '전' },
  { id: 121, char: '電', sound: '번개', meaning: '전' },
  { id: 122, char: '正', sound: '바를', meaning: '정' },
  { id: 123, char: '祖', sound: '할아비', meaning: '조' },
  { id: 124, char: '足', sound: '발', meaning: '족' },
  { id: 125, char: '左', sound: '왼', meaning: '좌' },
  { id: 126, char: '主', sound: '주인', meaning: '주' },
  { id: 127, char: '住', sound: '살', meaning: '주' },
  { id: 128, char: '重', sound: '무거울', meaning: '중' },
  { id: 129, char: '地', sound: '땅', meaning: '지' },
  { id: 130, char: '紙', sound: '종이', meaning: '지' },
  { id: 131, char: '直', sound: '곧을', meaning: '직' },

  // ㅊ (6자)
  { id: 132, char: '千', sound: '일천', meaning: '천' },
  { id: 133, char: '川', sound: '내', meaning: '천' },
  { id: 134, char: '天', sound: '하늘', meaning: '천' },
  { id: 135, char: '草', sound: '풀', meaning: '초' },
  { id: 136, char: '村', sound: '마을', meaning: '촌' },
  { id: 137, char: '秋', sound: '가을', meaning: '추' },
  { id: 138, char: '春', sound: '봄', meaning: '춘' },
  { id: 139, char: '出', sound: '날', meaning: '출' },

  // ㅍ (3자)
  { id: 140, char: '便', sound: '편안', meaning: '편' },
  { id: 141, char: '平', sound: '평평할', meaning: '평' },

  // ㅎ (10자)
  { id: 142, char: '下', sound: '아래', meaning: '하' },
  { id: 143, char: '夏', sound: '여름', meaning: '하' },
  { id: 144, char: '漢', sound: '한수', meaning: '한' },
  { id: 145, char: '海', sound: '바다', meaning: '해' },
  { id: 146, char: '花', sound: '꽃', meaning: '화' },
  { id: 147, char: '話', sound: '말씀', meaning: '화' },
  { id: 148, char: '活', sound: '살', meaning: '활' },
  { id: 149, char: '孝', sound: '효도', meaning: '효' },
  { id: 150, char: '後', sound: '뒤', meaning: '후' },
  { id: 151, char: '休', sound: '쉴', meaning: '휴' },
];

// 레벨 목록 정의
const LEVELS = [
  { id: 8, label: '8급', data: HANJA_DATA_LEVEL_8, color: 'yellow' },
  { id: 7, label: '7급', data: HANJA_DATA_LEVEL_7_FULL, color: 'green', locked: false }, // 7급 잠금 해제
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

// --- 컴포넌트: 게임 모드 (라운드 시스템 & 타임어택) ---
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

        // 콤보 이펙트 표시
        if (newCombo >= 2) {
          setComboEffect(`${newCombo} COMBO! +${addScore}`);
          setTimeout(() => setComboEffect(null), 800);
        }

        setSelectedTiles([]);

        // 라운드 클리어 체크
        if (newMatchedIds.length === tiles.length / 2) {
          // 시간 보너스
          const timeBonus = Math.floor(timeLeft * 10);
          setScore(prev => prev + timeBonus);
          setComboEffect(`CLEAR! +${timeBonus}`);
          
          setGameState('clear');
          
          // 1.5초 후 다음 라운드
          setTimeout(() => {
             startRound(round + 1);
          }, 1500);
        }

      } else {
        // 2. 매칭 실패
        setCombo(0); // 콤보 초기화
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
          </div>
          
        </div>
      </div>
    </>
  );
}