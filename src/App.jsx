import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Home, Star, Timer, Trophy, ArrowRight, ArrowLeft, CheckCircle, Zap } from 'lucide-react';

// ==========================================
// 8급 (총 30자)
// ==========================================
const HANJA_LEVEL_8 = [
  { id: 1, char: '九', sound: '아홉', meaning: '구' },
  { id: 2, char: '口', sound: '입', meaning: '구' },
  { id: 3, char: '女', sound: '계집', meaning: '녀' },
  { id: 4, char: '六', sound: '여섯', meaning: '륙' },
  { id: 5, char: '母', sound: '어머니', meaning: '모' },
  { id: 6, char: '木', sound: '나무', meaning: '목' },
  { id: 7, char: '門', sound: '문', meaning: '문' },
  { id: 8, char: '白', sound: '흰', meaning: '백' },
  { id: 9, char: '父', sound: '아버지', meaning: '부' },
  { id: 10, char: '四', sound: '넉', meaning: '사' },
  { id: 11, char: '山', sound: '메', meaning: '산' },
  { id: 12, char: '三', sound: '석', meaning: '삼' },
  { id: 13, char: '上', sound: '위', meaning: '상' },
  { id: 14, char: '小', sound: '작을', meaning: '소' },
  { id: 15, char: '水', sound: '물', meaning: '수' },
  { id: 16, char: '十', sound: '열', meaning: '십' },
  { id: 17, char: '五', sound: '다섯', meaning: '오' },
  { id: 18, char: '王', sound: '임금', meaning: '왕' },
  { id: 19, char: '月', sound: '달', meaning: '월' },
  { id: 20, char: '二', sound: '두', meaning: '이' },
  { id: 21, char: '人', sound: '사람', meaning: '인' },
  { id: 22, char: '日', sound: '날', meaning: '일' },
  { id: 23, char: '一', sound: '한', meaning: '일' },
  { id: 24, char: '子', sound: '아들', meaning: '자' },
  { id: 25, char: '中', sound: '가운데', meaning: '중' },
  { id: 26, char: '七', sound: '일곱', meaning: '칠' },
  { id: 27, char: '土', sound: '흙', meaning: '토' },
  { id: 28, char: '八', sound: '여덟', meaning: '팔' },
  { id: 29, char: '下', sound: '아래', meaning: '하' },
  { id: 30, char: '火', sound: '불', meaning: '화' }
];

// ==========================================
// 7급 (총 20자)
// ==========================================
const HANJA_LEVEL_7 = [
  { id: 31, char: '江', sound: '강', meaning: '강' },
  { id: 32, char: '工', sound: '장인', meaning: '공' },
  { id: 33, char: '金', sound: '쇠', meaning: '금' },
  { id: 34, char: '男', sound: '사내', meaning: '남' },
  { id: 35, char: '力', sound: '힘', meaning: '력' },
  { id: 36, char: '立', sound: '설', meaning: '립' },
  { id: 37, char: '目', sound: '눈', meaning: '목' },
  { id: 38, char: '百', sound: '일백', meaning: '백' },
  { id: 39, char: '生', sound: '날', meaning: '생' },
  { id: 40, char: '石', sound: '돌', meaning: '석' },
  { id: 41, char: '手', sound: '손', meaning: '수' },
  { id: 42, char: '心', sound: '마음', meaning: '심' },
  { id: 43, char: '入', sound: '들', meaning: '입' },
  { id: 44, char: '自', sound: '스스로', meaning: '자' },
  { id: 45, char: '足', sound: '발', meaning: '족' },
  { id: 46, char: '川', sound: '내', meaning: '천' },
  { id: 47, char: '千', sound: '일천', meaning: '천' },
  { id: 48, char: '天', sound: '하늘', meaning: '천' },
  { id: 49, char: '出', sound: '날', meaning: '출' },
  { id: 50, char: '兄', sound: '맏', meaning: '형' }
];

// ==========================================
// 6급 (총 20자)
// ==========================================
const HANJA_LEVEL_6 = [
  { id: 51, char: '南', sound: '남녘', meaning: '남' },
  { id: 52, char: '內', sound: '안', meaning: '내' },
  { id: 53, char: '年', sound: '해', meaning: '년' },
  { id: 54, char: '東', sound: '동녘', meaning: '동' },
  { id: 55, char: '同', sound: '한가지', meaning: '동' },
  { id: 56, char: '名', sound: '이름', meaning: '명' },
  { id: 57, char: '文', sound: '글월', meaning: '문' },
  { id: 58, char: '方', sound: '모', meaning: '방' },
  { id: 59, char: '夫', sound: '지아비', meaning: '부' },
  { id: 60, char: '北', sound: '북녘', meaning: '북' },
  { id: 61, char: '西', sound: '서녘', meaning: '서' },
  { id: 62, char: '夕', sound: '저녁', meaning: '석' },
  { id: 63, char: '少', sound: '적을', meaning: '소' },
  { id: 64, char: '外', sound: '바깥', meaning: '외' },
  { id: 65, char: '正', sound: '바를', meaning: '정' },
  { id: 66, char: '弟', sound: '아우', meaning: '제' },
  { id: 67, char: '主', sound: '주인', meaning: '주' },
  { id: 68, char: '靑', sound: '푸를', meaning: '청' },
  { id: 69, char: '寸', sound: '마디', meaning: '촌' },
  { id: 70, char: '向', sound: '향할', meaning: '향' }
];

// ==========================================
// 준5급 (총 83자)
// ==========================================
const HANJA_LEVEL_5_JUN = [
  { id: 71, char: '歌', sound: '노래', meaning: '가' },
  { id: 72, char: '家', sound: '집', meaning: '가' },
  { id: 73, char: '間', sound: '사이', meaning: '간' },
  { id: 74, char: '車', sound: '수레', meaning: '거' },
  { id: 75, char: '巾', sound: '수건', meaning: '건' },
  { id: 76, char: '古', sound: '예', meaning: '고' },
  { id: 77, char: '空', sound: '빌', meaning: '공' },
  { id: 78, char: '敎', sound: '가르칠', meaning: '교' },
  { id: 79, char: '校', sound: '학교', meaning: '교' },
  { id: 80, char: '國', sound: '나라', meaning: '국' },
  { id: 81, char: '軍', sound: '군사', meaning: '군' },
  { id: 82, char: '今', sound: '이제', meaning: '금' },
  { id: 83, char: '記', sound: '기록할', meaning: '기' },
  { id: 84, char: '氣', sound: '기운', meaning: '기' },
  { id: 85, char: '己', sound: '몸', meaning: '기' },
  { id: 86, char: '農', sound: '농사', meaning: '농' },
  { id: 87, char: '答', sound: '대답', meaning: '답' },
  { id: 88, char: '代', sound: '대신할', meaning: '대' },
  { id: 89, char: '大', sound: '큰', meaning: '대' },
  { id: 90, char: '道', sound: '길', meaning: '도' },
  { id: 91, char: '洞', sound: '골', meaning: '동' },
  { id: 92, char: '登', sound: '오를', meaning: '등' },
  { id: 93, char: '來', sound: '올', meaning: '래' },
  { id: 94, char: '老', sound: '늙을', meaning: '로' },
  { id: 95, char: '里', sound: '마을', meaning: '리' },
  { id: 96, char: '林', sound: '수풀', meaning: '림' },
  { id: 97, char: '馬', sound: '말', meaning: '마' },
  { id: 98, char: '萬', sound: '일만', meaning: '만' },
  { id: 99, char: '末', sound: '끝', meaning: '말' },
  { id: 100, char: '每', sound: '매양', meaning: '매' },
  { id: 101, char: '面', sound: '낯', meaning: '면' },
  { id: 102, char: '問', sound: '물을', meaning: '문' },
  { id: 103, char: '物', sound: '물건', meaning: '물' },
  { id: 104, char: '民', sound: '백성', meaning: '민' },
  { id: 105, char: '本', sound: '근본', meaning: '본' },
  { id: 106, char: '不', sound: '아니', meaning: '불' },
  { id: 107, char: '分', sound: '나눌', meaning: '분' },
  { id: 108, char: '士', sound: '선비', meaning: '사' },
  { id: 109, char: '事', sound: '일', meaning: '사' },
  { id: 110, char: '色', sound: '빛', meaning: '색' },
  { id: 111, char: '先', sound: '먼저', meaning: '선' },
  { id: 112, char: '姓', sound: '성씨', meaning: '성' },
  { id: 113, char: '世', sound: '세상', meaning: '세' },
  { id: 114, char: '所', sound: '바', meaning: '소' },
  { id: 115, char: '時', sound: '때', meaning: '시' },
  { id: 116, char: '市', sound: '저자', meaning: '시' },
  { id: 117, char: '食', sound: '먹을', meaning: '식' },
  { id: 118, char: '植', sound: '심을', meaning: '식' },
  { id: 119, char: '室', sound: '집', meaning: '실' },
  { id: 120, char: '安', sound: '편안할', meaning: '안' },
  { id: 121, char: '羊', sound: '양', meaning: '양' },
  { id: 122, char: '語', sound: '말씀', meaning: '어' },
  { id: 123, char: '午', sound: '낮', meaning: '오' },
  { id: 124, char: '玉', sound: '구슬', meaning: '옥' },
  { id: 125, char: '牛', sound: '소', meaning: '우' },
  { id: 126, char: '右', sound: '오른', meaning: '우' },
  { id: 127, char: '位', sound: '자리', meaning: '위' },
  { id: 128, char: '有', sound: '있을', meaning: '유' },
  { id: 129, char: '育', sound: '기를', meaning: '육' },
  { id: 130, char: '邑', sound: '고을', meaning: '읍' },
  { id: 131, char: '衣', sound: '옷', meaning: '의' },
  { id: 132, char: '耳', sound: '귀', meaning: '이' },
  { id: 133, char: '字', sound: '글자', meaning: '자' },
  { id: 134, char: '長', sound: '긴', meaning: '장' },
  { id: 135, char: '場', sound: '마당', meaning: '장' },
  { id: 136, char: '電', sound: '번개', meaning: '전' },
  { id: 137, char: '前', sound: '앞', meaning: '전' },
  { id: 138, char: '全', sound: '온전할', meaning: '전' },
  { id: 139, char: '祖', sound: '할아비', meaning: '조' },
  { id: 140, char: '左', sound: '왼', meaning: '좌' },
  { id: 141, char: '住', sound: '살', meaning: '주' },
  { id: 142, char: '地', sound: '땅', meaning: '지' },
  { id: 143, char: '草', sound: '풀', meaning: '초' },
  { id: 144, char: '平', sound: '평평할', meaning: '평' },
  { id: 145, char: '學', sound: '배울', meaning: '학' },
  { id: 146, char: '韓', sound: '나라이름', meaning: '한' },
  { id: 147, char: '漢', sound: '한수', meaning: '한' },
  { id: 148, char: '合', sound: '합할', meaning: '합' },
  { id: 149, char: '海', sound: '바다', meaning: '해' },
  { id: 150, char: '孝', sound: '효도', meaning: '효' },
  { id: 151, char: '休', sound: '쉴', meaning: '휴' }
];

// ==========================================
// 5급 (총 110자)
// ==========================================
const HANJA_LEVEL_5 = [
  { id: 152, char: '各', sound: '각각', meaning: '각' },
  { id: 153, char: '感', sound: '느낄', meaning: '감' },
  { id: 154, char: '强', sound: '강할', meaning: '강' },
  { id: 155, char: '開', sound: '열', meaning: '개' },
  { id: 156, char: '去', sound: '갈', meaning: '거' },
  { id: 157, char: '犬', sound: '개', meaning: '견' },
  { id: 158, char: '見', sound: '볼', meaning: '견' },
  { id: 159, char: '京', sound: '서울', meaning: '경' },
  { id: 160, char: '計', sound: '셀', meaning: '계' },
  { id: 161, char: '界', sound: '지경', meaning: '계' },
  { id: 162, char: '苦', sound: '괴로울', meaning: '고' },
  { id: 163, char: '高', sound: '높을', meaning: '고' },
  { id: 164, char: '功', sound: '공', meaning: '공' },
  { id: 165, char: '共', sound: '함께', meaning: '공' },
  { id: 166, char: '科', sound: '과목', meaning: '과' },
  { id: 167, char: '果', sound: '과실', meaning: '과' },
  { id: 168, char: '光', sound: '빛', meaning: '광' },
  { id: 169, char: '交', sound: '사귈', meaning: '교' },
  { id: 170, char: '郡', sound: '고을', meaning: '군' },
  { id: 171, char: '近', sound: '가까울', meaning: '근' },
  { id: 172, char: '根', sound: '뿌리', meaning: '근' },
  { id: 173, char: '急', sound: '급할', meaning: '급' },
  { id: 174, char: '多', sound: '많을', meaning: '다' },
  { id: 175, char: '短', sound: '짧을', meaning: '단' },
  { id: 176, char: '當', sound: '마땅할', meaning: '당' },
  { id: 177, char: '堂', sound: '집', meaning: '당' },
  { id: 178, char: '對', sound: '대답할', meaning: '대' },
  { id: 179, char: '圖', sound: '그림', meaning: '도' },
  { id: 180, char: '度', sound: '법도', meaning: '도' },
  { id: 181, char: '刀', sound: '칼', meaning: '도' },
  { id: 182, char: '讀', sound: '읽을', meaning: '독' },
  { id: 183, char: '冬', sound: '겨울', meaning: '동' },
  { id: 184, char: '童', sound: '아이', meaning: '동' },
  { id: 185, char: '頭', sound: '머리', meaning: '두' },
  { id: 186, char: '等', sound: '무리', meaning: '등' },
  { id: 187, char: '樂', sound: '즐거울', meaning: '락' },
  { id: 188, char: '禮', sound: '예도', meaning: '례' },
  { id: 189, char: '路', sound: '길', meaning: '로' },
  { id: 190, char: '綠', sound: '푸를', meaning: '록' },
  { id: 191, char: '理', sound: '다스릴', meaning: '리' },
  { id: 192, char: '李', sound: '오얏(자두)', meaning: '리' },
  { id: 193, char: '利', sound: '이로울', meaning: '리' },
  { id: 194, char: '命', sound: '목숨', meaning: '명' },
  { id: 195, char: '明', sound: '밝을', meaning: '명' },
  { id: 196, char: '毛', sound: '털', meaning: '모' },
  { id: 197, char: '無', sound: '없을', meaning: '무' },
  { id: 198, char: '聞', sound: '들을', meaning: '문' },
  { id: 199, char: '米', sound: '쌀', meaning: '미' },
  { id: 200, char: '美', sound: '아름다울', meaning: '미' },
  { id: 201, char: '朴', sound: '순박할', meaning: '박' },
  { id: 202, char: '反', sound: '돌이킬', meaning: '반' },
  { id: 203, char: '半', sound: '절반', meaning: '반' },
  { id: 204, char: '發', sound: '필', meaning: '발' },
  { id: 205, char: '放', sound: '놓을', meaning: '방' },
  { id: 206, char: '番', sound: '차례', meaning: '번' },
  { id: 207, char: '別', sound: '다를', meaning: '별' },
  { id: 208, char: '病', sound: '병', meaning: '병' },
  { id: 209, char: '步', sound: '걸음', meaning: '보' },
  { id: 210, char: '服', sound: '옷', meaning: '복' },
  { id: 211, char: '部', sound: '거느릴', meaning: '부' },
  { id: 212, char: '死', sound: '죽을', meaning: '사' },
  { id: 213, char: '書', sound: '글', meaning: '서' },
  { id: 214, char: '席', sound: '자리', meaning: '석' },
  { id: 215, char: '線', sound: '줄', meaning: '선' },
  { id: 216, char: '省', sound: '살필', meaning: '성' },
  { id: 217, char: '性', sound: '성품', meaning: '성' },
  { id: 218, char: '成', sound: '이룰', meaning: '성' },
  { id: 219, char: '消', sound: '사라질', meaning: '소' },
  { id: 220, char: '速', sound: '빠를', meaning: '속' },
  { id: 221, char: '孫', sound: '손자', meaning: '손' },
  { id: 222, char: '樹', sound: '나무', meaning: '수' },
  { id: 223, char: '首', sound: '머리', meaning: '수' },
  { id: 224, char: '習', sound: '익힐', meaning: '습' },
  { id: 225, char: '勝', sound: '이길', meaning: '승' },
  { id: 226, char: '詩', sound: '글', meaning: '시' },
  { id: 227, char: '示', sound: '보일', meaning: '시' },
  { id: 228, char: '始', sound: '처음', meaning: '시' },
  { id: 229, char: '式', sound: '법', meaning: '식' },
  { id: 230, char: '神', sound: '귀신', meaning: '신' },
  { id: 231, char: '身', sound: '몸', meaning: '신' },
  { id: 232, char: '信', sound: '믿을', meaning: '신' },
  { id: 233, char: '新', sound: '새로울', meaning: '신' },
  { id: 234, char: '失', sound: '잃을', meaning: '실' },
  { id: 235, char: '愛', sound: '사랑', meaning: '애' },
  { id: 236, char: '野', sound: '들', meaning: '야' },
  { id: 237, char: '夜', sound: '밤', meaning: '야' },
  { id: 238, char: '藥', sound: '약', meaning: '약' },
  { id: 239, char: '弱', sound: '약할', meaning: '약' },
  { id: 240, char: '陽', sound: '볕', meaning: '양' },
  { id: 241, char: '洋', sound: '큰바다', meaning: '양' },
  { id: 242, char: '魚', sound: '물고기', meaning: '어' },
  { id: 243, char: '言', sound: '말씀', meaning: '언' },
  { id: 244, char: '業', sound: '일', meaning: '업' },
  { id: 245, char: '永', sound: '길', meaning: '영' },
  { id: 246, char: '英', sound: '꽃부리', meaning: '영' },
  { id: 247, char: '勇', sound: '날쌜', meaning: '용' },
  { id: 248, char: '用', sound: '쓸', meaning: '용' },
  { id: 249, char: '友', sound: '벗', meaning: '우' },
  { id: 250, char: '運', sound: '움직일', meaning: '운' },
  { id: 251, char: '遠', sound: '멀', meaning: '원' },
  { id: 252, char: '原', sound: '언덕/근본', meaning: '원' },
  { id: 253, char: '元', sound: '으뜸', meaning: '원' },
  { id: 254, char: '油', sound: '기름', meaning: '유' },
  { id: 255, char: '肉', sound: '고기', meaning: '육' },
  { id: 256, char: '銀', sound: '은', meaning: '은' },
  { id: 257, char: '飮', sound: '마실', meaning: '음' },
  { id: 258, char: '音', sound: '소리', meaning: '음' },
  { id: 259, char: '意', sound: '뜻', meaning: '의' },
  { id: 260, char: '者', sound: '놈', meaning: '자' },
  { id: 261, char: '昨', sound: '어제', meaning: '작' },
  { id: 262, char: '作', sound: '지을', meaning: '작' },
  { id: 263, char: '章', sound: '글', meaning: '장' },
  { id: 264, char: '在', sound: '있을', meaning: '재' },
  { id: 265, char: '才', sound: '재주', meaning: '재' },
  { id: 266, char: '田', sound: '밭', meaning: '전' },
  { id: 267, char: '題', sound: '제목', meaning: '제' },
  { id: 268, char: '第', sound: '차례', meaning: '제' },
  { id: 269, char: '朝', sound: '아침', meaning: '조' },
  { id: 270, char: '族', sound: '겨레', meaning: '족' },
  { id: 271, char: '晝', sound: '낮', meaning: '주' },
  { id: 272, char: '竹', sound: '대', meaning: '죽' },
  { id: 273, char: '重', sound: '무거울', meaning: '중' },
  { id: 274, char: '直', sound: '곧을', meaning: '직' },
  { id: 275, char: '窓', sound: '창문', meaning: '창' },
  { id: 276, char: '淸', sound: '맑을', meaning: '청' },
  { id: 277, char: '體', sound: '몸', meaning: '체' },
  { id: 278, char: '村', sound: '마을', meaning: '촌' },
  { id: 279, char: '秋', sound: '가을', meaning: '추' },
  { id: 280, char: '春', sound: '봄', meaning: '춘' },
  { id: 281, char: '親', sound: '친할', meaning: '친' },
  { id: 282, char: '太', sound: '클', meaning: '태' },
  { id: 283, char: '通', sound: '통할', meaning: '통' },
  { id: 284, char: '貝', sound: '조개', meaning: '패' },
  { id: 285, char: '便', sound: '편할', meaning: '편' },
  { id: 286, char: '表', sound: '겉', meaning: '표' },
  { id: 287, char: '品', sound: '물건', meaning: '품' },
  { id: 288, char: '風', sound: '바람', meaning: '풍' },
  { id: 289, char: '夏', sound: '여름', meaning: '하' },
  { id: 290, char: '行', sound: '다닐', meaning: '행' },
  { id: 291, char: '幸', sound: '다행', meaning: '행' },
  { id: 292, char: '血', sound: '피', meaning: '혈' },
  { id: 293, char: '形', sound: '모양', meaning: '형' },
  { id: 294, char: '號', sound: '이름', meaning: '호' },
  { id: 295, char: '花', sound: '꽃', meaning: '화' },
  { id: 296, char: '話', sound: '말씀', meaning: '화' },
  { id: 297, char: '和', sound: '화목할', meaning: '화' },
  { id: 298, char: '活', sound: '살', meaning: '활' },
  { id: 299, char: '黃', sound: '누를', meaning: '황' },
  { id: 300, char: '會', sound: '모일', meaning: '회' },
  { id: 301, char: '後', sound: '뒤', meaning: '후' }
];

// 🔴 수정 포인트: 색상 매핑 테이블 추가
// Tailwind는 동적 클래스(`bg-${color}-400`)를 인식하지 못하므로, 정적 객체로 선언해야 합니다.
const LEVEL_STYLES = {
  yellow: { bg: 'bg-yellow-400', text: 'text-white', ring: 'ring-yellow-200' },
  green: { bg: 'bg-green-400', text: 'text-white', ring: 'ring-green-200' },
  blue: { bg: 'bg-blue-400', text: 'text-white', ring: 'ring-blue-200' },
  purple: { bg: 'bg-purple-400', text: 'text-white', ring: 'ring-purple-200' },
  red: { bg: 'bg-red-400', text: 'text-white', ring: 'ring-red-200' },
};

// 레벨 목록 정의
const LEVELS = [
  { id: 8, label: '8급', data: HANJA_LEVEL_8, color: 'yellow', locked: false },
  { id: 7, label: '7급', data: HANJA_LEVEL_7, color: 'green', locked: false },
  { id: 6, label: '6급', data: HANJA_LEVEL_6, color: 'blue', locked: false },
  { id: 55, label: '준5급', data: HANJA_LEVEL_5_JUN, color: 'purple', locked: false },
  { id: 5, label: '5급', data: HANJA_LEVEL_5, color: 'red', locked: false },
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
      <div className="flex flex-wrap justify-center gap-2">
        {LEVELS.map((level) => {
          // 🔴 수정 포인트: 스타일 객체 사용
          // 동적 생성 대신 LEVEL_STYLES에서 직접 클래스를 가져옵니다.
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
    return levelObj ? levelObj.data : HANJA_LEVEL_8;
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