import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, Info, ArrowRight, History, Sparkles } from 'lucide-react';
import { getLeapYearInfo, getLeapYearsInRange, type LeapYearInfo } from './services/lunar';
import { cn } from './utils/cn';

export default function App() {
  const [searchYear, setSearchYear] = useState<string>(new Date().getFullYear().toString());
  const [startYear, setStartYear] = useState<string>((new Date().getFullYear() - 10).toString());
  const [endYear, setEndYear] = useState<string>((new Date().getFullYear() + 10).toString());
  const [mode, setMode] = useState<'single' | 'range'>('single');
  const [results, setResults] = useState<LeapYearInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      if (mode === 'single') {
        const info = getLeapYearInfo(parseInt(searchYear));
        setResults([info]);
      } else {
        const leapYears = getLeapYearsInRange(parseInt(startYear), parseInt(endYear));
        setResults(leapYears);
      }
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a] font-serif selection:bg-[#5A5A40] selection:text-white">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2">
            农历闰年查询 <span className="italic text-2xl opacity-60">Lunar Leap Year</span>
          </h1>
          <p className="text-[#5A5A40] opacity-80 max-w-2xl mx-auto font-sans text-sm tracking-wide uppercase">
            探索中国传统历法中的置闰奥秘
          </p>
        </motion.div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-24">
        {/* Controls */}
        <div className="bg-white rounded-[32px] shadow-sm p-8 mb-12 border border-black/5">
          <div className="flex flex-wrap gap-4 mb-8 border-b border-black/5 pb-4">
            <button
              onClick={() => setMode('single')}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-sans transition-all",
                mode === 'single' ? "bg-[#5A5A40] text-white" : "hover:bg-black/5"
              )}
            >
              单年查询
            </button>
            <button
              onClick={() => setMode('range')}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-sans transition-all",
                mode === 'range' ? "bg-[#5A5A40] text-white" : "hover:bg-black/5"
              )}
            >
              范围查询
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-end gap-6">
            {mode === 'single' ? (
              <div className="flex-1 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-sans font-bold opacity-40 ml-1">
                  输入年份 (Year)
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                  <input
                    type="number"
                    value={searchYear}
                    onChange={(e) => setSearchYear(e.target.value)}
                    className="w-full bg-[#f9f9f7] border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#5A5A40]/20 transition-all font-sans"
                    placeholder="例如: 2024"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-sans font-bold opacity-40 ml-1">
                    起始年份
                  </label>
                  <input
                    type="number"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    className="w-full bg-[#f9f9f7] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#5A5A40]/20 transition-all font-sans"
                  />
                </div>
                <div className="flex items-center pb-4 opacity-20 hidden md:block">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-sans font-bold opacity-40 ml-1">
                    结束年份
                  </label>
                  <input
                    type="number"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    className="w-full bg-[#f9f9f7] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#5A5A40]/20 transition-all font-sans"
                  />
                </div>
              </>
            )}
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-[#5A5A40] text-white px-10 py-4 rounded-2xl font-sans hover:bg-[#4a4a34] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? "查询中..." : "立即查询"}
              {!loading && <Sparkles className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? (
              results.map((info, idx) => (
                <motion.div
                  key={info.year}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={cn(
                    "bg-white p-8 rounded-[32px] border border-black/5 relative overflow-hidden group",
                    info.isLeap ? "ring-2 ring-[#5A5A40]/10" : "opacity-60"
                  )}
                >
                  {info.isLeap && (
                    <div className="absolute top-0 right-0 bg-[#5A5A40] text-white text-[10px] px-4 py-1 rounded-bl-2xl font-sans uppercase tracking-widest">
                      Leap Year
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-4xl font-light mb-1">{info.year}</h3>
                      <p className="text-sm font-sans opacity-50 uppercase tracking-tighter">
                        {info.ganZhi}年 · 属{info.zodiac}
                      </p>
                    </div>
                    {info.isLeap && (
                      <div className="w-12 h-12 rounded-full bg-[#f5f5f0] flex items-center justify-center text-[#5A5A40] font-bold text-xl">
                        闰
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-black/5 pb-2">
                      <span className="text-xs font-sans opacity-40 uppercase tracking-widest">置闰情况</span>
                      <span className={cn("text-lg", info.isLeap ? "text-[#5A5A40] font-medium" : "text-black/40")}>
                        {info.isLeap ? `闰${info.leapMonthName}月` : "无置闰"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-sans opacity-40 uppercase tracking-widest">生肖</span>
                      <span className="text-lg">{info.zodiac}</span>
                    </div>
                  </div>

                  {/* Decorative element */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#5A5A40]/5 rounded-full blur-2xl group-hover:bg-[#5A5A40]/10 transition-all" />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center opacity-40">
                <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-xl font-light">未发现闰年数据</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Knowledge Section */}
        <section className="mt-24 bg-black/5 rounded-[40px] p-12">
          <div className="flex items-center gap-3 mb-8">
            <Info className="w-6 h-6 text-[#5A5A40]" />
            <h2 className="text-2xl font-light">关于农历置闰</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm leading-relaxed font-sans opacity-70">
            <div className="space-y-4">
              <p>
                农历（阴阳历）以月亮绕地球一周为一月，一年为12个月，约354天。而地球绕太阳一周为一年，约365天。两者相差约11天。
              </p>
              <p>
                为了协调这种差异，使农历月份与四季保持一致，中国古代历法采用了“十九年七闰”的方法，即在19个农历年中加入7个闰月。
              </p>
            </div>
            <div className="space-y-4">
              <p>
                闰月的确定遵循“无中气置闰”原则。二十四节气分为“节气”和“中气”，如果一个农历月份中没有“中气”，该月即为上一个月的闰月。
              </p>
              <p>
                这种置闰方式体现了中国古代天文学的精妙，确保了春节等传统节日始终落在冬末春初，与节气循环精准契合。
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-black/5 text-center text-[10px] font-sans uppercase tracking-[0.2em] opacity-30">
        &copy; {new Date().getFullYear()} Lunar Leap Year Explorer · Traditional Calendar Wisdom
      </footer>
    </div>
  );
}
