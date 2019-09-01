const moment = require('moment');

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
