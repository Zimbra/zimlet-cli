/** This file is an auto-generated shim, aliased in for "moment" in the webpack config.
*  When components import 'moment', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../';
const wrap = warnOnMissingExport.bind(null, global.shims['moment'], 'moment');

export const momentProperties = wrap('momentProperties');
export const suppressDeprecationWarnings = wrap('suppressDeprecationWarnings');
export const deprecationHandler = wrap('deprecationHandler');
export const parseTwoDigitYear = wrap('parseTwoDigitYear');
export const createFromInputFallback = wrap('createFromInputFallback');
export const ISO_8601 = wrap('ISO_8601');
export const RFC_2822 = wrap('RFC_2822');
export const updateOffset = wrap('updateOffset');
export const defaultFormat = wrap('defaultFormat');
export const defaultFormatUtc = wrap('defaultFormatUtc');
export const lang = wrap('lang');
export const langData = wrap('langData');
export const version = wrap('version');
export const fn = wrap('fn');
export const min = wrap('min');
export const max = wrap('max');
export const now = wrap('now');
export const utc = wrap('utc');
export const unix = wrap('unix');
export const months = wrap('months');
export const isDate = wrap('isDate');
export const locale = wrap('locale');
export const invalid = wrap('invalid');
export const duration = wrap('duration');
export const isMoment = wrap('isMoment');
export const weekdays = wrap('weekdays');
export const parseZone = wrap('parseZone');
export const localeData = wrap('localeData');
export const isDuration = wrap('isDuration');
export const monthsShort = wrap('monthsShort');
export const weekdaysMin = wrap('weekdaysMin');
export const defineLocale = wrap('defineLocale');
export const updateLocale = wrap('updateLocale');
export const locales = wrap('locales');
export const weekdaysShort = wrap('weekdaysShort');
export const normalizeUnits = wrap('normalizeUnits');
export const relativeTimeRounding = wrap('relativeTimeRounding');
export const relativeTimeThreshold = wrap('relativeTimeThreshold');
export const calendarFormat = wrap('calendarFormat');
export const HTML5_FMT = wrap('HTML5_FMT');

export default global.shims['moment'];
