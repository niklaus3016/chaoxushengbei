/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Compass, Award, ShieldAlert, Heart, Star, MapPin } from 'lucide-react';

export const EncyclopediaTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'origin' | 'gua' | 'etiquette' | 'customs'>('origin');

  return (
    <div className="relative w-full h-full overflow-y-auto px-4 py-5 scrollbar-none no-scrollbar">
      
      {/* Header Scroll Badge */}
      <div className="max-w-md mx-auto text-center mb-6 animate-fade-in select-none">
        <span className="inline-block px-3 py-1 bg-[#c5a059]/10 text-[#c5a059] text-[10px] font-serif border border-[#c5a059]/20 rounded-md tracking-widest uppercase mb-2">
          非物质文化遗产科普
        </span>
        <h2 className="text-[#c5a059] font-serif text-2xl tracking-[0.25em] font-semibold">
          潮汕圣杯民俗百科
        </h2>
        <p className="text-stone-500 text-xs mt-1.5 font-serif tracking-wider">
          寻根潮汕掷杯仪轨，感悟古人敬畏天地之智慧
        </p>
      </div>

      {/* Internal Navigation Rings */}
      <div className="max-w-md mx-auto flex gap-1 bg-stone-950 p-1 rounded-xl border border-stone-900 mb-5 text-xs font-serif overflow-x-auto no-scrollbar scrollbar-none">
        <button
          id="ency_nav_origin"
          onClick={() => setActiveSection('origin')}
          className={`flex-1 py-1.5 rounded-lg whitespace-nowrap px-3 text-center transition-all cursor-pointer ${
            activeSection === 'origin'
              ? 'bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/35 font-medium'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          文化起源
        </button>
        <button
          id="ency_nav_gua"
          onClick={() => setActiveSection('gua')}
          className={`flex-1 py-1.5 rounded-lg whitespace-nowrap px-3 text-center transition-all cursor-pointer ${
            activeSection === 'gua'
              ? 'bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/35 font-medium'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          卦象深解
        </button>
        <button
          id="ency_nav_etiquette"
          onClick={() => setActiveSection('etiquette')}
          className={`flex-1 py-1.5 rounded-lg whitespace-nowrap px-3 text-center transition-all cursor-pointer ${
            activeSection === 'etiquette'
              ? 'bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/35 font-medium'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          问卜礼仪
        </button>
        <button
          id="ency_nav_customs"
          onClick={() => setActiveSection('customs')}
          className={`flex-1 py-1.5 rounded-lg whitespace-nowrap px-3 text-center transition-all cursor-pointer ${
            activeSection === 'customs'
              ? 'bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/35 font-medium'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          祈福百科
        </button>
      </div>

      {/* Encyclopedia Display Scroll */}
      <div className="max-w-md mx-auto space-y-4 pb-6 font-serif">
        
        {/* SECTION 1: ORIGIN */}
        {activeSection === 'origin' && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="bg-stone-950 border border-stone-900 rounded-2xl p-5 relative overflow-hidden">
              <Compass className="absolute right-4 top-4 w-16 h-16 text-stone-900/40 pointer-events-none" />
              <h3 className="text-[#c5a059] text-sm font-semibold tracking-wider flex items-center gap-2 mb-2.5">
                <Compass className="w-4 h-4" />
                <span>圣杯之历史源流</span>
              </h3>
              <p className="text-stone-300 text-xs leading-relaxed mb-3">
                “圣杯”（潮汕方言中常读作“Boh-buey”，亦作“筊杯”）是中国南方尤其是潮汕地区、闽南地区极为盛行的传统占卜与祈福仪轨法器。其历史可追溯至周秦时期的“卜筮”，唐宋时期逐渐演变为木质或竹质的月牙形器具。
              </p>
              <p className="text-stone-400 text-xs leading-relaxed">
                潮汕先民多依海而居，常年面对风浪无常的海洋。在与大自然搏斗的过程中，人们形成了敬畏天地、祈求神明护佑的淳朴心灵寄托。“掷杯”不仅是与神明“沟通”的桥梁，更是一种在迷茫、犹豫时通过民俗规矩寻求心理平衡、自我静心的文化宣泄方式。
              </p>
            </div>

            <div className="bg-stone-950 border border-stone-900 rounded-2xl p-5">
              <h3 className="text-[#c5a059] text-sm font-semibold tracking-wider flex items-center gap-2 mb-2.5">
                <Award className="w-4 h-4" />
                <span>老樟木圣杯的质感</span>
              </h3>
              <p className="text-stone-300 text-xs leading-relaxed">
                正统的潮汕圣杯一般采用樟树根（老樟木）、竹根或相思木手工雕刻而成。天然老樟木富有淡淡清香，历经岁月洗礼后表面会呈现出沉稳 of 暗红褐色，手感温润如玉。两片圣杯大小严丝合缝，月牙两端微微上翘，承载着非遗手工艺人世代相传的匠心与虔诚。
              </p>
            </div>
          </div>
        )}

        {/* SECTION 2: GUA EXPLANATION */}
        {activeSection === 'gua' && (
          <div className="space-y-3.5 animate-fade-in text-left">
            {/* 1. 胜杯 */}
            <div className="bg-stone-950 border border-emerald-950/40 rounded-2xl p-4.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h4 className="text-emerald-400 text-sm font-bold tracking-wider">胜杯（圣杯 / 顺卦）</h4>
                </div>
                <span className="text-[10px] text-stone-500 font-mono">一正一反 (1 Yin, 1 Yang)</span>
              </div>
              <p className="text-stone-300 text-xs leading-relaxed mb-2 font-serif">
                一副圣杯由凸起的一面（阴/反）与平坦的一面（阳/正）组成。掷杯时若呈现一正一反，即为“胜杯”，在潮汕话中也称作“好卦”或“神明应允”。
              </p>
              <p className="text-stone-400 text-xs leading-relaxed font-serif">
                此卦象征阴阳调和、宇宙法则相顺相成，预示着所求之事顺天时、得地利、遇贵人，万事可行可成。
              </p>
            </div>

            {/* 2. 笑杯 */}
            <div className="bg-stone-950 border border-amber-950/40 rounded-2xl p-4.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h4 className="text-amber-400 text-sm font-bold tracking-wider">笑杯（阳杯 / 留卦）</h4>
                </div>
                <span className="text-[10px] text-stone-500 font-mono">双面皆仰 (2 Yang)</span>
              </div>
              <p className="text-stone-300 text-xs leading-relaxed mb-2 font-serif">
                两片杯的平坦面同时朝上（即两个正面），称作“笑杯”。神明“笑而不答”，预示着所问之事机缘未成熟，或弟子内心思绪过于混乱。
              </p>
              <p className="text-stone-400 text-xs leading-relaxed font-serif">
                这是一种善意的警示，旨在建议问者先静下心来，理清计划，等待更佳时机，或重新把诉求倾诉清楚后再行请示。
              </p>
            </div>

            {/* 3. 阴杯 */}
            <div className="bg-stone-950 border border-red-950/40 rounded-2xl p-4.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <h4 className="text-red-400 text-sm font-bold tracking-wider">阴杯（没杯 / 哭杯 / 逆卦）</h4>
                </div>
                <span className="text-[10px] text-stone-500 font-mono">双面皆俯 (2 Yin)</span>
              </div>
              <p className="text-stone-300 text-xs leading-relaxed mb-2 font-serif">
                两片杯的凸起面同时朝上（即两个反面），在潮汕常叫“没杯”、“哭杯”或“阴杯”。表明神明不赞同此决定，或此路当下不可通。
              </p>
              <p className="text-stone-400 text-xs leading-relaxed font-serif">
                古人认为这并不是绝对的灾祸，而是一种劝诫性保护：提示当下时运阻碍甚多，强行推进极易招致亏损，应及时退守休养，规避风险。
              </p>
            </div>
          </div>
        )}

        {/* SECTION 3: ETIQUETTE & TABOOS */}
        {activeSection === 'etiquette' && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="bg-stone-950 border border-stone-900 rounded-2xl p-5">
              <h3 className="text-[#c5a059] text-sm font-semibold tracking-wider flex items-center gap-2 mb-2.5">
                <ShieldAlert className="w-4 h-4 text-[#c5a059]" />
                <span>正统问卜三不问（古训禁忌）</span>
              </h3>
              <ul className="space-y-3">
                <li className="border-b border-stone-900 pb-2.5">
                  <strong className="text-stone-200 text-xs block mb-1">一、一事不二问</strong>
                  <span className="text-stone-400 text-xs leading-relaxed">
                    对同一件心愿，每日只可请示一次。不可因为第一次得不到“胜杯”，便反复抛掷强求。这是对自然法则与神明意愿的傲慢，也违背了祈愿修身、随缘知足的虔诚心态。
                  </span>
                </li>
                <li className="border-b border-stone-900 pb-2.5">
                  <strong className="text-stone-200 text-xs block mb-1">二、无心之问不答</strong>
                  <span className="text-stone-400 text-xs leading-relaxed">
                    抱着开玩笑、轻视或试探、好玩的心态抛掷，杯象失去精神支撑。掷杯应当立于“心静”，若心浮气躁或三心二意，则难以唤起内心本真的潜意识指引。
                  </span>
                </li>
                <li>
                  <strong className="text-stone-200 text-xs block mb-1">三、不合不义不问</strong>
                  <span className="text-stone-400 text-xs leading-relaxed">
                    凡是涉及非法投机、作奸犯科、损人利己等违背公序良俗与道德底线的事情，绝对不可向神明祈求。此等心愿皆被阴爻遮蔽，掷杯毫无良性意义。
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-stone-950 border border-stone-900 rounded-2xl p-5">
              <h3 className="text-[#c5a059] text-sm font-semibold tracking-wider flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span>掷杯的仪式四步骤</span>
              </h3>
              <p className="text-stone-300 text-xs leading-relaxed">
                1. <strong>整仪静思</strong>：双手整理衣冠，平复呼吸，排除杂念，让思绪彻底安定下来。<br />
                2. <strong>诚心秉告</strong>：双手合扣圣杯，放置于胸前，心中默念：弟子（某某）、生辰八字、现居地址，及今日心中欲求指引的清澈诉求。<br />
                3. <strong>双手抛掷</strong>：双手平捧圣杯，双手向斜上方滑步抛出（如App中双手长按上滑），让圣杯自然旋转下落，感知木块在地面悦耳撞击。<br />
                4. <strong>诚敬谢礼</strong>：落地后细细品鉴卦象，不论好坏皆是一份对自我的洞察与神明的护念，双手合十，心存感激。
              </p>
            </div>
          </div>
        )}

        {/* SECTION 4: CHAO SHAN CUSTOMS */}
        {activeSection === 'customs' && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="bg-stone-950 border border-stone-900 rounded-2xl p-5">
              <h3 className="text-[#c5a059] text-sm font-semibold tracking-wider flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-[#c5a059]" />
                <span>潮汕民间三大盛大祈福民俗</span>
              </h3>
              
              <div className="space-y-4 text-xs">
                {/* 营老爷 */}
                <div className="border-l-2 border-[#c5a059]/30 pl-3">
                  <h4 className="text-stone-200 font-bold mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#c5a059]" />
                    <span>一、营老爷（游神绕境）</span>
                  </h4>
                  <p className="text-stone-400 leading-relaxed">
                    潮汕最震撼人心的迎神游行。每年农历正月期间，各村落会将供奉的神明（“老爷”）请上神轿，由村中青壮年抬轿，锣鼓喧天、彩旗蔽日、鞭炮连天，沿街巡游。每逢此会，游子回乡，全村人均会用掷杯决定今年巡游的抬轿路线、接神吉时，共祈合境平安、风调雨顺。
                  </p>
                </div>

                {/* 拜天公 */}
                <div className="border-l-2 border-[#c5a059]/30 pl-3">
                  <h4 className="text-stone-200 font-bold mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#c5a059]" />
                    <span>二、拜天公（正月初九）</span>
                  </h4>
                  <p className="text-stone-400 leading-relaxed">
                    俗称“天公生”，是潮汕人祭拜玉皇大帝的最高礼仪。初八深夜，家家户户便在大堂高悬红灯笼，搭起高脚红桌，陈列红粿、五牲、水果和香火。在虔诚敬拜后，长辈会双手抱杯，庄重祈问今年家族是否有喜气，神明是否降福全家。
                  </p>
                </div>

                {/* 谢神与答谢 */}
                <div className="border-l-2 border-[#c5a059]/30 pl-3">
                  <h4 className="text-stone-200 font-bold mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#c5a059]" />
                    <span>三、送神与答谢（岁末答谢）</span>
                  </h4>
                  <p className="text-stone-400 leading-relaxed">
                    每年农历腊月二十四是潮汕传统的“送神日”。人们在此日前夕，置办香火果品，感谢神明一年来的悉心呵护。掷得连续胜杯，表明答谢完满，神明欢喜回天，家家户户方能进行岁末大扫除（“扫尘”），准备辞旧迎新。
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
