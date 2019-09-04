const moment = require.requireActual('moment');

const timestamp = Date.parse('Thu Aug 29 2019 12:00:00')

module.exports = (...args) => {
  if (args.length) return moment(...args);
  return moment(timestamp);
};
