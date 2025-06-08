// utils/dateTimeUtils.js

const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

class DateTimeUtils {
  static now() {
    return new Date();
  }

  static format(date, formatStr) {
    return dayjs(date).format(formatStr);
  }

  static parse(dateStr, formatStr) {
    return dayjs(dateStr, formatStr).toDate();
  }

  static addDays(date, days) {
    return dayjs(date).add(days, 'day').toDate();
  }

  static subtractDays(date, days) {
    return dayjs(date).subtract(days, 'day').toDate();
  }

  static differenceInDays(date1, date2) {
    return dayjs(date1).diff(dayjs(date2), 'day');
  }

  static isBefore(date1, date2) {
    return dayjs(date1).isBefore(dayjs(date2));
  }

  static isAfter(date1, date2) {
    return dayjs(date1).isAfter(dayjs(date2));
  }

  static startOfDay(date) {
    return dayjs(date).startOf('day').toDate();
  }

  static endOfDay(date) {
    return dayjs(date).endOf('day').toDate();
  }
}

module.exports = DateTimeUtils;
