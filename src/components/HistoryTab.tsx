/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GuaResult, ThrowRecord } from '../types';
import { GUA_DATA } from './MainTab';
import { ShengBeiModel } from './ShengBeiModel';
import { Calendar, Trash2, Share2, Filter, AlertTriangle, ChevronRight, X, Sparkles, Check, Bookmark } from 'lucide-react';

interface HistoryTabProps {
  records: ThrowRecord[];
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onNavigateToThrow: () => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  records,
  onDeleteRecord,
  onClearAll,
  onNavigateToThrow,
}) => {
  const [filter, setFilter] = useState<'all' | GuaResult>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Custom Share card mockup state
  const [selectedShareRecord, setSelectedShareRecord] = useState<ThrowRecord | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Filter records
  const filteredRecords = filter === 'all' 
    ? records 
    : records.filter((r) => r.result === filter);

  // Format date helper
  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleShareClick = (rec: ThrowRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedShareRecord(rec);
    setCopySuccess(false);
  };

  const copyShareText = (rec: ThrowRecord) => {
    const gua = GUA_DATA[rec.result];
    const text = `【潮序圣杯 • 吉言分享】\n心愿：${rec.wish}\n卦象：${gua.name} (${gua.alias})\n批注：${gua.meaning}\n启示：${gua.advice}\n-- 纯本地沉浸式潮汕祈福体验 --`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }).catch(() => {
        // Fallback
        alert(text);
      });
    } else {
      alert(text);
    }
  };

  return (
    <div className="relative w-full h-full overflow-y-auto px-4 py-5 scrollbar-none no-scrollbar">
      
      {/* Title & Stats */}
      <div className="max-w-md mx-auto flex items-center justify-between mb-5 select-none">
        <div>
          <h2 className="text-[#c5a059] font-serif text-lg tracking-widest font-light">卦录历史</h2>
          <p className="text-stone-500 text-[11px] font-serif mt-0.5">
            共存有 <span className="text-[#c5a059] font-mono font-medium">{records.length}</span> 条虔诚问卜记录
          </p>
        </div>
        {records.length > 0 && (
          <button
            id="clear_all_records_btn"
            onClick={() => setShowClearConfirm(true)}
            className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 border border-red-950/30 hover:border-red-900 bg-red-950/10 px-2.5 py-1 rounded-md transition-colors font-serif cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>清空记录</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="max-w-md mx-auto flex gap-1 bg-stone-950 p-1 rounded-xl border border-stone-900 mb-5">
        {(['all', GuaResult.SHENG_BEI, GuaResult.XIAO_BEI, GuaResult.YIN_BEI] as const).map((opt) => (
          <button
            key={opt}
            id={`filter_tab_${opt}`}
            onClick={() => setFilter(opt)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer ${
              filter === opt
                ? 'bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 shadow-md font-medium'
                : 'text-stone-400 hover:text-[#c5a059]'
            }`}
          >
            {opt === 'all' && '全部'}
            {opt === GuaResult.SHENG_BEI && '胜杯'}
            {opt === GuaResult.XIAO_BEI && '笑杯'}
            {opt === GuaResult.YIN_BEI && '阴杯'}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredRecords.length === 0 && (
        <div className="max-w-md mx-auto bg-stone-950/50 border border-stone-900 rounded-2xl py-12 px-6 text-center mt-6">
          <Bookmark className="w-10 h-10 text-stone-600 mx-auto mb-3" />
          <h3 className="text-stone-400 font-serif text-sm tracking-widest">暂无相关历史</h3>
          <p className="text-stone-600 text-xs mt-1.5 font-serif leading-relaxed">
            {filter === 'all' ? '未找到任何抛杯历史。请向神明诚心诉说心愿吧。' : '未查询到对应卦象的历史。'}
          </p>
          {filter === 'all' && (
            <button
              id="empty_state_go_btn"
              onClick={onNavigateToThrow}
              className="mt-5 px-5 py-2 bg-gradient-to-r from-[#c5a059]/20 to-[#c5a059]/10 border border-[#c5a059]/30 rounded-xl text-xs text-[#c5a059] font-serif hover:opacity-90 transition-opacity cursor-pointer"
            >
              立刻祈福抛杯
            </button>
          )}
        </div>
      )}

      {/* Historic Records List */}
      <div className="max-w-md mx-auto space-y-2.5 pb-6">
        {filteredRecords.map((rec) => {
          const gua = GUA_DATA[rec.result];
          const isExpanded = expandedId === rec.id;

          return (
            <div
              key={rec.id}
              id={`history_item_${rec.id}`}
              onClick={() => setExpandedId(isExpanded ? null : rec.id)}
              className="bg-stone-950 border border-stone-900 hover:border-[#c5a059]/20 rounded-xl p-3.5 text-left cursor-pointer transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[11px] font-bold font-serif px-2.5 py-0.5 rounded-full ${
                      rec.result === GuaResult.SHENG_BEI
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40'
                        : rec.result === GuaResult.XIAO_BEI
                        ? 'bg-amber-950/40 text-amber-400 border border-amber-900/40'
                        : 'bg-red-950/40 text-red-400 border border-red-900/40'
                    }`}
                  >
                    {gua.name}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-stone-500 font-mono">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(rec.timestamp)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`delete_icon_btn_${rec.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRecord(rec.id);
                    }}
                    className="p-1.5 hover:bg-stone-900 rounded-lg text-stone-500 hover:text-red-400 transition-colors cursor-pointer"
                    title="删除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight
                    className={`w-4 h-4 text-stone-600 transition-transform duration-200 ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Wish content */}
              <p className="text-xs text-stone-300 font-serif mt-2.5 line-clamp-2 leading-relaxed">
                <span className="text-stone-500">所问事宜：</span>“{rec.wish}”
              </p>

              {/* Expandable details panel */}
              {isExpanded && (
                <div className="mt-3.5 pt-3.5 border-t border-stone-900 space-y-3 animate-fade-in text-xs font-serif">
                  <div className="bg-stone-900/20 rounded-lg p-2.5 border border-stone-900">
                    <span className="text-[10px] text-[#c5a059] tracking-widest block mb-0.5 font-semibold">【卦释】</span>
                    <p className="text-stone-300 text-[11px] leading-relaxed">
                      {gua.meaning}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#c5a059] tracking-widest block mb-0.5 font-semibold">【行止启示】</span>
                    <p className="text-stone-400 text-[11px] leading-relaxed">
                      {gua.advice}
                    </p>
                  </div>

                  <div className="text-[9px] text-stone-600 text-right font-mono">
                    记录印鉴：{rec.id}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CONFIRM CLEAR ALL MODAL */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-stone-950 border border-red-950/30 rounded-2xl p-5 max-w-xs w-full text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h3 className="text-stone-200 font-serif text-sm tracking-wider">清空所有卦录？</h3>
            <p className="text-stone-500 text-xs mt-2 font-serif leading-relaxed">
              确定清空后，所有本地离线存储的历史卦象及心愿备注将永远抹去，不可找回！请谨慎选择。
            </p>
            <div className="mt-4 flex gap-2">
              <button
                id="cancel_clear_btn"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-1.5 bg-stone-900 hover:bg-stone-800 text-xs text-stone-300 rounded-lg font-serif transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                id="confirm_clear_btn"
                onClick={() => {
                  onClearAll();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-1.5 bg-red-950 text-red-200 hover:bg-red-900 text-xs rounded-lg font-serif transition-colors border border-red-900/40 cursor-pointer"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED BLESSING SCROLL CARD (吉言福卡 SHARING MODAL) */}
      {selectedShareRecord && (() => {
        const gua = GUA_DATA[selectedShareRecord.result];
        return (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-md animate-fade-in">
            <div className="absolute top-4 right-4 z-20">
              <button
                id="close_share_modal_btn"
                onClick={() => setSelectedShareRecord(null)}
                className="p-2 bg-stone-900/80 border border-stone-800 rounded-full text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full max-w-sm bg-stone-950 border-4 border-[#c5a059]/30 rounded-3xl p-6 overflow-hidden my-4">
              
              {/* Card vintage decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#c5a059] m-3 opacity-60" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#c5a059] m-3 opacity-60" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#c5a059] m-3 opacity-60" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#c5a059] m-3 opacity-60" />

              {/* Watermark circle stamp */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full border border-[#c5a059]/5 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 rounded-full border border-[#c5a059]/2" />
              </div>

              {/* Card Main Header */}
              <div className="text-center pb-4 border-b border-[#c5a059]/10">
                <h2 className="text-[#c5a059] font-serif text-xs tracking-[0.4em] uppercase font-bold">
                  潮序圣杯 • 岁安吉言
                </h2>
                <span className="text-[9px] text-stone-600 font-mono tracking-widest uppercase block mt-0.5">
                  Chao Shan Sacred Oracle Seal
                </span>
              </div>

              {/* Card Body */}
              <div className="mt-5 space-y-4 text-left font-serif">
                
                {/* Visual outcome seal */}
                <div className="flex items-center gap-4 bg-stone-900/30 border border-stone-900 p-3 rounded-xl relative">
                  {/* Miniature representations of cup landing */}
                  <div className="flex gap-1 transform scale-50 -ml-3">
                    <ShengBeiModel
                      side={selectedShareRecord.result === GuaResult.XIAO_BEI ? 'flat' : 'convex'}
                      themeId={selectedShareRecord.themeId as any}
                      isRight={false}
                    />
                    <ShengBeiModel
                      side={selectedShareRecord.result === GuaResult.YIN_BEI ? 'convex' : 'flat'}
                      themeId={selectedShareRecord.themeId as any}
                      isRight={true}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl text-[#c5a059] font-bold tracking-widest">{gua.name}</h3>
                    <p className="text-[10px] text-stone-500 mt-0.5 tracking-wider">{gua.alias}</p>
                  </div>

                  {/* Red Square Seal Stamper */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 border border-red-500 rounded text-[9px] text-red-500 flex items-center justify-center font-bold rotate-12 p-0.5 leading-tight select-none opacity-80 uppercase">
                    神明<br />应允
                  </div>
                </div>

                {/* Wish statement */}
                <div>
                  <span className="text-[10px] text-[#c5a059] block mb-1">【弟子所求】</span>
                  <p className="text-[12px] text-stone-200 italic leading-relaxed pl-2 border-l border-[#c5a059]/20">
                    “{selectedShareRecord.wish}”
                  </p>
                </div>

                {/* Meaning / Interpretation */}
                <div>
                  <span className="text-[10px] text-[#c5a059] block mb-1">【吉言卦解】</span>
                  <p className="text-[11.5px] text-stone-300 leading-relaxed pl-2">
                    {gua.meaning}
                  </p>
                </div>

                {/* Moral Suggestion */}
                <div>
                  <span className="text-[10px] text-[#c5a059] block mb-1">【行止启示】</span>
                  <p className="text-[11px] text-stone-400 leading-relaxed pl-2">
                    {gua.advice}
                  </p>
                </div>

                {/* Footer seal metadata */}
                <div className="pt-4 border-t border-[#c5a059]/10 flex items-end justify-between">
                  <div className="text-[10px] text-stone-600 font-mono leading-relaxed">
                    <div>祈福时间：{formatDate(selectedShareRecord.timestamp)}</div>
                    <div>归档编号：{selectedShareRecord.id.slice(0, 11)}</div>
                  </div>
                  {/* Traditional Calligraphy Stamp */}
                  <div className="bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 text-[9px] px-2 py-0.5 rounded tracking-widest">
                    岁安常乐
                  </div>
                </div>

              </div>

              {/* Click to Copy/Share HUD */}
              <div className="mt-5 pt-1 grid grid-cols-2 gap-2">
                <button
                  id="copy_share_text_btn"
                  onClick={() => copyShareText(selectedShareRecord)}
                  className="py-2 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 text-xs font-serif rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">复制成功</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>复制吉言文本</span>
                    </>
                  )}
                </button>
                <button
                  id="close_selected_share_btn"
                  onClick={() => setSelectedShareRecord(null)}
                  className="py-2 bg-[#c5a059] text-black font-semibold text-xs font-serif rounded-lg transition-opacity hover:opacity-95 cursor-pointer"
                >
                  关闭福卡
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
