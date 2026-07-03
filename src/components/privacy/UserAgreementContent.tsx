/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 用户服务协议正文内容 —— 应用名「潮序圣杯」适配版
// 公司名保持参考代码不动（光年跃迁（温州）科技有限公司），管辖法院同步（温州市）
// 更新日期改为今日（2026年07月03日）

export const UserAgreementContent = () => (
  <div className="max-w-none text-stone-300 font-sans leading-relaxed">
    <h1 className="text-2xl font-bold text-[#c5a059] text-center mb-4 font-serif tracking-wider">
      用户服务协议
    </h1>
    <p className="text-center text-stone-500 mb-8 text-sm">
      更新日期：2026年07月03日
    </p>

    {/* ---------- 1. 协议的接受 ---------- */}
    <h2 className="text-lg font-semibold mt-6 mb-4 font-serif text-[#c5a059] border-b border-stone-800 pb-2">
      1. 协议的接受
    </h2>
    <p className="mb-3 text-sm text-stone-300">
      欢迎使用「<strong className="text-[#c5a059]">潮序圣杯</strong>」应用（以下简称「本应用」）。
    </p>
    <p className="mb-3 text-sm text-stone-300">
      本协议是您与<strong>光年跃迁（温州）科技有限公司</strong>（以下简称「我们」）之间关于使用本应用的法律协议。
    </p>
    <p className="mb-4 text-sm text-stone-300">
      通过下载、安装或使用本应用，您表示同意接受本协议的全部条款和条件。
      若您不同意本协议的任何内容，请立即停止使用本应用并卸载。
    </p>

    {/* ---------- 2. 服务内容 ---------- */}
    <h2 className="text-lg font-semibold mt-8 mb-4 font-serif text-[#c5a059] border-b border-stone-800 pb-2">
      2. 服务内容
    </h2>
    <p className="mb-3 text-sm text-stone-300">本应用为您提供以下传统文化祈福类服务：</p>
    <ul className="list-disc pl-6 space-y-2 mb-4 text-sm text-stone-300">
      <li>圣杯掷杯：模拟传统「圣杯 / 胜杯 / 笑杯 / 阴杯」的掷杯祈福过程，提供 2D/3D 两种视觉模式</li>
      <li>祈愿内容记录：支持默认祈愿模板与自定义祈愿内容的录入</li>
      <li>卦录回溯：保存每次掷杯的卦象、时间、祈愿内容及备注，支持单条删除与一键清空</li>
      <li>民俗百科：提供圣杯、卦象、民俗含义的科普与参考解读</li>
      <li>主题皮肤：提供「静檀沉香」「祠堂雅韵」「岁安祈福」等多种主题氛围切换</li>
      <li>音效与震动：提供氛围感背景音、掷杯落地音效及震动反馈等个性化设置</li>
    </ul>
    <p className="mb-4 text-sm text-stone-400 italic">
      * 以上服务内容仅供传统文化娱乐与参考，不构成任何形式的占卜、医疗、法律、财务或投资建议。
    </p>

    {/* ---------- 3. 用户义务 ---------- */}
    <h2 className="text-lg font-semibold mt-8 mb-4 font-serif text-[#c5a059] border-b border-stone-800 pb-2">
      3. 用户义务
    </h2>
    <p className="mb-3 text-sm text-stone-300">作为本应用的用户，您同意：</p>
    <ul className="list-disc pl-6 space-y-2 mb-4 text-sm text-stone-300">
      <li>遵守本协议的所有条款以及中华人民共和国相关法律法规</li>
      <li>不利用本应用从事任何违法、违规、违背公序良俗的活动</li>
      <li>不干扰、破坏、攻击本应用的正常运行，不得注入恶意代码或尝试越权访问</li>
      <li>妥善保管您的设备安全，防止未授权人员使用您的账号与本应用</li>
      <li>不得将本应用的卦象解读结果用于赌博、诈骗、邪教传播或其他非法用途</li>
    </ul>

    {/* ---------- 4. 知识产权 ---------- */}
    <h2 className="text-lg font-semibold mt-8 mb-4 font-serif text-[#c5a059] border-b border-stone-800 pb-2">
      4. 知识产权
    </h2>
    <p className="mb-3 text-sm text-stone-300">
      本应用的所有内容，包括但不限于文字、图像、音频、视频、软件、代码、界面设计、图标、动画、商标、
      民俗百科词条内容及算法逻辑等，均受中华人民共和国知识产权法律及相关国际条约保护。
    </p>
    <p className="mb-4 text-sm text-stone-300">
      未经我们的书面许可，您不得以任何形式复制、修改、分发、传播、展示、反向工程或商业使用本应用的任何内容。
    </p>

    {/* ---------- 5. 免责声明 ---------- */}
    <h2 className="text-lg font-semibold mt-8 mb-4 font-serif text-[#c5a059] border-b border-stone-800 pb-2">
      5. 免责声明
    </h2>
    <p className="mb-3 text-sm text-stone-300">
      本应用按「原样」提供，在法律法规允许的最大范围内，我们不对本应用做任何形式的明示或默示保证。
    </p>
    <p className="mb-3 text-sm text-stone-300">我们不保证：</p>
    <ul className="list-disc pl-6 space-y-2 mb-4 text-sm text-stone-300">
      <li>本应用将符合您的全部要求或持续不间断运行</li>
      <li>本应用将及时、安全、无中断、无错误地提供服务</li>
      <li>卦象解读等百科内容完全准确、完整、可作为任何决策依据</li>
    </ul>
    <p className="mb-4 text-sm text-stone-300">
      因您使用或无法使用本应用所产生的任何直接或间接损失，在法律法规允许的最大范围内，我们不承担责任。
    </p>

    {/* ---------- 6. 终止 ---------- */}
    <h2 className="text-lg font-semibold mt-8 mb-4 font-serif text-[#c5a059] border-b border-stone-800 pb-2">
      6. 终止
    </h2>
    <p className="mb-3 text-sm text-stone-300">
      我们有权在任何时候，出于任何合理原因（包括但不限于您违反本协议），终止或暂停您对本应用的访问。
    </p>
    <p className="mb-4 text-sm text-stone-300">
      您也可以随时卸载本应用，停止使用本应用服务。
    </p>

    {/* ---------- 7. 适用法律 ---------- */}
    <h2 className="text-lg font-semibold mt-8 mb-4 font-serif text-[#c5a059] border-b border-stone-800 pb-2">
      7. 适用法律与争议解决
    </h2>
    <p className="mb-3 text-sm text-stone-300">
      本协议的订立、效力、解释、履行、变更、终止及争议解决，均受<strong>中华人民共和国法律</strong>管辖。
    </p>
    <p className="mb-4 text-sm text-stone-300">
      任何与本协议相关的争议，应首先通过友好协商解决；协商不成的，应提交至<strong>温州市有管辖权的人民法院</strong>诉讼解决。
    </p>

    {/* ---------- 8. 联系我们 ---------- */}
    <h2 className="text-lg font-semibold mt-8 mb-4 font-serif text-[#c5a059] border-b border-stone-800 pb-2">
      8. 联系我们
    </h2>
    <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800 mb-6 text-sm">
      <p className="mb-2 text-stone-300">
        <strong className="text-[#c5a059]">运营主体</strong>：光年跃迁（温州）科技有限公司
      </p>
      <p className="mb-2 text-stone-300">
        <strong className="text-[#c5a059]">电子邮箱</strong>：Jp112022@163.com
      </p>
    </div>

    <div className="mt-8 pt-6 border-t border-stone-800 text-center">
      <p className="text-xs text-stone-600 font-serif tracking-wider">
        © 2026 光年跃迁（温州）科技有限公司 版权所有
      </p>
    </div>
  </div>
);
