const { getIsNew, mapModifiedToIsNew } = require('./dates');

describe('getIsNew', () => {
  let dateNow;

  beforeEach(() => {
    dateNow = Date.now;
    Date.now = jest.fn(() => new Date('2019-08-05T01:00:00+01:00'));
  });

  beforeEach(() => {
    Date.now = dateNow;
  });

  it('calculates if a date is new', () => {
    expect(getIsNew('August 2019', 3)).toBe(true);
    expect(getIsNew('July 2019', 3)).toBe(true);
    expect(getIsNew('June 2019', 3)).toBe(true);
    expect(getIsNew('May 2019', 3)).toBe(true);
    expect(getIsNew('April 2019', 3)).toBe(false);
    expect(getIsNew('April 2019', 4)).toBe(true);
  });

  it('allows custom date formats', () => {
    const opts = { format: 'YYYY-MM-DD' };
    expect(getIsNew('2019-04-01', 3, opts)).toBe(false);
    expect(getIsNew('2019-04-01', 4, opts)).toBe(true);
  });

  it('allows locale-specific formats', () => {
    const opts = { locale: 'fr' };
    expect(getIsNew('avril 2019', 3, opts)).toBe(false);
    expect(getIsNew('avril 2019', 4, opts)).toBe(true);
  });
});

describe('mapModifiedToIsNew', () => {
  it('replaces modified keys with dates', () => {
    expect(
      mapModifiedToIsNew(
        [
          {
            name: 'H2',
            modified: 'May 2019',
            description: '<p>Stuff with a <a href="http://link">link</a></p>',
            quadrant: 'H1',
          },
          {
            name: 'Another h2',
            status: 'Cool',
            modified: 'April 2019',
            description: '<p>Eh</p>',
            quadrant: 'H1',
          },
        ],
        3
      )
    ).toEqual([
      {
        name: 'H2',
        isNew: true,
        description: '<p>Stuff with a <a href="http://link">link</a></p>',
        quadrant: 'H1',
      },
      {
        name: 'Another h2',
        status: 'Cool',
        isNew: false,
        description: '<p>Eh</p>',
        quadrant: 'H1',
      },
    ]);
  });
});
