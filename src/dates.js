/**
 * @fileoverview Tools for parsing and manipulating date-specific entries in
 * radar blips, powered by Moment.js.
 * @author David Garner
 */

const moment = require('moment');

/**
 * @typedef IsNewOptions
 * @type {Object}
 * @property {string=} format The format to expect the string, in Moment date
 * format syntax. See https://momentjs.com/docs/#/parsing/string-format/ for
 * full list of format options available. Defaults to `"MMMM YYYY"`.
 * @property {string=} locale The Moment locale in which to parse the dates.
 * Defaults to `"en"`.
 */

/**
 * Given a date string, a threshold, and some optional options, returns a
 * boolean of whether the date is new or not.
 *
 * @param {string} dateStr The date string
 * @param {Number} thresholdInMonths After this time in months, the blip is no
 * longer considered new
 * @param {IsNewOptions=} opts Configuration options
 * @returns {boolean} True if the date is considered "new".
 */
function getIsNew(
  dateStr,
  thresholdInMonths = 3,
  { format = 'MMMM YYYY', locale = 'en' } = {}
) {
  const date = moment(dateStr, format, locale).startOf('month');
  const cutoff = moment()
    .startOf('month')
    .subtract(thresholdInMonths, 'months');
  return date >= cutoff;
}

function mapModifiedToIsNew(blips, ...args) {
  return blips.map(({ modified, ...blip }) => ({
    ...blip,
    isNew: getIsNew(modified, ...args),
  }));
}

exports.getIsNew = getIsNew;
exports.mapModifiedToIsNew = mapModifiedToIsNew;
