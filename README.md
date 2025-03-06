# JalaliMomentDateAdapter

یک **DateAdapter** برای **Angular Material** که از تقویم **جلالی (شمسی)** و **میلادی** پشتیبانی می‌کند.

## 🚀 ویژگی‌ها:
✅ پشتیبانی از **Jalali Moment.js**  
✅ قابلیت **تبدیل تاریخ بین جلالی و میلادی**  
✅ پشتیبانی از **تغییر زبان (locale)**  
✅ **سازگار با Angular Material DatePicker**  
✅ **بهینه‌شده و خوانا**  

---

## 📦 نصب

ابتدا **Moment.js** و **Jalali-Moment** را نصب کنید:
```sh
npm install moment jalali-moment --save
```

سپس **Material Moment Adapter** را نصب کنید:
```sh
npm install @angular/material-moment-adapter --save
```

---

## 🛠️ نحوه استفاده

۱. این **Adapter** را در `app.module.ts` اضافه کنید:

```typescript
import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { JalaliMomentDateAdapter } from './jalali-moment-date-adapter';

@NgModule({
  imports: [MatDatepickerModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fa' },
    { provide: DateAdapter, useClass: JalaliMomentDateAdapter }
  ]
})
export class AppModule {}
```

---

## 📌 مثال استفاده در **HTML**

```html
<mat-form-field appearance="fill">
  <mat-label>انتخاب تاریخ</mat-label>
  <input matInput [matDatepicker]="picker">
  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
  <mat-datepicker #picker></mat-datepicker>
</mat-form-field>
```



