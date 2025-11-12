import type { CalendarEvent, EventCategory } from '../types';

// FIX: Use renamed CalendarEvent type.
export const eventsData: CalendarEvent[] = [
  // Farvardin
  { jalaliDate: '1403/01/01', title: 'آغاز نوروز (تعطیل)', categories: ['ملی', 'تعطیل رسمی'], isHoliday: true },
  { jalaliDate: '1403/01/02', title: 'عید نوروز (تعطیل)', categories: ['ملی', 'تعطیل رسمی'], isHoliday: true },
  { jalaliDate: '1403/01/03', title: 'عید نوروز (تعطیل)', categories: ['ملی', 'تعطیل رسمی'], isHoliday: true },
  { jalaliDate: '1403/01/04', title: 'عید نوروز (تعطیل)', categories: ['ملی', 'تعطیل رسمی'], isHoliday: true },
  { jalaliDate: '1403/01/12', title: 'روز جمهوری اسلامی ایران (تعطیل)', categories: ['ملی', 'تعطیل رسمی'], isHoliday: true },
  { jalaliDate: '1403/01/13', title: 'روز طبیعت (تعطیل)', categories: ['ملی', 'تعطیل رسمی'], isHoliday: true },
  { jalaliDate: '1403/01/23', title: 'شهادت حضرت علی (ع) (تعطیل)', categories: ['مذهبی', 'تعطیل رسمی'], isHoliday: true },
  { jalaliDate: '1403/01/22', title: 'عید سعید فطر (تعطیل)', categories: ['مذهبی', 'تعطیل رسمی'], isHoliday: true },
  { jalaliDate: '1403/01/23', title: 'تعطیلی به مناسبت عید سعید فطر', categories: ['مذهبی', 'تعطیل رسمی'], isHoliday: true },
  // Ordibehesht
  { jalaliDate: '1403/02/01', title: 'روز بزرگداشت سعدی', categories: ['ملی'], isHoliday: false },
  { jalaliDate: '1403/02/15', title: 'شهادت امام جعفر صادق (ع) (تعطیل)', categories: ['مذهبی', 'تعطیل رسمی'], isHoliday: true },
  { jalaliDate: '1403/02/25', title: 'روز بزرگداشت فردوسی', categories: ['ملی'], isHoliday: false },
  // Khordad
  { jalaliDate: '1403/03/14', title: 'رحلت حضرت امام خمینی (ره) (تعطیل)', categories: ['مذهبی', 'تعطیل رسمی'], isHoliday: true },
  { jalaliDate: '1403/03/15', title: 'قیام خونین ۱۵ خرداد (تعطیل)', categories: ['ملی', 'تعطیل رسمی'], isHoliday: true },
  { jalaliDate: '1403/03/28', title: 'عید سعید قربان (تعطیل)', categories: ['مذهبی', 'تعطیل رسمی'], isHoliday: true },
  // Tir
  { jalaliDate: '1403/04/05', title: 'عید سعید غدیر خم (تعطیل)', categories: ['مذهبی', 'تعطیل رسمی'], isHoliday: true },
  // Mordad
  { jalaliDate: '1403/05/25', title: 'تاسوعای حسینی (تعطیل)', categories: ['مذهبی', 'تعطیل رسمی'], isHoliday: true },
  { jalaliDate: '1403/05/26', title: 'عاشورای حسینی (تعطیل)', categories: ['مذهبی', 'تعطیل رسمی'], isHoliday: true },
  // Shahrivar
  { jalaliDate: '1403/06/04', title: 'اربعین حسینی (تعطیل)', categories: ['مذهبی', 'تعطیل رسمی'], isHoliday: true },
  { jalaliDate: '1403/06/12', title: 'رحلت رسول اکرم (ص) و شهادت امام حسن مجتبی (ع) (تعطیل)', categories: ['مذهبی', 'تعطیل رسمی'], isHoliday: true },
  { jalaliDate: '1403/06/14', title: 'شهادت امام رضا (ع) (تعطیل)', categories: ['مذهبی', 'تعطیل رسمی'], isHoliday: true },
  // Mehr
  { jalaliDate: '1403/07/20', title: 'روز بزرگداشت حافظ', categories: ['ملی'], isHoliday: false },
  // Aban
  // Azar
  { jalaliDate: '1403/09/30', title: 'شب یلدا', categories: ['ملی'], isHoliday: false },
  // Dey
  { jalaliDate: '1403/10/01', title: 'روز میلاد خورشید', categories: ['ملی'], isHoliday: false },
  // Bahman
  { jalaliDate: '1403/11/22', title: 'پیروزی انقلاب اسلامی ایران (تعطیل)', categories: ['ملی', 'تعطیل رسمی'], isHoliday: true },
  // Esfand
  { jalaliDate: '1403/12/29', title: 'روز ملی شدن صنعت نفت ایران (تعطیل)', categories: ['ملی', 'تعطیل رسمی'], isHoliday: true },
  // Global events for example
  { jalaliDate: '1403/02/12', title: 'روز جهانی کارگر', categories: ['جهانی'], isHoliday: false },
];