/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export { PrivacyModal } from './PrivacyModal';
export type { PrivacyModalProps } from './PrivacyModal';
export { AgreementModal } from './AgreementModal';
export type { AgreementModalProps } from './AgreementModal';
export { DeclineConfirmModal } from './DeclineConfirmModal';
export type { DeclineConfirmModalProps } from './DeclineConfirmModal';
export { PrivacyPolicyContent } from './PrivacyPolicyContent';
export { UserAgreementContent } from './UserAgreementContent';

// localStorage key（与 App 内其他 cs_*_v1 前缀保持一致）
export const PRIVACY_CONSENT_STORAGE_KEY = 'cs_privacy_consent_v1' as const;

export interface PrivacyConsentRecord {
  agreed: true;
  version: '1.0';
  /** Unix ms */
  agreedAt: number;
  userAgent: string;
}

// ------ 读写工具（供 App.tsx 调用）------

/** 读取同意状态；未同意或数据异常一律返回 null */
export function readPrivacyConsent(): PrivacyConsentRecord | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem(PRIVACY_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PrivacyConsentRecord>;
    if (parsed?.agreed === true && parsed?.version === '1.0' && typeof parsed.agreedAt === 'number') {
      return parsed as PrivacyConsentRecord;
    }
    return null;
  } catch {
    return null;
  }
}

/** 写入同意记录（带版本号、时间戳、UA，便于审计） */
export function writePrivacyConsent(): PrivacyConsentRecord {
  const record: PrivacyConsentRecord = {
    agreed: true,
    version: '1.0',
    agreedAt: Date.now(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };
  try {
    localStorage.setItem(PRIVACY_CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* no-op */
  }
  return record;
}
