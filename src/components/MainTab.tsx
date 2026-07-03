/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { CupState, GuaResult, ThrowRecord, UserSettings, WishTemplate } from '../types';
import { ShengBeiModel } from './ShengBeiModel';
import { audioSynth } from '../utils/audio';
import { Sparkles, HelpCircle, FileText, Check, Plus, Trash2, ShieldAlert, Sparkle } from 'lucide-react';

interface MainTabProps {
  settings: UserSettings;
  themeId: string;
  onAddRecord: (record: ThrowRecord) => void;
  onNavigateToHistory: () => void;
}

// Chao Shan Native Oracle Commentary Databank
export const GUA_DATA = {
  [GuaResult.SHENG_BEI]: {
    name: '胜杯',
    alias: '圣杯 / 顺卦',
    vernacular: '双杯落地，一正一反。神明欢喜，万事大吉！',
    pronunciation: 'Boh-buey',
    meaning: '所求之事大吉，神明应允，可行可成，诸事顺遂。',
    advice: '当下气势亨通，所求心愿顺应天时地利，宜积极推进。心怀虔诚，行善积德，必得贵人扶持，求财得财，求缘得缘。',
  },
  [GuaResult.XIAO_BEI]: {
    name: '笑杯',
    alias: '阳杯 / 留卦',
    vernacular: '双杯皆仰，神明微笑。天机未露，暂且宽心。',
    pronunciation: 'Chio-buey',
    meaning: '事情模糊未定，时机未到，建议暂缓诉求、静心等待，可择日再请示。',
    advice: '神明笑而不答，说明所问之事当前因缘尚不具足，或祈愿表述不清。建议平复心神，切勿焦躁，梳理计划，蓄势待发。',
  },
  [GuaResult.YIN_BEI]: {
    name: '阴杯',
    alias: '没杯 / 哭杯 / 逆卦',
    vernacular: '双杯皆俯，神明摇头。气运未至，宜守不宜进。',
    pronunciation: 'Em-buey',
    meaning: '所求之事暂时不可行，当下时机不合，需调整心态与计划，暂缓推进。',
    advice: '当下阻碍重重，强行推进恐多生波折。神明示意非为责罚，实乃护佑，宜退守修身，反思补缺。避其锋芒，静待来日转机。',
  },
};

// Default traditional Chao Shan blessing templates
const DEFAULT_TEMPLATES: WishTemplate[] = [
  { id: 't1', category: 'career', title: '事业腾飞', content: '祈求此行工作顺利，贵人引路，项目如期推进，事业更上一层楼。' },
  { id: 't2', category: 'love', title: '求得佳缘', content: '祈求姻缘和合，夫妻和睦，彼此体贴谅解，小家庭和美岁安。' },
  { id: 't3', category: 'health', title: '全家安康', content: '祈求家中长辈及孩童四季无灾，身体康健，疾病退散，出入平安。' },
  { id: 't4', category: 'wealth', title: '财源广进', content: '祈求生意兴隆，财路通达，交易公平，勤劳致富，衣食无忧。' },
  { id: 't5', category: 'education', title: '学业有成', content: '祈求考运亨通，头脑清明，所学皆能致用，考试取得理想佳绩。' },
];

export const MainTab: React.FC<MainTabProps> = ({
  settings,
  themeId,
  onAddRecord,
  onNavigateToHistory,
}) => {
  // Core game state
  const [cupState, setCupState] = useState<CupState>(CupState.INITIAL);
  const [wish, setWish] = useState('');
  const [showWishDrawer, setShowWishDrawer] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<WishTemplate[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'career' | 'love' | 'health' | 'wealth' | 'education'>('all');
  
  // Custom templates text field
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');
  const [showAddTemplateForm, setShowAddTemplateForm] = useState(false);

  // Animation physical simulation state
  const [cup1, setCup1] = useState({ x: -45, y: 0, rotX: 0, rotY: 0, rotZ: -20, scale: 1, side: 'convex' as 'flat' | 'convex' });
  const [cup2, setCup2] = useState({ x: 45, y: 0, rotX: 0, rotY: 180, rotZ: 20, scale: 1, side: 'convex' as 'flat' | 'convex' });
  
  // Throw result state
  const [result, setResult] = useState<GuaResult | null>(null);
  const [showResultCard, setShowResultCard] = useState(false);
  const [savedThisTurn, setSavedThisTurn] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Gesture detection refs & states
  const [touchLeftHeld, setTouchLeftHeld] = useState(false);
  const [touchRightHeld, setTouchRightHeld] = useState(false);
  const [desktopMode, setDesktopMode] = useState(false);

  const startTouches = useRef<{ [key: number]: { x: number; y: number } }>({});
  const swipeTriggered = useRef(false);
  const animationFrameId = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Incense/smoke particle effect setup
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; opacity: number; vx: number; vy: number }[]>([]);

  // Local storage for custom templates
  useEffect(() => {
    const saved = localStorage.getItem('cs_custom_templates');
    if (saved) {
      try {
        setCustomTemplates(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Update particles loop
  useEffect(() => {
    if (!settings.particlesEnabled) {
      setParticles([]);
      return;
    }

    const interval = setInterval(() => {
      setParticles((prev) => {
        // Move existing particles up & sway
        let updated = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx + Math.sin(p.y / 25) * 0.3,
            y: p.y + p.vy,
            opacity: p.opacity - 0.005,
          }))
          .filter((p) => p.opacity > 0 && p.y > -50);

        // Spawn a new particle from the bottom center (representing incense aroma)
        if (updated.length < 28 && Math.random() < 0.25) {
          updated.push({
            id: Math.random(),
            x: 45 + Math.random() * 10, // around middle width
            y: 90 + Math.random() * 5,  // bottom area
            size: 2 + Math.random() * 4,
            opacity: 0.35 + Math.random() * 0.45,
            vx: (Math.random() - 0.5) * 0.15,
            vy: -0.35 - Math.random() * 0.35,
          });
        }
        return updated;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [settings.particlesEnabled]);

  // Handle touch audio trigger on grip change
  useEffect(() => {
    if (touchLeftHeld && touchRightHeld) {
      if (cupState === CupState.INITIAL) {
        setCupState(CupState.HELD);
        audioSynth.startGripHum();
      }
    } else {
      if (cupState === CupState.HELD) {
        setCupState(CupState.INITIAL);
        audioSynth.stopGripHum();
      }
    }
  }, [touchLeftHeld, touchRightHeld]);

  // Cleanup audio hum on unmount
  useEffect(() => {
    return () => {
      audioSynth.stopGripHum();
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Detect if touch is available, if not, let's nudge the user towards PC desktop keys
  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!hasTouch) {
      setDesktopMode(true);
    }
  }, []);

  // Keyboard desktop simulation handler (F & J keys)
  useEffect(() => {
    if (!desktopMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (cupState === CupState.THROWING || showResultCard) return;
      
      const key = e.key.toLowerCase();
      if (key === 'f') {
        setTouchLeftHeld(true);
      }
      if (key === 'j') {
        setTouchRightHeld(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'f') {
        setTouchLeftHeld(false);
      }
      if (key === 'j') {
        setTouchRightHeld(false);
      }
      
      // If holding both and pressed ArrowUp or Space, trigger throw
      if ((key === ' ' || key === 'arrowup') && touchLeftHeld && touchRightHeld && cupState === CupState.HELD) {
        triggerThrow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [desktopMode, touchLeftHeld, touchRightHeld, cupState, showResultCard]);

  // Auto scroll down to result card when shown
  useEffect(() => {
    if (showResultCard) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }, 400);
    }
  }, [showResultCard]);

  // Swipe gesture calculations
  const handleTouchStart = (e: React.TouchEvent) => {
    if (cupState === CupState.THROWING || showResultCard) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;

    Array.from(e.changedTouches).forEach((touch: any) => {
      const touchX = touch.clientX - rect.left;
      const xPercent = (touchX / width) * 100;

      // Identify Left vs Right zones (Left 45%, Right 45%)
      if (xPercent < 45) {
        setTouchLeftHeld(true);
        startTouches.current[touch.identifier] = { x: touch.clientX, y: touch.clientY };
      } else if (xPercent > 55) {
        setTouchRightHeld(true);
        startTouches.current[touch.identifier] = { x: touch.clientX, y: touch.clientY };
      }
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (cupState !== CupState.HELD || swipeTriggered.current) return;

    // Check if both fingers are moving up rapidly
    let bothMovingUp = true;
    let dragDistanceY = 0;

    Array.from(e.touches).forEach((touch: any) => {
      const start = startTouches.current[touch.identifier];
      if (start) {
        const diffY = touch.clientY - start.y;
        dragDistanceY = diffY;
        // Slide upwards means negative Y delta
        if (diffY > -45) {
          bothMovingUp = false;
        }
      } else {
        bothMovingUp = false;
      }
    });

    // If successfully swiped up past threshold
    if (bothMovingUp && e.touches.length >= 2) {
      swipeTriggered.current = true;
      triggerThrow();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    Array.from(e.changedTouches).forEach((touch: any) => {
      delete startTouches.current[touch.identifier];
    });

    if (e.touches.length === 0) {
      setTouchLeftHeld(false);
      setTouchRightHeld(false);
      swipeTriggered.current = false;
    } else {
      // Re-evaluate left/right zones for remaining fingers
      const rect = e.currentTarget.getBoundingClientRect();
      const width = rect.width;
      let leftStillActive = false;
      let rightStillActive = false;

      Array.from(e.touches).forEach((touch: any) => {
        const touchX = touch.clientX - rect.left;
        const xPercent = (touchX / width) * 100;
        if (xPercent < 45) leftStillActive = true;
        if (xPercent > 55) rightStillActive = true;
      });

      setTouchLeftHeld(leftStillActive);
      setTouchRightHeld(rightStillActive);
    }
  };

  const handleTouchCancel = () => {
    setTouchLeftHeld(false);
    setTouchRightHeld(false);
    startTouches.current = {};
    swipeTriggered.current = false;
  };

  // Trigger the actual Throw sequence
  const triggerThrow = () => {
    if (cupState === CupState.THROWING) return;

    // Reset hands feedback
    setTouchLeftHeld(false);
    setTouchRightHeld(false);
    audioSynth.stopGripHum();

    // Sound and vibration feedback
    if (settings.vibrationEnabled) {
      try {
        navigator.vibrate(55);
      } catch (e) {}
    }
    audioSynth.playWhoosh();

    setCupState(CupState.THROWING);
    setSavedThisTurn(false);

    // Randomize the outcome based on traditional probabilities:
    // Sheng Bei (40%), Xiao Bei (30%), Yin Bei (30%)
    const rand = Math.random() * 100;
    let throwGua: GuaResult;
    if (rand < 40) {
      throwGua = GuaResult.SHENG_BEI;
    } else if (rand < 70) {
      throwGua = GuaResult.XIAO_BEI;
    } else {
      throwGua = GuaResult.YIN_BEI;
    }

    setResult(throwGua);

    // Run custom high-performance physics flight loop (2.2 seconds)
    simulateCupsFlight(throwGua);
  };

  // Interactive 3D Physics Animation Loop (2.2s total)
  const simulateCupsFlight = (outcome: GuaResult) => {
    const startTime = Date.now();
    const duration = 2200; // 2.2 seconds mandatory

    // Configure landing sides based on outcome
    // Sheng Bei: one flat, one convex
    // Xiao Bei: both flat (inner side)
    // Yin Bei: both convex (outer curved side)
    const landingConfig = {
      cup1Side: outcome === GuaResult.XIAO_BEI ? 'flat' : 'convex',
      cup2Side: outcome === GuaResult.SHENG_BEI ? 'flat' : (outcome === GuaResult.XIAO_BEI ? 'flat' : 'convex'),
    };

    const runPhysics = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 1) {
        // --- Cup 1 physics (Left side cup) ---
        // Altitude parabola (Peak around 0.45 progress)
        const heightMultiplier = settings.performanceMode === '3D' ? 380 : 180;
        const yPos = -Math.sin(progress * Math.PI) * heightMultiplier;
        
        // Spin speeds (fast rotating in the air)
        const totalRotations = 5;
        const rX1 = progress * 360 * totalRotations;
        const rY1 = progress * 180 * totalRotations + (progress > 0.6 && landingConfig.cup1Side === 'flat' ? 180 : 0);
        const rZ1 = -20 + progress * 720;
        
        // Lateral translation (cups drift apart then fall closer)
        const xPos1 = -45 - Math.sin(progress * Math.PI) * 55;

        // Scale mimics perspective (gets closer to camera then falls away)
        const scale1 = 1 + Math.sin(progress * Math.PI) * 0.45;

        // Dynamic mid-air orientation flip
        const midAirSide1 = (Math.floor(progress * 15) % 2 === 0) ? 'convex' : 'flat';

        // --- Cup 2 physics (Right side cup) ---
        const rX2 = progress * 360 * totalRotations * 0.9; // slight offset for organic asymmetry
        const rY2 = 180 + progress * 180 * totalRotations + (progress > 0.6 && landingConfig.cup2Side === 'flat' ? 180 : 0);
        const rZ2 = 20 - progress * 720;
        const xPos2 = 45 + Math.sin(progress * Math.PI) * 55;
        const scale2 = 1 + Math.sin(progress * Math.PI) * 0.45;
        const midAirSide2 = (Math.floor(progress * 13) % 2 === 0) ? 'convex' : 'flat';

        setCup1({
          x: xPos1,
          y: yPos,
          rotX: rX1 % 360,
          rotY: rY1 % 360,
          rotZ: rZ1,
          scale: scale1,
          side: progress < 0.85 ? (midAirSide1 as 'flat' | 'convex') : (landingConfig.cup1Side as 'flat' | 'convex'),
        });

        setCup2({
          x: xPos2,
          y: yPos,
          rotX: rX2 % 360,
          rotY: rY2 % 360,
          rotZ: rZ2,
          scale: scale2,
          side: progress < 0.85 ? (midAirSide2 as 'flat' | 'convex') : (landingConfig.cup2Side as 'flat' | 'convex'),
        });

        animationFrameId.current = requestAnimationFrame(runPhysics);
      } else {
        // --- Landing Rest Phase & Bounces ---
        audioSynth.playWoodKnock();
        if (settings.vibrationEnabled) {
          try {
            navigator.vibrate([100, 45, 120]);
          } catch (e) {}
        }

        // Apply a realistic settle resting configuration
        // Offset slightly randomly to prevent standard static look
        const randomScatterX1 = -55 + (Math.random() - 0.5) * 15;
        const randomScatterY1 = 0 + (Math.random() - 0.5) * 8;
        const randomScatterZ1 = -15 + (Math.random() - 0.5) * 45;

        const randomScatterX2 = 55 + (Math.random() - 0.5) * 15;
        const randomScatterY2 = 0 + (Math.random() - 0.5) * 8;
        const randomScatterZ2 = 15 + (Math.random() - 0.5) * 45;

        setCup1({
          x: randomScatterX1,
          y: randomScatterY1,
          rotX: 0,
          rotY: landingConfig.cup1Side === 'flat' ? 180 : 0,
          rotZ: randomScatterZ1,
          scale: 0.82,
          side: landingConfig.cup1Side as 'flat' | 'convex',
        });

        setCup2({
          x: randomScatterX2,
          y: randomScatterY2,
          rotX: 0,
          rotY: landingConfig.cup2Side === 'flat' ? 180 : 0,
          rotZ: randomScatterZ2,
          scale: 0.82,
          side: landingConfig.cup2Side as 'flat' | 'convex',
        });

        setCupState(CupState.LANDED);
        setShowResultCard(true);
        audioSynth.playGongChime();
      }
    };

    animationFrameId.current = requestAnimationFrame(runPhysics);
  };

  // Reset cup layout to initial state
  const resetThrow = () => {
    setShowResultCard(false);
    setCupState(CupState.INITIAL);
    setResult(null);
    setSavedThisTurn(false);
    setShowDetails(false);
    
    // Smooth transition back to center
    setCup1({ x: -45, y: 0, rotX: 0, rotY: 0, rotZ: -20, scale: 1, side: 'convex' });
    setCup2({ x: 45, y: 0, rotX: 0, rotY: 180, rotZ: 20, scale: 1, side: 'convex' });
  };

  // Save the current oracle outcome to local History database
  const saveOracleRecord = () => {
    if (!result || savedThisTurn) return;

    const record: ThrowRecord = {
      id: `rec-${Date.now()}`,
      timestamp: Date.now(),
      wish: wish.trim() || '随心祈福，静候佳音',
      result: result,
      themeId: themeId,
      notes: GUA_DATA[result].meaning,
    };

    onAddRecord(record);
    setSavedThisTurn(true);
    
    // Clear wish to keep individual ceremony exclusive
    setWish('');
  };

  // Quick select a pre-configured template text
  const applyTemplate = (content: string) => {
    setWish(content);
    setShowWishDrawer(false);
  };

  // Create a brand new custom template
  const saveCustomTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateTitle.trim() || !newTemplateContent.trim()) return;

    const newTpl: WishTemplate = {
      id: `tpl-${Date.now()}`,
      category: 'custom',
      title: newTemplateTitle.trim(),
      content: newTemplateContent.trim(),
    };

    const updated = [newTpl, ...customTemplates];
    setCustomTemplates(updated);
    localStorage.setItem('cs_custom_templates', JSON.stringify(updated));

    setWish(newTemplateContent.trim());
    setNewTemplateTitle('');
    setNewTemplateContent('');
    setShowAddTemplateForm(false);
    setShowWishDrawer(false);
  };

  // Delete a customized template
  const deleteCustomTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customTemplates.filter((t) => t.id !== id);
    setCustomTemplates(updated);
    localStorage.setItem('cs_custom_templates', JSON.stringify(updated));
  };

  // Get filtered templates
  const allTemplates = [...customTemplates, ...DEFAULT_TEMPLATES];
  const filteredTemplates = activeCategory === 'all' 
    ? allTemplates 
    : allTemplates.filter((t) => t.category === activeCategory);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex flex-col ${showResultCard ? 'overflow-y-auto pb-12' : 'justify-between overflow-hidden'} scrollbar-none no-scrollbar`}
    >
      
      {/* Incense floating smoke particle layout */}
      {settings.particlesEnabled && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                backgroundColor: themeId === 'suian' ? 'rgba(239, 68, 68, 0.45)' : 'rgba(197, 160, 89, 0.35)',
                filter: 'blur(1px)',
              }}
              className="absolute rounded-full pointer-events-none transition-all duration-300"
            />
          ))}
        </div>
      )}

      {/* Dynamic mist elements for deep serenity */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-24 inset-x-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-0 animate-pulse duration-10000" />

      {/* TOP HEADER: Gilded typography instructions (Editorial Aesthetic styled) */}
      <div className="w-full text-center pt-8 z-10 px-4">
        {cupState === CupState.INITIAL && (
          <div className="animate-fade-in flex flex-col items-center">
            <h1 className="text-[11px] tracking-[0.5em] text-stone-400 uppercase mb-3 font-medium select-none">
              Chaosu Ritual
            </h1>
            <div className="text-[28px] font-semibold tracking-[0.3em] text-[#c5a059] mb-2 font-serif select-none">
              潮序圣杯
            </div>
            <div className="h-px w-10 bg-[#c5a059]/35 mb-6"></div>
            <p className="text-[15px] font-medium text-stone-300 opacity-90 tracking-widest font-serif leading-relaxed">
              双手按住屏幕 • 长按上滑抛杯
            </p>
            <p className="text-[11px] text-stone-500 mt-1.5 font-sans tracking-wide font-medium">
              虔诚静心，一事一问。双指模拟双手捧杯。
            </p>
          </div>
        )}

        {cupState === CupState.HELD && (
          <div className="animate-pulse flex flex-col items-center">
            <h1 className="text-[11px] tracking-[0.5em] text-[#c5a059] uppercase mb-3 font-semibold select-none">
              Ritual Prepared
            </h1>
            <div className="text-[28px] font-semibold tracking-[0.25em] text-stone-100 mb-2 font-serif select-none">
              双杯在手
            </div>
            <div className="h-px w-10 bg-stone-600 mb-6"></div>
            <p className="text-[15px] font-semibold text-[#c5a059] tracking-widest font-serif">
              双手已合捧 • 顺滑上抛
            </p>
            <p className="text-amber-400/80 text-[10px] mt-1 font-mono tracking-wider uppercase font-semibold">
              Ready • Swipe upward slowly
            </p>
          </div>
        )}

        {cupState === CupState.THROWING && (
          <div className="animate-pulse flex flex-col items-center">
            <h1 className="text-[11px] tracking-[0.5em] text-stone-400 uppercase mb-3 font-medium select-none">
              Divination In Flight
            </h1>
            <div className="text-[28px] font-semibold tracking-[0.3em] text-[#c5a059] mb-2 font-serif select-none">
              圣杯飞舞
            </div>
            <div className="h-px w-10 bg-[#c5a059]/35 mb-6"></div>
            <p className="text-[15px] font-medium text-stone-200 tracking-widest font-serif">
              吉凶自现，神明聆听中...
            </p>
          </div>
        )}

        {cupState === CupState.LANDED && result && (
          <div className="flex flex-col items-center">
            <h1 className="text-[11px] tracking-[0.5em] text-stone-400 uppercase mb-3 font-medium select-none">
              Ritual Answered
            </h1>
            <div className="text-[28px] font-semibold tracking-[0.25em] text-[#c5a059] mb-2 font-serif select-none">
              掷得卦象：{GUA_DATA[result].name}
            </div>
            <div className="h-px w-10 bg-[#c5a059]/35 mb-5"></div>
            <p className="text-[13px] text-stone-300 mt-1 font-semibold tracking-widest">
              “{GUA_DATA[result].vernacular}”
            </p>
          </div>
        )}
      </div>

      {/* MIDDLE: Interactive Playground Sandbox */}
      <div
        id="touch_sandbox"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        className={`relative w-full flex items-center justify-center z-10 select-none transition-all duration-500 ${
          showResultCard ? 'h-[210px] shrink-0 touch-auto' : 'flex-1 touch-none'
        }`}
      >
        {/* Glow bounds when fingers grip */}
        <div
          style={{ opacity: touchLeftHeld ? 0.8 : 0 }}
          className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-amber-500/15 to-transparent border-l border-amber-500/40 pointer-events-none transition-opacity duration-300"
        />
        <div
          style={{ opacity: touchRightHeld ? 0.8 : 0 }}
          className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-amber-500/15 to-transparent border-r border-amber-500/40 pointer-events-none transition-opacity duration-300"
        />

        {/* Left and Right Vertical Editorial Margins Text */}
        <div className="absolute left-6 bottom-32 transform -rotate-90 origin-left text-[9px] tracking-[0.5em] text-stone-600/75 uppercase select-none font-serif hidden md:block z-0 pointer-events-none">
          Traditional Heritage
        </div>
        <div className="absolute right-6 bottom-32 transform rotate-90 origin-right text-[9px] tracking-[0.5em] text-stone-600/75 uppercase select-none font-serif hidden md:block z-0 pointer-events-none">
          Mindful Experience
        </div>

        {/* Ambient background decorative temple circle */}
        <div className="absolute w-72 h-72 rounded-full border border-[#c5a059]/5 flex items-center justify-center pointer-events-none z-0">
          <div className="w-64 h-64 rounded-full border border-[#c5a059]/3 flex items-center justify-center">
            <div className="w-56 h-56 rounded-full border border-[#c5a059]/2 flex items-center justify-center">
              <Sparkle className="w-6 h-6 text-[#c5a059]/5 animate-spin" style={{ animationDuration: '40s' }} />
            </div>
          </div>
        </div>

        {/* Dynamic Cups */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Cup 1 */}
          <div
            className="absolute transition-all duration-75 ease-out"
            style={{
              transform: `translate(${cup1.x}px, ${cup1.y}px)`,
              perspective: '1000px',
            }}
          >
            <div
              style={{
                transform: settings.performanceMode === '3D' 
                  ? `rotateX(${cup1.rotX}deg) rotateY(${cup1.rotY}deg) rotateZ(${cup1.rotZ}deg)`
                  : `rotateZ(${cup1.rotZ}deg)`,
                transformStyle: 'preserve-3d',
              }}
              className="transition-transform duration-75"
            >
              <ShengBeiModel
                side={cup1.side}
                themeId={themeId as any}
                scale={cup1.scale}
                glow={touchLeftHeld}
                isRight={false}
              />
            </div>
          </div>

          {/* Cup 2 */}
          <div
            className="absolute transition-all duration-75 ease-out"
            style={{
              transform: `translate(${cup2.x}px, ${cup2.y}px)`,
              perspective: '1000px',
            }}
          >
            <div
              style={{
                transform: settings.performanceMode === '3D' 
                  ? `rotateX(${cup2.rotX}deg) rotateY(${cup2.rotY}deg) rotateZ(${cup2.rotZ}deg)`
                  : `rotateZ(${cup2.rotZ}deg)`,
                transformStyle: 'preserve-3d',
              }}
              className="transition-transform duration-75"
            >
              <ShengBeiModel
                side={cup2.side}
                themeId={themeId as any}
                scale={cup2.scale}
                glow={touchRightHeld}
                isRight={true}
              />
            </div>
          </div>
        </div>


      </div>

      {/* LOWER WRAPPER: Wish remarks input & Result summary overlay */}
      <div className="w-full pb-4 z-20 px-4">
        
        {/* Wish notes collapsed bar */}
        {!showResultCard && cupState !== CupState.THROWING && (
          <div className="max-w-md mx-auto">
            <div className="bg-stone-950/75 backdrop-blur-md border border-stone-900 rounded-xl p-3.5 transition-all duration-300">
              <div className="flex items-center justify-between">
                <button
                  id="wish_drawer_toggle"
                  onClick={() => setShowWishDrawer(!showWishDrawer)}
                  className="flex items-center gap-2 text-xs font-serif text-[#c5a059] hover:opacity-80 transition-opacity"
                >
                  <FileText className="w-4 h-4 text-[#c5a059]" />
                  <span>{wish.trim() ? `所祈：${wish.slice(0, 16)}...` : '写下此刻求问的具体心事（可选）'}</span>
                </button>
                <button
                  id="wish_templates_btn"
                  onClick={() => setShowWishDrawer(!showWishDrawer)}
                  className="text-[10px] font-serif text-stone-400 border border-stone-800 px-2.5 py-0.5 rounded-md hover:bg-stone-900 transition-colors cursor-pointer"
                >
                  {showWishDrawer ? '收起' : '选用模本'}
                </button>
              </div>

              {/* Wish drawer collapsible details */}
              {showWishDrawer && (
                <div className="mt-3.5 border-t border-stone-900 pt-3.5 animate-slide-up">
                  <div className="relative">
                    <textarea
                      id="wish_textarea"
                      value={wish}
                      onChange={(e) => setWish(e.target.value.slice(0, 60))}
                      placeholder="写下求问具体心事（限60字）。例如：弟子欲合资开设茶馆，祈求神明指引运势前景是否通顺..."
                      className="w-full h-18 bg-[#040405] border border-stone-900 rounded-lg p-2.5 text-xs text-stone-300 focus:outline-none focus:border-[#c5a059]/40 resize-none font-serif leading-relaxed"
                    />
                    <span className="absolute bottom-1.5 right-2.5 text-[9px] text-stone-600 font-mono">
                      {wish.length}/60
                    </span>
                  </div>

                  {/* Preset Categories for templates */}
                  <div className="flex gap-1.5 overflow-x-auto py-2 scrollbar-none no-scrollbar">
                    {(['all', 'career', 'love', 'health', 'wealth', 'education'] as const).map((cat) => (
                      <button
                        key={cat}
                        id={`cat_btn_${cat}`}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-[10px] font-serif px-2.5 py-0.5 rounded-md border whitespace-nowrap transition-colors cursor-pointer ${
                          activeCategory === cat
                            ? 'bg-[#c5a059]/15 text-[#c5a059] border-[#c5a059]/40'
                            : 'bg-stone-950 text-stone-400 border-stone-900 hover:text-[#c5a059]'
                        }`}
                      >
                        {cat === 'all' && '全品'}
                        {cat === 'career' && '事业'}
                        {cat === 'love' && '祈缘'}
                        {cat === 'health' && '安康'}
                        {cat === 'wealth' && '财通'}
                        {cat === 'education' && '学功'}
                      </button>
                    ))}
                    <button
                      id="add_template_toggle_btn"
                      onClick={() => setShowAddTemplateForm(!showAddTemplateForm)}
                      className="text-[10px] font-serif px-2 py-0.5 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/25 rounded-md flex items-center gap-0.5 whitespace-nowrap cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>添加</span>
                    </button>
                  </div>

                  {/* Add customized template form */}
                  {showAddTemplateForm && (
                    <form onSubmit={saveCustomTemplate} className="bg-stone-950 p-3 rounded-lg border border-stone-900 mb-2.5 animate-fade-in">
                      <div className="text-xs font-serif text-[#c5a059] mb-2">添加自定义祈愿模本</div>
                      <input
                        type="text"
                        placeholder="分类标签 (例: 启行)"
                        value={newTemplateTitle}
                        onChange={(e) => setNewTemplateTitle(e.target.value.slice(0, 6))}
                        className="w-full bg-[#040405] border border-stone-900 rounded px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-[#c5a059]/30 mb-2 font-serif"
                        required
                      />
                      <textarea
                        placeholder="祈求正文 (例: 祈求本次外出诸事圆满，行途平安。)"
                        value={newTemplateContent}
                        onChange={(e) => setNewTemplateContent(e.target.value.slice(0, 60))}
                        className="w-full h-14 bg-[#040405] border border-stone-900 rounded px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-[#c5a059]/30 mb-2 resize-none font-serif leading-relaxed"
                        required
                      />
                      <div className="flex justify-end gap-2 text-[10px] font-serif">
                        <button
                          type="button"
                          onClick={() => setShowAddTemplateForm(false)}
                          className="px-2 py-1 text-stone-400 hover:text-white"
                        >
                          取消
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-[#c5a059] text-black font-semibold rounded hover:opacity-95"
                        >
                          添加并应用
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Template text grid list */}
                  <div className="grid grid-cols-1 gap-1.5 max-h-32 overflow-y-auto pr-1 scrollbar-none no-scrollbar">
                    {filteredTemplates.map((item) => (
                      <div
                        key={item.id}
                        id={`tpl_item_${item.id}`}
                        onClick={() => applyTemplate(item.content)}
                        className="bg-stone-950 hover:bg-stone-900/60 border border-stone-900 hover:border-[#c5a059]/20 rounded-lg p-2 text-left cursor-pointer transition-all flex items-start justify-between group"
                      >
                        <div className="flex-1">
                          <span className="inline-block text-[9px] px-1.5 py-0.2 bg-stone-900 group-hover:bg-[#c5a059]/10 text-stone-400 group-hover:text-[#c5a059] rounded border border-stone-800 mr-2 font-serif scale-95 origin-left">
                            {item.title}
                          </span>
                          <p className="text-[10.5px] text-stone-300 mt-1 font-serif line-clamp-2 leading-relaxed">
                            {item.content}
                          </p>
                        </div>
                        {item.category === 'custom' && (
                          <button
                            type="button"
                            onClick={(e) => deleteCustomTemplate(item.id, e)}
                            className="text-stone-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {showResultCard && result && (
          <div className="max-w-md mx-auto bg-stone-950/95 border border-[#c5a059]/25 rounded-2xl p-4.5 backdrop-blur-md shadow-2xl animate-slide-up -mt-4 relative z-30">
            
            {/* Simple Result Header */}
            <div className="text-center relative pb-3 border-b border-stone-900/60 flex items-center justify-between px-1">
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-serif font-medium text-[#c5a059] tracking-wider select-none">
                    {GUA_DATA[result].name}
                  </h1>
                  <span className="text-[11px] font-serif text-stone-400">
                    {GUA_DATA[result].alias}
                  </span>
                </div>
                <p className="text-[9px] text-stone-500 font-mono mt-0.5 uppercase tracking-widest">
                  {GUA_DATA[result].pronunciation}
                </p>
              </div>

              {/* Toggle details button */}
              <button
                id="toggle_details_btn"
                onClick={() => {
                  setShowDetails(!showDetails);
                  if (!showDetails) {
                    setTimeout(() => {
                      if (containerRef.current) {
                        containerRef.current.scrollTo({
                          top: 450,
                          behavior: 'smooth'
                        });
                      }
                    }, 150);
                  }
                }}
                className="text-[10px] font-serif text-[#c5a059] border border-[#c5a059]/20 px-2.5 py-1 rounded-md hover:bg-[#c5a059]/10 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>{showDetails ? '收起释义 ▲' : '查看详释 ▼'}</span>
              </button>
            </div>

            {/* Collapsible detailed commentary block */}
            {showDetails && (
              <div className="mt-3.5 space-y-3 animate-slide-up text-left border-b border-stone-900/60 pb-3.5">
                {/* Custom wish summary badge */}
                <div className="bg-stone-900/40 rounded-lg px-3 py-2 border border-stone-900/60">
                  <span className="text-[9px] text-stone-500 font-serif block mb-0.5">弟子问卜事由：</span>
                  <p className="text-[11px] font-serif text-stone-300 leading-relaxed italic">
                    “{wish.trim() || '随心祈福，静候佳音'}”
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-[#c5a059] font-serif tracking-widest block mb-1">【卦象释义】</span>
                  <p className="text-xs text-stone-300 font-serif leading-relaxed">
                    {GUA_DATA[result].meaning}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-[#c5a059] font-serif tracking-widest block mb-1">【民俗启示】</span>
                  <p className="text-xs text-stone-400 font-serif leading-relaxed">
                    {GUA_DATA[result].advice}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-[9px] text-stone-500 font-serif pt-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-stone-600" />
                  <span>民俗传统演练 • 敬祈以自安</span>
                </div>
              </div>
            )}

            {/* Actions Panel (Always visible, compact) */}
            <div className="mt-4.5 grid grid-cols-3 gap-2">
              <button
                id="reset_throw_btn"
                onClick={resetThrow}
                className="py-2 bg-[#0a0a0c] border border-stone-900 hover:border-stone-800 text-stone-300 text-xs font-serif rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                再次抛掷
              </button>

              <button
                id="save_record_btn"
                onClick={saveOracleRecord}
                disabled={savedThisTurn}
                className={`py-2 border text-xs font-serif rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  savedThisTurn
                    ? 'bg-[#c5a059]/10 border-[#c5a059]/20 text-[#c5a059]'
                    : 'bg-[#c5a059] border-[#c5a059] text-black font-semibold hover:opacity-90'
                }`}
              >
                {savedThisTurn ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>已存入</span>
                  </>
                ) : (
                  <span>保存卦象</span>
                )}
              </button>

              <button
                id="view_history_btn"
                onClick={() => {
                  saveOracleRecord();
                  onNavigateToHistory();
                }}
                className="py-2 bg-[#0a0a0c] border border-stone-900 hover:border-stone-800 text-stone-300 text-xs font-serif rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                查看记录
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
