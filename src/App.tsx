/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { UserSettings, ThrowRecord, ThemeConfig, ThemeId } from './types';
import { MainTab } from './components/MainTab';
import { HistoryTab } from './components/HistoryTab';
import { EncyclopediaTab } from './components/EncyclopediaTab';
import { SettingsTab } from './components/SettingsTab';
import { Sparkles, Archive, BookOpen, Settings, Flame, Compass } from 'lucide-react';
import {
  PrivacyModal,
  AgreementModal,
  DeclineConfirmModal,
  PrivacyPolicyContent,
  UserAgreementContent,
  readPrivacyConsent,
  writePrivacyConsent,
  type PrivacyConsentRecord,
} from './components/privacy';

// Original bespoke Theme Configurations (100% original, completely detached from references)
const THEME_PRESETS: ThemeConfig[] = [
  {
    id: 'sitan',
    name: '静檀沉香',
    description: '沉香木制圣杯配以深空檀黑，静谧静心',
    bgGradient: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#141416] via-[#080808] to-[#030303]',
    cupColorPrimary: '#443b35',
    cupColorSecondary: '#171311',
    accentColor: 'text-[#c5a059]',
    particlesColor: 'rgba(197, 160, 89, 0.25)',
  },
  {
    id: 'cici',
    name: '祠堂雅韵',
    description: '古祠木雕背景，古典深沉朱红大漆工艺材质',
    bgGradient: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2a0e0b] via-[#080302] to-[#020101]',
    cupColorPrimary: '#6a1b15',
    cupColorSecondary: '#2d0603',
    accentColor: 'text-[#e25c50]',
    particlesColor: 'rgba(226, 92, 80, 0.25)',
  },
  {
    id: 'suian',
    name: '岁安祈福',
    description: '暖调肉桂色，适配节日吉庆祈愿场景',
    bgGradient: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3a1b0d] via-[#0a0503] to-black',
    cupColorPrimary: '#a84c24',
    cupColorSecondary: '#4a1505',
    accentColor: 'text-[#ea580c]',
    particlesColor: 'rgba(234, 88, 12, 0.25)',
  },
];

const DEFAULT_SETTINGS: UserSettings = {
  vibrationEnabled: true,
  soundMasterEnabled: true,
  soundBgEnabled: true,
  soundEffectEnabled: true,
  dynamicLightingEnabled: true,
  particlesEnabled: true,
  performanceMode: '3D',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'throw' | 'history' | 'ency' | 'settings'>('throw');
  const [themeId, setThemeId] = useState<ThemeId>('cici');
  const [records, setRecords] = useState<ThrowRecord[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // ========== 隐私政策同意状态 & 弹窗管理 ==========
  const [privacyConsent, setPrivacyConsent] = useState<PrivacyConsentRecord | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false);
  const [detailModal, setDetailModal] = useState<'agreement' | 'privacy' | null>(null);

  // 1. Initial State Loading from LocalStorage + 隐私同意检查
  useEffect(() => {
    // Load records
    const savedRecords = localStorage.getItem('cs_throw_records_v1');
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords));
      } catch (e) {
        console.error('Failed to parse saved records', e);
      }
    }

    // Load settings
    const savedSettings = localStorage.getItem('cs_user_settings_v1');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }

    // Load theme
    const savedTheme = localStorage.getItem('cs_user_theme_v1');
    if (savedTheme && ['sitan', 'cici', 'suian'].includes(savedTheme)) {
      setThemeId(savedTheme as ThemeId);
    } else {
      setThemeId('cici');
    }

    // ---------- 隐私同意检查 ----------
    const consent = readPrivacyConsent();
    setPrivacyConsent(consent);
    // 未同意：启动时强制弹出主弹窗，必须同意才能使用
    if (!consent) {
      setShowPrivacyModal(true);
    }
  }, []);

  // ========== 隐私弹窗交互 ==========
  const handlePrivacyAccept = () => {
    const record = writePrivacyConsent();
    setPrivacyConsent(record);
    setShowPrivacyModal(false);
    setDetailModal(null);
    setShowDeclineModal(false);
  };

  // 主弹窗点「不同意」→ 弹出二次确认
  const handlePrivacyDeclineClick = () => {
    setShowDeclineModal(true);
  };

  // 二次确认点「取消」→ 回到主弹窗继续选择
  const handleDeclineCancel = () => {
    setShowDeclineModal(false);
  };

  // 二次确认点「确定拒绝」→ 保持主弹窗（不允许绕过）
  const handleDeclineConfirm = () => {
    setShowDeclineModal(false);
    setShowPrivacyModal(true);
    // （若在 Capacitor 壳内需完全退出，可在此调用 App.exitApp() 等原生 API）
  };

  // 主交互解锁条件：同意记录存在 + 主弹窗未显示
  const mainInteractable = privacyConsent?.agreed === true && !showPrivacyModal;
  const needPrivacyGate = !mainInteractable;

  // 2. State persistence sync
  const handleAddRecord = (newRec: ThrowRecord) => {
    const updated = [newRec, ...records];
    setRecords(updated);
    localStorage.setItem('cs_throw_records_v1', JSON.stringify(updated));
  };

  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    localStorage.setItem('cs_throw_records_v1', JSON.stringify(updated));
  };

  const handleClearAllRecords = () => {
    setRecords([]);
    localStorage.setItem('cs_throw_records_v1', JSON.stringify([]));
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('cs_user_settings_v1', JSON.stringify(newSettings));
  };

  const handleThemeChange = (id: ThemeId) => {
    setThemeId(id);
    localStorage.setItem('cs_user_theme_v1', id);
  };

  const handleResetTemplates = () => {
    // Emits reset template action
    // We already handle template storage reset inside SettingsTab but this acts as an API hook.
  };

  // Find active theme object
  const currentTheme = THEME_PRESETS.find((t) => t.id === themeId) || THEME_PRESETS[0];

  return (
    <div
      style={{ WebkitOverflowScrolling: 'touch' }}
      className={`relative w-full h-screen flex flex-col justify-between select-none overflow-hidden transition-all duration-700 text-stone-300 ${currentTheme.bgGradient}`}
    >
      {/* ========== 主内容层（未同意时轻虚化 + 锁定点击） ========== */}
      <div
        className={`relative flex flex-col h-full w-full transition-all duration-500 ${
          needPrivacyGate ? 'blur-[1px] brightness-90 pointer-events-none' : ''
        }`}
      >
        {/* Editorial Aesthetic: Decorative Ambient Elements */}
        <div className="absolute inset-0 paper-texture pointer-events-none z-10" />
        <div className="glow-guide absolute left-0 top-0 bottom-0 w-1.5 z-10 pointer-events-none" />
        <div className="glow-guide absolute right-0 top-0 bottom-0 w-1.5 z-10 pointer-events-none" />
      
      {/* 1. TOP APP BAR HEADER: Clean display typography */}
      <header className="w-full h-18 border-b border-stone-900/60 px-5 flex items-center justify-between z-30 bg-black/45 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2.5">
          {/* Custom sacred incense burner vector icon styled elegantly */}
          <div className="w-8 h-8 rounded-full bg-[#0a0a0c] border border-[#c5a059]/30 flex items-center justify-center shadow-lg">
            <Compass className="w-4 h-4 text-[#c5a059] animate-pulse" />
          </div>
          <div className="text-left">
            <h1 className="text-[#c5a059] font-serif font-medium text-sm tracking-[0.25em]">
              潮序圣杯
            </h1>
            <span className="text-[8px] text-stone-500 font-serif tracking-[0.2em] uppercase block mt-0.5 select-none">
              Traditional Heritage
            </span>
          </div>
        </div>

        {/* Beautiful Original Aura/Theme selection badge */}
        <div className="flex items-center gap-1 bg-[#0a0a0c] border border-stone-900 p-0.5 rounded-lg text-[10px] font-serif">
          {(['sitan', 'cici', 'suian'] as const).map((id) => (
            <button
              key={id}
              id={`theme_badge_${id}`}
              onClick={() => handleThemeChange(id)}
              className={`px-2.5 py-1 rounded transition-all whitespace-nowrap cursor-pointer ${
                themeId === id
                  ? 'bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 shadow-sm font-medium'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              {id === 'sitan' && '静檀'}
              {id === 'cici' && '祠堂'}
              {id === 'suian' && '岁安'}
            </button>
          ))}
        </div>
      </header>

      {/* 2. MAIN ACTIVE TAB WORKSPACE CONTAINER */}
      <main className="flex-1 w-full relative z-20 overflow-hidden bg-transparent">
        {activeTab === 'throw' && (
          <MainTab
            settings={settings}
            themeId={themeId}
            onAddRecord={handleAddRecord}
            onNavigateToHistory={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab
            records={records}
            onDeleteRecord={handleDeleteRecord}
            onClearAll={handleClearAllRecords}
            onNavigateToThrow={() => setActiveTab('throw')}
          />
        )}

        {activeTab === 'ency' && (
          <EncyclopediaTab />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            settings={settings}
            onChangeSettings={handleUpdateSettings}
            onClearHistory={handleClearAllRecords}
            onResetTemplates={handleResetTemplates}
            onOpenPrivacyPolicy={() => setDetailModal('privacy')}
          />
        )}
      </main>

      {/* 3. BOTTOM TAB NAVIGATION BAR (4 Tab極簡導航 - Editorial Styled) */}
      <nav className="w-full h-20 bg-[#0a0a0a] border-t border-stone-900 flex items-center justify-around px-8 z-30 shrink-0 pb-safe">
        
        {/* Tab 1: 祈福首页 RITUAL */}
        <button
          id="nav_tab_throw"
          onClick={() => setActiveTab('throw')}
          className={`flex flex-col items-center justify-center h-full w-20 cursor-pointer transition-all border-t-2 pt-1 ${
            activeTab === 'throw' ? 'text-[#c5a059] border-[#c5a059]' : 'text-stone-500 hover:text-stone-400 border-transparent'
          }`}
        >
          <Flame className={`w-4 h-4 mb-0.5 transition-transform duration-300 ${activeTab === 'throw' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-serif tracking-[0.15em] font-medium">首页</span>
          <span className="text-[7.5px] font-mono tracking-wider opacity-50 uppercase">RITUAL</span>
        </button>

        {/* Tab 2: 卦录历史 HISTORY */}
        <button
          id="nav_tab_history"
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center h-full w-20 cursor-pointer transition-all border-t-2 pt-1 relative ${
            activeTab === 'history' ? 'text-[#c5a059] border-[#c5a059]' : 'text-stone-500 hover:text-stone-400 border-transparent'
          }`}
        >
          <Archive className={`w-4 h-4 mb-0.5 transition-transform duration-300 ${activeTab === 'history' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-serif tracking-[0.15em] font-medium">卦录</span>
          <span className="text-[7.5px] font-mono tracking-wider opacity-50 uppercase">HISTORY</span>
          {records.length > 0 && (
            <span className="absolute top-2 right-2 bg-red-600 text-white font-sans text-[8px] px-1 py-0.2 rounded-full min-w-3.5 text-center leading-tight">
              {records.length > 99 ? '99+' : records.length}
            </span>
          )}
        </button>

        {/* Tab 3: 民俗百科 ARCHIVE */}
        <button
          id="nav_tab_ency"
          onClick={() => setActiveTab('ency')}
          className={`flex flex-col items-center justify-center h-full w-20 cursor-pointer transition-all border-t-2 pt-1 ${
            activeTab === 'ency' ? 'text-[#c5a059] border-[#c5a059]' : 'text-stone-500 hover:text-stone-400 border-transparent'
          }`}
        >
          <BookOpen className={`w-4 h-4 mb-0.5 transition-transform duration-300 ${activeTab === 'ency' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-serif tracking-[0.15em] font-medium">百科</span>
          <span className="text-[7.5px] font-mono tracking-wider opacity-50 uppercase">ARCHIVE</span>
        </button>

        {/* Tab 4: 设置中心 SETTINGS */}
        <button
          id="nav_tab_settings"
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center h-full w-20 cursor-pointer transition-all border-t-2 pt-1 ${
            activeTab === 'settings' ? 'text-[#c5a059] border-[#c5a059]' : 'text-stone-500 hover:text-stone-400 border-transparent'
          }`}
        >
          <Settings className={`w-4 h-4 mb-0.5 transition-transform duration-300 ${activeTab === 'settings' ? 'scale-110 rotate-45' : ''}`} />
          <span className="text-[10px] font-serif tracking-[0.15em] font-medium">设置</span>
          <span className="text-[7.5px] font-mono tracking-wider opacity-50 uppercase">SETTINGS</span>
        </button>

      </nav>

      </div>
      {/* ========== 隐私政策弹窗层（与主内容同级，不被 blur/brightness 影响）========== */}
      {showPrivacyModal && (
        <PrivacyModal
          onAccept={handlePrivacyAccept}
          onDecline={handlePrivacyDeclineClick}
          onOpenAgreement={() => setDetailModal('agreement')}
          onOpenPrivacy={() => setDetailModal('privacy')}
          showAgreementModal={detailModal}
        />
      )}

      {detailModal === 'agreement' && (
        <AgreementModal
          title="用户服务协议"
          content={<UserAgreementContent />}
          onClose={() => setDetailModal(null)}
        />
      )}

      {detailModal === 'privacy' && (
        <AgreementModal
          title="隐私政策"
          content={<PrivacyPolicyContent />}
          onClose={() => setDetailModal(null)}
        />
      )}

      {showDeclineModal && (
        <DeclineConfirmModal
          onCancel={handleDeclineCancel}
          onConfirm={handleDeclineConfirm}
        />
      )}

    </div>
  );
}
