const {
  getHeadings,
  partitionSection,
  parseMarkdown,
} = require('./parseMarkdown');

describe('getHeadings', () => {
  it('finds and splits markdown by h2 headings', () => {
    const md = `
# H1

## H2

Stuff

## Another h2

- More
- stuff
    `.trim();
    const { headings, links } = getHeadings(md);
    expect(headings).toEqual([
      {
        name: 'H2',
        values: [{ type: 'paragraph', text: 'Stuff' }, { type: 'space' }],
      },
      {
        name: 'Another h2',
        values: [
          {
            type: 'list_start',
            ordered: false,
            start: '',
            loose: false,
          },
          {
            type: 'list_item_start',
            task: false,
            loose: false,
          },
          { type: 'text', text: 'More' },
          { type: 'list_item_end' },
          {
            type: 'list_item_start',
            task: false,
            loose: false,
          },
          { type: 'text', text: 'stuff' },
          { type: 'list_item_end' },
          { type: 'list_end' },
        ],
      },
    ]);
    expect(links).toEqual({});
  });

  it('returns an empty array when no h2 headings', () => {
    const md = '# No h2s here';
    expect(getHeadings(md)).toEqual({
      headings: [],
      quadrant: 'No h2s here',
      links: {},
    });
  });
});

describe('partitionSection', () => {
  it('partitions out the initial list items and the remaining markdown', () => {
    const md = `
## Stuff

This line should be ignored.

- More
- stuff

Everything after this is kept...

- just
  - pure
  - markdown
    `.trim();
    const tokens = getHeadings(md).headings[0].values;
    const { frontMatter, description, links } = partitionSection(tokens, {});
    expect(frontMatter).toEqual(['More', 'stuff']);
    expect(description).toEqual([
      { type: 'paragraph', text: 'Everything after this is kept...' },
      { type: 'space' },
      { type: 'list_start', ordered: false, start: '', loose: false },
      {
        type: 'list_item_start',
        task: false,
        loose: false,
      },
      { type: 'text', text: 'just' },
      { type: 'list_start', ordered: false, start: '', loose: false },
      {
        type: 'list_item_start',
        task: false,
        loose: false,
      },
      { type: 'text', text: 'pure' },
      { type: 'list_item_end' },
      {
        type: 'list_item_start',
        loose: false,
        task: false,
      },
      { type: 'text', text: 'markdown' },
      { type: 'list_item_end' },
      { type: 'list_end' },
      { type: 'list_item_end' },
      { type: 'list_end' },
    ]);
    expect(links).toEqual({});
  });
});

describe('parseMarkdown', () => {
  it('parses markdown to JSON', () => {
    const md = `
# H1

## H2

- Item: One
- Item Two without a colon

Stuff with a [link][link]

[link]: http://link

## Another h2

- Status: Cool
- Really: Yep

Eh
  `.trim();
    expect(parseMarkdown(md)).toEqual([
      {
        name: 'H2',
        item: 'One',
        description: '<p>Stuff with a <a href="http://link">link</a></p>',
        quadrant: 'H1',
      },
      {
        name: 'Another h2',
        status: 'Cool',
        really: 'Yep',
        description: '<p>Eh</p>',
        quadrant: 'H1',
      },
    ]);
  });
});
