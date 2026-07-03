/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum CupState {
  INITIAL = 'INITIAL',
  HELD = 'HELD',
  THROWING = 'THROWING',
  LANDED = 'LANDED'
}

export enum GuaResult {
  SHENG_BEI = 'SHENG_BEI', // 胜杯（圣杯 / 顺卦）: 一正一反
  XIAO_BEI = 'XIAO_BEI',   // 笑杯（阳杯）: 两片正面朝上
  YIN_BEI = 'YIN_BEI'      // 阴杯（没杯 / 逆卦）: 两片反面朝下
}

export interface WishTemplate {
  id: string;
  category: 'career' | 'love' | 'health' | 'wealth' | 'education' | 'custom';
  title: string;
  content: string;
}

export interface ThrowRecord {
  id: string;
  timestamp: number;
  wish: string;
  result: GuaResult;
  themeId: string;
  notes: string; // Additional notes or suggestions
}

export interface UserSettings {
  vibrationEnabled: boolean;
  soundMasterEnabled: boolean;
  soundBgEnabled: boolean; // Background ambient music
  soundEffectEnabled: boolean; // SFX (throw, land, grip)
  dynamicLightingEnabled: boolean;
  particlesEnabled: boolean;
  performanceMode: '3D' | '2D'; // 3D for CSS 3D Transforms, 2D for simplified flat scale/opacity transitions
}

export type ThemeId = 'sitan' | 'cici' | 'suian';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  bgGradient: string;
  cupColorPrimary: string;
  cupColorSecondary: string;
  accentColor: string;
  particlesColor: string;
}
