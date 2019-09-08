const getIsNew = require('./getIsNew');

describe('getIsNew', () => {
  it('calculates if a date is new', () => {
    expect(getIsNew('August 2018', { thresholdInMonths: 3 })).toBe(true);
    expect(getIsNew('July 2018', { thresholdInMonths: 3 })).toBe(true);
    expect(getIsNew('June 2018', { thresholdInMonths: 3 })).toBe(true);
    expect(getIsNew('May 2018', { thresholdInMonths: 3 })).toBe(true);
    expect(getIsNew('April 2018', { thresholdInMonths: 3 })).toBe(false);
    expect(getIsNew('April 2018', { thresholdInMonths: 4 })).toBe(true);
  });

  it('allows custom date formats', () => {
    const format = 'YYYY-MM-DD';
    expect(getIsNew('2018-04-01', { format, thresholdInMonths: 3 })).toBe(
      false
    );
    expect(getIsNew('2018-04-01', { format, thresholdInMonths: 4 })).toBe(true);
  });

  it('allows locale-specific formats', () => {
    const locale = 'fr';
    expect(getIsNew('avril 2018', { locale, thresholdInMonths: 3 })).toBe(
      false
    );
    expect(getIsNew('avril 2018', { locale, thresholdInMonths: 4 })).toBe(true);
  });
});
