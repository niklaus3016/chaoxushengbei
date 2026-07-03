/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserSettings } from '../types';
import { audioSynth } from '../utils/audio';
import { Volume2, VolumeX, Shield, HeartHandshake, Info, RefreshCw, Trash2, Sliders, Sparkles, Smartphone, Check, X } from 'lucide-react';

interface SettingsTabProps {
  settings: UserSettings;
  onChangeSettings: (newSettings: UserSettings) => void;
  onClearHistory: () => void;
  onResetTemplates: () => void;
  /** 打开「隐私政策」详情弹窗（由父 App 统一复用 AgreementModal+PrivacyPolicyContent）*/
  onOpenPrivacyPolicy?: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onChangeSettings,
  onClearHistory,
  onResetTemplates,
  onOpenPrivacyPolicy,
}) => {
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const updateSetting = (key: keyof UserSettings, value: any) => {
    const updated = { ...settings, [key]: value };
    onChangeSettings(updated);

    // Sync sound state directly to synthesiser module
    if (key === 'soundMasterEnabled') {
      audioSynth.masterEnabled = value;
    } else if (key === 'soundBgEnabled') {
      audioSynth.ambientEnabled = value;
    } else if (key === 'soundEffectEnabled') {
      audioSynth.sfxEnabled = value;
    }

    // Play a tiny audio/vibe test cue
    if (key === 'vibrationEnabled' && value) {
      try { navigator.vibrate(35); } catch (e) {}
    }
    if (key === 'soundMasterEnabled' && value) {
      audioSynth.playGongChime();
    }
  };

  const handleActionClick = (type: 'clear' | 'templates') => {
    if (type === 'clear') {
      onClearHistory();
      triggerToast('本地卦录历史已全部清空');
    } else if (type === 'templates') {
      onResetTemplates();
      localStorage.removeItem('cs_custom_templates');
      triggerToast('自定义愿望模板已重置为默认值');
    }
  };

  const triggerToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  return (
    <div className="relative w-full h-full overflow-y-auto px-4 py-5 scrollbar-none no-scrollbar">
      <div className="max-w-md mx-auto space-y-4 pb-8 font-serif text-left">
        
        {/* Settings Header */}
        <div className="text-center mb-6">
          <h2 className="text-[#c5a059] font-serif text-xl tracking-[0.2em] font-semibold">系统设定</h2>
          <p className="text-stone-400 text-[12px] mt-1 font-serif tracking-wide font-medium">自定专属视听气场，护持清净思绪</p>
        </div>

        {/* SECTION 1: INTERACTION & AUDIO */}
        <div className="bg-stone-950 border border-stone-900 rounded-2xl p-4.5 space-y-3.5">
          <h3 className="text-stone-300 text-[13px] tracking-wider flex items-center gap-2 mb-2 border-b border-stone-800 pb-2.5 font-semibold">
            <Volume2 className="w-4 h-4 text-[#c5a059]" />
            <span>声色触觉反馈</span>
          </h3>

          {/* Master sound */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-[13px] text-stone-100 block font-serif font-semibold">全局音效总开关</label>
              <span className="text-[11px] text-stone-500 font-serif tracking-wide font-medium">一键开启/停用应用内所有合成声音</span>
            </div>
            <button
              id="set_master_sound"
              onClick={() => updateSetting('soundMasterEnabled', !settings.soundMasterEnabled)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                settings.soundMasterEnabled ? 'bg-[#c5a059]' : 'bg-stone-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform duration-200 transform ${
                  settings.soundMasterEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* SFX sound */}
          {settings.soundMasterEnabled && (
            <div className="flex items-center justify-between pl-3 border-l-2 border-stone-900 animate-fade-in">
              <div>
                <label className="text-[13px] text-stone-200 block font-serif font-semibold">抛杯与落地撞击音</label>
                <span className="text-[11px] text-stone-500 font-serif tracking-wide font-medium">真实木材碰撞声与空中飞风啸音</span>
              </div>
              <button
                id="set_sfx_sound"
                onClick={() => updateSetting('soundEffectEnabled', !settings.soundEffectEnabled)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                  settings.soundEffectEnabled ? 'bg-[#c5a059]/80' : 'bg-stone-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black transition-transform duration-200 transform ${
                    settings.soundEffectEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Ambient sound */}
          {settings.soundMasterEnabled && (
            <div className="flex items-center justify-between pl-3 border-l-2 border-stone-900 animate-fade-in">
              <div>
                <label className="text-[13px] text-stone-200 block font-serif font-semibold">神堂罄钟余音</label>
                <span className="text-[11px] text-stone-500 font-serif tracking-wide font-medium">开显卦象时清脆祥和的金属磬钟余韵</span>
              </div>
              <button
                id="set_bg_sound"
                onClick={() => updateSetting('soundBgEnabled', !settings.soundBgEnabled)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                  settings.soundBgEnabled ? 'bg-[#c5a059]/80' : 'bg-stone-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black transition-transform duration-200 transform ${
                    settings.soundBgEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Vibration Switch */}
          <div className="flex items-center justify-between border-t border-stone-900/50 pt-3">
            <div>
              <label className="text-[13px] text-stone-100 block font-serif font-semibold">触觉振动反馈</label>
              <span className="text-[11px] text-stone-500 font-serif tracking-wide font-medium">松手及落地震屏时的触感颤震 (需要系统支持)</span>
            </div>
            <button
              id="set_vibe"
              onClick={() => updateSetting('vibrationEnabled', !settings.vibrationEnabled)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                settings.vibrationEnabled ? 'bg-[#c5a059]' : 'bg-stone-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform duration-200 transform ${
                  settings.vibrationEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* SECTION 2: GRAPHICS & PERFORMANCE */}
        <div className="bg-stone-950 border border-stone-900 rounded-2xl p-4.5 space-y-3.5">
          <h3 className="text-stone-300 text-[13px] tracking-wider flex items-center gap-2 mb-2 border-b border-stone-800 pb-2.5 font-semibold">
            <Smartphone className="w-4 h-4 text-[#c5a059]" />
            <span>画面特效与性能</span>
          </h3>

          {/* Particles */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-[13px] text-stone-100 block font-serif font-semibold">香火香气微光粒子</label>
              <span className="text-[11px] text-stone-500 font-serif tracking-wide font-medium">底部升华的微弱暖光浮动香氛微粒</span>
            </div>
            <button
              id="set_particles"
              onClick={() => updateSetting('particlesEnabled', !settings.particlesEnabled)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                settings.particlesEnabled ? 'bg-[#c5a059]' : 'bg-stone-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform duration-200 transform ${
                  settings.particlesEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Lighting */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-[13px] text-stone-100 block font-serif font-semibold">边缘呼吸环境光</label>
              <span className="text-[11px] text-stone-500 font-serif tracking-wide font-medium">左右握持屏边微微浮现的呼吸暖芒条</span>
            </div>
            <button
              id="set_lighting"
              onClick={() => updateSetting('dynamicLightingEnabled', !settings.dynamicLightingEnabled)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                settings.dynamicLightingEnabled ? 'bg-[#c5a059]' : 'bg-stone-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform duration-200 transform ${
                  settings.dynamicLightingEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Performance Selector (2D vs 3D CSS physics) */}
          <div className="flex items-center justify-between border-t border-stone-900/50 pt-3">
            <div>
              <label className="text-[13px] text-stone-100 block font-serif font-semibold">性能适配模式</label>
              <span className="text-[11px] text-stone-500 font-serif tracking-wide font-medium">
                {settings.performanceMode === '3D' ? '当前处于：3D立体翻转特效（推荐）' : '当前处于：2D极简轻量模式（低配机顺畅）'}
              </span>
            </div>
            <div className="flex bg-stone-900 border border-stone-800 p-0.5 rounded-lg text-xs font-mono">
              <button
                id="perf_3d_btn"
                onClick={() => updateSetting('performanceMode', '3D')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  settings.performanceMode === '3D' ? 'bg-[#c5a059] text-black font-semibold' : 'text-stone-400 hover:text-white'
                }`}
              >
                3D
              </button>
              <button
                id="perf_2d_btn"
                onClick={() => updateSetting('performanceMode', '2D')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  settings.performanceMode === '2D' ? 'bg-[#c5a059] text-black font-semibold' : 'text-stone-400 hover:text-white'
                }`}
              >
                2D
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: SYSTEM DATA PRUNING */}
        <div className="bg-stone-950 border border-stone-900 rounded-2xl p-4.5 space-y-3.5">
          <h3 className="text-stone-300 text-[13px] tracking-wider flex items-center gap-2 mb-2 border-b border-stone-800 pb-2.5 font-semibold">
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>本地存储空间治理</span>
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-[13px] text-stone-100 block font-serif font-semibold">重置愿望自定义模板</label>
              <span className="text-[11px] text-stone-500 font-serif tracking-wide font-medium">还原为默认的五大类民间吉利文案</span>
            </div>
            <button
              id="reset_templates_direct_btn"
              onClick={() => handleActionClick('templates')}
              className="px-3 py-1.5 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 text-xs rounded-lg transition-colors cursor-pointer"
            >
              重置
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-stone-900/50 pt-3">
            <div>
              <label className="text-[13px] text-stone-100 block font-serif font-semibold">清空本地全部卦录历史</label>
              <span className="text-[11px] text-stone-500 font-serif tracking-wide font-medium">清空所有存底记录，不可逆转</span>
            </div>
            <button
              id="clear_history_direct_btn"
              onClick={() => handleActionClick('clear')}
              className="px-3 py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-300 text-xs rounded-lg transition-colors font-semibold cursor-pointer"
            >
              清空
            </button>
          </div>
        </div>

        {/* SECTION 4: LEGAL & INFO DOCUMENTATION */}
        <div className="bg-stone-950 border border-stone-900 rounded-2xl p-4.5 space-y-3">
          <h3 className="text-stone-300 text-[13px] tracking-wider flex items-center gap-2 mb-2 border-b border-stone-800 pb-2.5 font-semibold">
            <Shield className="w-4 h-4 text-[#c5a059]" />
            <span>法律合规与文化声明</span>
          </h3>

          <button
            id="privacy_policy_toggle_btn"
            onClick={() => onOpenPrivacyPolicy?.()}
            className="w-full py-2 border-b border-stone-900 hover:bg-stone-900/30 text-xs text-stone-300 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>隐私政策</span>
            <span className="text-[10px] text-[#c5a059]">100%安全</span>
          </button>

          <button
            id="disclaimer_toggle_btn"
            onClick={() => setShowDisclaimerModal(true)}
            className="w-full py-2 border-b border-stone-900 hover:bg-stone-900/30 text-xs text-stone-300 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>免责声明</span>
            <span className="text-[10px] text-stone-500">模拟娱乐</span>
          </button>

          <button
            id="about_product_btn"
            onClick={() => setShowAboutModal(true)}
            className="w-full py-2 hover:bg-stone-900/30 text-xs text-stone-300 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>产品介绍 & 匠心致敬</span>
            <span className="text-[10px] text-stone-500">v1.0</span>
          </button>
        </div>

      </div>

      {/* FIXED TOAST FEEDBACK */}
      {feedbackMsg && (
        <div className="fixed bottom-20 inset-x-4 mx-auto max-w-xs bg-stone-900 border border-[#c5a059]/30 text-[#c5a059] text-xs font-serif text-center py-2.5 px-4 rounded-xl shadow-2xl backdrop-blur-md animate-slide-up z-50 flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-[#c5a059]" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* CULTURAL DISCLAIMER MODAL */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-950 border border-stone-900 rounded-2xl p-5 max-w-sm w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-900 pb-3 mb-3">
              <h3 className="text-[#c5a059] font-serif font-semibold text-sm tracking-wide">免责与健康生活声明</h3>
              <button
                id="close_disclaimer_modal_btn"
                onClick={() => setShowDisclaimerModal(false)}
                className="text-stone-500 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-stone-400 space-y-3 font-serif leading-relaxed text-left">
              <p className="text-stone-300 font-bold">【非物质文化遗产模拟说明】</p>
              <p>
                1. 本应用程序《潮序圣杯》仅为潮汕传统掷圣杯民俗模拟交互工具，目的在于传承、普及非物质文化遗产。
              </p>
              <p>
                2. 应用所开显的各种卦象结果（胜杯、笑杯、阴杯）及其附带的话术，均源于闽南潮汕古风民间习俗、俚语及地方百科口口相传之内容，纯属民俗历史模拟。
              </p>
              <p className="text-stone-300 font-bold">【理智决策，拒绝迷信】</p>
              <p>
                所有卦象结果仅供娱乐参考和文化体悟，不具备任何科学占卜预测功效，更不构成任何针对人生抉择、婚姻大事、医学诊断、金融投资或学术考试的实际决策指南。
              </p>
              <p className="text-red-400/90">
                请用户弘扬科学精神，树立积极的世界观、价值观、人生观，理性规划美好生活。严禁任何人利用本程序从事封建迷信传播或违规商业占卜收费行为。
              </p>
            </div>
            <button
              id="confirm_disclaimer_close_btn"
              onClick={() => setShowDisclaimerModal(false)}
              className="mt-4 w-full py-2 bg-[#c5a059] text-black text-xs font-semibold rounded-lg font-serif cursor-pointer hover:bg-opacity-90 active:scale-[0.98] transition-all"
            >
              我理解并接受
            </button>
          </div>
        </div>
      )}

      {/* ABOUT THE PRODUCT MODAL */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-950 border border-stone-900 rounded-2xl p-5 max-w-sm w-full max-h-[80vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-stone-900 pb-3 mb-3">
              <h3 className="text-[#c5a059] font-serif font-semibold text-sm tracking-wide">潮序圣杯 • 产品缘起</h3>
              <button
                id="close_about_modal_btn"
                onClick={() => setShowAboutModal(false)}
                className="text-stone-500 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-stone-400 space-y-3 font-serif leading-relaxed">
              <p>
                在快节奏的移动互联网时代，许多珍贵的地方非遗民俗正逐渐淡出年轻一代的视线。
              </p>
              <p>
                <strong>《潮序圣杯》</strong>的诞生，源于一群潮汕非遗民俗爱好者最单纯的心愿——拒绝机械死板的简单“点击掷杯”玩具，而是全力复刻潮汕人自幼潜移默化、刻入肌肉记忆的<strong>“双手捧合、双指按压、诚心向上抛滑”</strong>的独特身体姿势，赋予冰冷的手机屏幕一丝古拙而沉甸甸的温度。
              </p>
              <p>
                在视觉上，我们彻底颠覆了低劣贴图和拼凑样式的传统旧木制风格。我们原创构建了以<strong>“檀木玄黑、微光香氛、烫金极简细宋体”</strong>为主体的新中式轻奢祈福气场，极度注重留白与负空间。
              </p>
              <p>
                在听觉上，采用 <strong>Web Audio API 信号振荡器</strong> 实时合成了具有自然和弦泛音的罄钟声音，以及两块实木跌宕落地的“clack-clack”清脆双声碰响。
              </p>
              <p className="text-stone-500 text-[10.5px]">
                愿这副掌中圣杯，能成为您在凡俗嘈杂的一天里，随时随地开启的一座专属静心神坛，助您抚平焦躁，听清自己内心最真实的希冀与决断。
              </p>
            </div>
            <button
              id="confirm_about_close_btn"
              onClick={() => setShowAboutModal(false)}
              className="mt-4 w-full py-2 bg-[#c5a059] text-black text-xs font-semibold rounded-lg font-serif text-center cursor-pointer hover:bg-opacity-90 active:scale-[0.98] transition-all"
            >
              致敬非遗，阖家平安
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
