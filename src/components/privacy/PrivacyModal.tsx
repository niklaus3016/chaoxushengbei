/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ScrollText } from 'lucide-react';

// 隐私政策 + 用户协议 主弹窗（启动时首次弹出）
// UI 风格：深色 #0a0a0c 背景 + 金色 #c5a059 强调色 + Noto Serif SC 字体，完全契合 App 主色调

interface PrivacyModalProps {
  onAccept: () => void;              // 同意并继续
  onDecline: () => void;             // 点「不同意」→ 触发二次确认
  onOpenAgreement: () => void;       // 打开《用户服务协议》详情弹窗
  onOpenPrivacy: () => void;         // 打开《隐私政策》详情弹窗
  /** 兼容参考代码 prop；用于外部样式联动，本组件内可忽略 */
  showAgreementModal?: 'agreement' | 'privacy' | null;
}

export type { PrivacyModalProps };

export const PrivacyModal = ({
  onAccept,
  onDecline,
  onOpenAgreement,
  onOpenPrivacy,
}: PrivacyModalProps) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 8 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#0e0e11] w-full max-w-sm shadow-2xl max-h-[82vh] overflow-y-auto rounded-[28px] border border-[#c5a059]/20 no-scrollbar"
    >
      <div className="p-6">
        {/* 顶部小图标装饰 */}
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center text-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.12)]">
            <ScrollText size={22} />
          </div>
        </div>

        <h3 className="text-xl font-bold text-stone-100 mb-2 text-center pt-2 font-serif tracking-[0.15em]">
          潮序圣杯
        </h3>
        <p className="text-center text-[#c5a059] mb-6 text-sm font-serif tracking-wider">
          用户协议与隐私政策
        </p>

        {/* 摘要说明 */}
        <div className="mb-6 space-y-3">
          <p className="text-sm text-stone-300 leading-relaxed">
            (1)《<span className="text-[#c5a059] font-medium">隐私政策</span>》中关于个人设备用户信息的收集和使用的说明。
          </p>
          <p className="text-sm text-stone-300 leading-relaxed">
            (2)《<span className="text-[#c5a059] font-medium">隐私政策</span>》中与第三方 SDK 类服务商数据共享、相关信息收集和使用说明。
          </p>
        </div>

        {/* 完整协议链接 */}
        <div className="bg-stone-900/60 rounded-2xl p-4 border border-stone-900/80">
          <p className="text-xs text-stone-500 mb-2 font-serif tracking-wider">
            协议与政策说明
          </p>
          <p className="text-sm text-stone-400 leading-relaxed">
            请您仔细阅读完整的
            <span
              onClick={onOpenAgreement}
              className="text-[#c5a059] hover:underline cursor-pointer font-medium mx-1 transition-colors"
            >
              《用户服务协议》
            </span>
            和
            <span
              onClick={onOpenPrivacy}
              className="text-[#c5a059] hover:underline cursor-pointer font-medium mx-1 transition-colors"
            >
              《隐私政策》
            </span>
            ，了解详细内容。点击「同意并继续」即表示您已阅读并同意上述全部内容。
          </p>
        </div>
      </div>

      {/* 底部按钮组 */}
      <div className="flex border-t border-stone-900/80 sticky bottom-0 bg-[#0e0e11]">
        <button
          onClick={onDecline}
          type="button"
          className="flex-1 py-4 text-base font-medium text-stone-400 bg-transparent border-r border-stone-900/80 rounded-bl-[28px] hover:bg-stone-900/60 active:bg-stone-900 transition-colors"
        >
          不同意
        </button>
        <button
          onClick={onAccept}
          type="button"
          className="flex-1 py-4 text-base font-medium text-black bg-gradient-to-b from-[#e6c78a] via-[#c5a059] to-[#8a6c3a] hover:brightness-110 rounded-br-[28px] transition-all shadow-[0_0_18px_rgba(197,160,89,0.25)] tracking-wider"
        >
          同意并继续
        </button>
      </div>
    </motion.div>
  </div>
);
