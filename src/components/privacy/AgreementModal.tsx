/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ShieldCheck, X } from 'lucide-react';
import type { ReactNode } from 'react';

// 协议/政策详情二级弹窗
// UI 风格：深色 #0a0a0c 背景 + 金色 #c5a059 强调色，匹配 App 主色调 + Noto Serif SC 字体

export interface AgreementModalProps {
  onClose: () => void;
  title: string;
  content: ReactNode;
}

export const AgreementModal = ({ onClose, title, content }: AgreementModalProps) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[60]">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#0e0e11] rounded-[28px] w-full max-w-3xl h-[85vh] overflow-hidden shadow-2xl border border-[#c5a059]/20 flex flex-col"
    >
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-stone-900 bg-[#0a0a0c] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#c5a059]/10 text-[#c5a059] rounded-xl flex items-center justify-center border border-[#c5a059]/20">
            <ShieldCheck size={22} />
          </div>
          <h2 className="text-xl font-bold text-stone-100 font-serif">{title}</h2>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="w-9 h-9 rounded-full bg-stone-900 flex items-center justify-center text-stone-400 active:scale-90 transition-transform hover:bg-stone-800 hover:text-stone-200 border border-stone-800"
          aria-label="关闭"
        >
          <X size={20} />
        </button>
      </div>

      {/* 可滚动内容区 */}
      <div className="flex-1 overflow-y-auto bg-[#0a0a0c] p-6 no-scrollbar">
        {content}
      </div>
    </motion.div>
  </div>
);
