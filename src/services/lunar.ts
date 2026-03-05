import { Lunar, Solar, LunarYear } from 'lunar-javascript';

export interface LeapYearInfo {
  year: number;
  isLeap: boolean;
  leapMonth: number; // 0 if not leap
  leapMonthName: string;
  ganZhi: string;
  zodiac: string;
}

export const getLeapYearInfo = (year: number): LeapYearInfo => {
  // We use a date in the middle of the solar year to get the corresponding lunar year info
  const midYearSolar = Solar.fromYmd(year, 6, 1);
  const midYearLunar = Lunar.fromSolar(midYearSolar);
  const lunarYearNum = midYearLunar.getYear();
  
  const lunarYear = LunarYear.fromYear(lunarYearNum);
  const leapMonth = lunarYear.getLeapMonth();
  
  const monthNames = ["", "正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];

  return {
    year: lunarYearNum,
    isLeap: leapMonth > 0,
    leapMonth: leapMonth,
    leapMonthName: leapMonth > 0 ? monthNames[leapMonth] : "",
    ganZhi: midYearLunar.getYearInGanZhi(),
    zodiac: midYearLunar.getYearShengXiao(),
  };
};

export const getLeapYearsInRange = (start: number, end: number): LeapYearInfo[] => {
  const results: LeapYearInfo[] = [];
  for (let y = start; y <= end; y++) {
    const info = getLeapYearInfo(y);
    if (info.isLeap) {
      results.push(info);
    }
  }
  return results;
};
