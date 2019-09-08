/**
 * @fileoverview Tools for parsing and manipulating date-specific entries in
 * radar blips, powered by Moment.js.
 * @author David Garner
 */

const moment = require('moment');
require('./typedef');

/**
 * Given a date string, a threshold, and some optional options, returns a
 * boolean of whether the date is new or not.
 *
 * @param {string} dateStr The date string
 * @param {IsNewOptions=} opts Configuration options
 * @returns {boolean} True if the date is considered "new".
 */
function getIsNew(
  dateStr,
  { thresholdInMonths = 3, format = 'MMMM YYYY', locale = 'en' } = {}
) {
  const date = moment(dateStr, format, locale).startOf('month');
  const cutoff = moment()
    .startOf('month')
    .subtract(thresholdInMonths, 'months');
  return date >= cutoff;
}

module.exports = getIsNew;
