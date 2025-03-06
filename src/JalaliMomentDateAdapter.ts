import { Inject, Optional } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'jalali-moment';
import { MatMomentDateAdapterOptions, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

/**
 * Creates an array and fills it with values using a provided function.
 * @param length - The length of the array to create.
 * @param valueFunction - The function to generate values for the array.
 * @returns The generated array with values.
 */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

export class JalaliMomentDateAdapter extends DateAdapter<moment.Moment> {
  private _localeData!: {
    firstDayOfWeek: number;
    longMonths: string[];
    shortMonths: string[];
    dates: string[];
    longDaysOfWeek: string[];
    shortDaysOfWeek: string[];
    narrowDaysOfWeek: string[];
  };

  constructor(
    @Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string,
    @Optional() @Inject(MAT_MOMENT_DATE_ADAPTER_OPTIONS) private _options?: MatMomentDateAdapterOptions
  ) {
    super();
    this.setLocale(dateLocale || moment.locale('fa'));
  }

  /**
   * Set the locale for the date adapter.
   * @param locale - The locale to set.
   */
  override setLocale(locale: string): void {
    super.setLocale(locale);

    const momentLocaleData = moment.localeData(locale);
    if (locale === 'fa') {
      this._localeData = {
        firstDayOfWeek: momentLocaleData.firstDayOfWeek(),
        longMonths: momentLocaleData.jMonths(),
        shortMonths: momentLocaleData.jMonthsShort(),
        dates: range(31, i =>
          this.createPersianDateFrom3Numbers(1397, 0, i + 1).format('D')
        ),
        longDaysOfWeek: momentLocaleData.weekdays(),
        shortDaysOfWeek: momentLocaleData.weekdaysShort(),
        narrowDaysOfWeek: momentLocaleData.weekdaysMin()
      };
    } else {
      this._localeData = {
        firstDayOfWeek: momentLocaleData.firstDayOfWeek(),
        longMonths: momentLocaleData.months(),
        shortMonths: momentLocaleData.monthsShort(),
        dates: range(31, i => this.createDate(2017, 0, i + 1).format('D')),
        longDaysOfWeek: momentLocaleData.weekdays(),
        shortDaysOfWeek: momentLocaleData.weekdaysShort(),
        narrowDaysOfWeek: momentLocaleData.weekdaysMin()
      };
    }
  }

  getYear(date: moment.Moment): number {
    return this.locale === 'fa' ? this.clone(date).jYear() : this.clone(date).year();
  }

  getMonth(date: moment.Moment): number {
    return this.locale === 'fa' ? this.clone(date).jMonth() : this.clone(date).month();
  }

  getDate(date: moment.Moment): number {
    return this.locale === 'fa' ? this.clone(date).jDate() : this.clone(date).date();
  }

  getDayOfWeek(date: moment.Moment): number {
    return this.clone(date).day();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return style === 'long' ? this._localeData.longMonths : this._localeData.shortMonths;
  }

  getDateNames(): string[] {
    return this._localeData.dates;
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (style === 'long') {
      return this._localeData.longDaysOfWeek;
    }
    if (style === 'short') {
      return this._localeData.shortDaysOfWeek;
    }
    return this._localeData.narrowDaysOfWeek;
  }

  getYearName(date: moment.Moment): string {
    return this.locale === 'fa' ? this.clone(date).jYear().toString() : this.clone(date).year().toString();
  }

  getFirstDayOfWeek(): number {
    return this._localeData.firstDayOfWeek;
  }

  getNumDaysInMonth(date: moment.Moment): number {
    return this.locale === 'fa' ? this.clone(date).jDaysInMonth() : this.clone(date).daysInMonth();
  }

  clone(date: moment.Moment): moment.Moment {
    return date.clone().locale(this.locale);
  }

  private createPersianDateFrom3Numbers(year: number, month: number, date: number): moment.Moment {
    let result: moment.Moment;
    if (this._options && this._options.useUtc) {
      result = moment().utc();
    } else {
      result = moment();
    }

    return result
      .jYear(year)
      .jMonth(month)
      .jDate(date)
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .locale('fa');
  }

  createDate(year: number, month: number, date: number): moment.Moment {
    if (month < 0 || month > 11) {
      throw new Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }

    if (date < 1) {
      throw new Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    let result;
    if (this.locale === 'fa') {
      result = this.createPersianDateFrom3Numbers(year, month, date);
    } else {
      result = this._createMoment({ year, month, date }).locale(this.locale);
    }

    if (!result.isValid()) {
      throw new Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result;
  }

  today(): moment.Moment {
    return this._createMoment().locale(this.locale);
  }

  parse(value: any, parseFormat: string | string[]): moment.Moment | null {
    if (value && typeof value === 'string') {
      return this._createMoment(value, parseFormat, this.locale);
    }
    return value ? this._createMoment(value).locale(this.locale) : null;
  }

  format(date: moment.Moment, displayFormat: string): string {
    date = this.clone(date);
    if (!this.isValid(date)) {
      throw new Error('JalaliMomentDateAdapter: Cannot format invalid date.');
    }
    return date.format(displayFormat);
  }

  addCalendarYears(date: moment.Moment, years: number): moment.Moment {
    return this.locale === 'fa' ? this.clone(date).add(years, 'jYear') : this.clone(date).add(years, 'years');
  }

  addCalendarMonths(date: moment.Moment, months: number): moment.Moment {
    return this.locale === 'fa' ? this.clone(date).add(months, 'jmonth') : this.clone(date).add(months, 'month');
  }

  addCalendarDays(date: moment.Moment, days: number): moment.Moment {
    return this.locale === 'fa' ? this.clone(date).add(days, 'jDay') : this.clone(date).add(days, 'day');
  }

  toIso8601(date: moment.Moment): string {
    return this.clone(date).format();
  }

  isDateInstance(obj: any): boolean {
    return moment.isMoment(obj);
  }

  isValid(date: moment.Moment): boolean {
    return this.clone(date).isValid();
  }

  invalid(): moment.Moment {
    return moment.invalid();
  }

  override deserialize(value: any): moment.Moment | null {
    let date;
    if (value instanceof Date) {
      date = this._createMoment(value);
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      if (this.locale === 'fa') {
        date = moment(value).locale('fa');
      } else {
        date = this._createMoment(value).locale(this.locale);
      }
    }
    if (date && this.isValid(date)) {
      return date;
    }
    return super.deserialize(value);
  }

  private _createMoment(
    date: moment.MomentInput,
    format?: moment.MomentFormatSpecification,
    locale?: string
  ): moment.Moment {
    const { strict, useUtc }: MatMomentDateAdapterOptions = this._options || {};
    return useUtc ? moment.utc(date, format, locale, strict) : moment(date, format, locale, strict);
  }
}
