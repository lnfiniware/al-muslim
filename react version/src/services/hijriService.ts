// Hijri Calendar Service
// Converts Gregorian dates to Hijri calendar dates

export interface HijriDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  monthNameArabic: string;
}

const HIJRI_MONTHS_EN = [
  'Muharram',
  'Safar',
  'Rabi al-awwal',
  'Rabi al-thani',
  'Jumada al-awwal',
  'Jumada al-thani',
  'Rajab',
  'Sha\'ban',
  'Ramadan',
  'Shawwal',
  'Dhu al-Qi\'dah',
  'Dhu al-Hijjah',
];

const HIJRI_MONTHS_AR = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الثانية',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

export const hijriService = {
  /**
   * Convert Gregorian date to Hijri date
   * Based on the Kuwaiti algorithm
   */
  gregorianToHijri(date: Date = new Date()): HijriDate {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let N = day + Math.floor(30.6001 * (month + 1)) - Math.floor(30.6001 * 1) + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) + Math.floor((year - 1) / 400) - 79;

    let Q = Math.floor(N / 10631);
    let R = N % 10631;

    let a = Math.floor(R / 354);
    let w = R % 354;

    let Q2 = Math.floor(w / 30);

    let hijriYear = 30 * Q + 11 * a + Q2 + 1;
    let hijriMonth = Math.floor(((w % 30) + 15) / 30.6001) + 1;
    let hijriDay = Math.floor(((w % 30) + 15) % 30.6001) + 1;

    if (hijriMonth > 12) {
      hijriMonth = 1;
      hijriYear++;
    }

    return {
      year: hijriYear,
      month: hijriMonth,
      day: hijriDay,
      monthName: HIJRI_MONTHS_EN[hijriMonth - 1],
      monthNameArabic: HIJRI_MONTHS_AR[hijriMonth - 1],
    };
  },

  /**
   * Get formatted Hijri date string
   */
  getFormattedHijriDate(date?: Date, arabic: boolean = false): string {
    const hijri = this.gregorianToHijri(date);
    const monthName = arabic ? hijri.monthNameArabic : hijri.monthName;
    return `${hijri.day} ${monthName} ${hijri.year}`;
  },

  /**
   * Get current Hijri date
   */
  getCurrentHijriDate(): HijriDate {
    return this.gregorianToHijri(new Date());
  },

  /**
   * Check if current month is Ramadan
   */
  isRamadan(): boolean {
    const hijri = this.getCurrentHijriDate();
    return hijri.month === 9; // Ramadan is the 9th month
  },

  /**
   * Get days remaining in Ramadan
   */
  getDaysInRamadan(): number {
    const hijri = this.getCurrentHijriDate();
    if (hijri.month === 9) {
      return 30 - hijri.day;
    }
    return -1; // Not in Ramadan
  },
};
