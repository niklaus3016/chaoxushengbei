/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

// 拒绝隐私政策的二次确认弹窗（层级最高）
// UI 风格：深色 + 金色 #c5a059 强调色，与 App 整体协调

export interface DeclineConfirmModalProps {
  onCancel: () => void;  // 用户点"取消"（回到主弹窗，重新选择）
  onConfirm: () => void; // 用户点"确定拒绝"（强制退出应用或再次提示）
}

export const DeclineConfirmModal = ({ onCancel, onConfirm }: DeclineConfirmModalProps) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[70]">
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.92, opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#0e0e11] rounded-[28px] w-full max-w-md overflow-hidden shadow-2xl border border-[#c5a059]/15 flex flex-col"
    >
      {/* 头部提示区 */}
      <div className="flex-1 p-6 sm:p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-bold text-stone-100 font-serif tracking-wide">
            确认拒绝
          </h2>
        </div>

        <p className="text-stone-400 leading-relaxed mb-3">
          您确定要拒绝《用户协议》与《隐私政策》吗？
        </p>
        <p className="text-stone-500 text-sm leading-relaxed">
          本应用基于相关协议与政策向您提供掷杯祈福、卦录回溯等全部功能，
          <span className="text-[#c5a059]">拒绝后将无法进入或使用应用</span>。
          若您已改变主意，可选择「取消」返回并重新阅读协议。
        </p>
      </div>

      {/* 底部按钮组 */}
      <div className="flex border-t border-stone-900">
        <button
          onClick={onCancel}
          type="button"
          className="flex-1 py-4 text-center text-stone-300 font-medium hover:bg-stone-900/70 active:bg-stone-900 transition-colors rounded-bl-[28px]"
        >
          取消
        </button>
        <div className="w-px bg-stone-900 shrink-0"></div>
        <button
          onClick={onConfirm}
          type="button"
          className="flex-1 py-4 text-center text-[#c5a059] font-medium hover:bg-stone-900/70 active:bg-stone-900 transition-colors rounded-br-[28px]"
        >
          确定拒绝
        </button>
      </div>
    </motion.div>
  </div>
);
