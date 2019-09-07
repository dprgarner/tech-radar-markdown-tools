const marked = require('marked');

const mapToSectionsTree = require('./mapToSectionsTree');

const testMd = md => mapToSectionsTree(marked.lexer(md.trim()));

describe('mapToSectionsTree', () => {
  it('creates a leaf node', () => {
    const md = `
# H1

Nothing else here.
    `;
    expect(testMd(md)).toEqual({
      name: 'H1',
      tokens: [{ type: 'paragraph', text: 'Nothing else here.' }],
    });
  });

  it('creates a leaf node for a nested header', () => {
    const md = `
## H2

Nothing else here.
    `;
    expect(testMd(md)).toEqual({
      name: 'H2',
      tokens: [{ type: 'paragraph', text: 'Nothing else here.' }],
    });
  });

  it('recursively creates a nested tree', () => {
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
    expect(testMd(md)).toEqual({
      name: 'H1',
      tokens: [],
      sections: [
        {
          name: 'H2',
          tokens: [
            { type: 'list_start', ordered: false, start: '', loose: false },
            {
              type: 'list_item_start',
              task: false,
              checked: undefined,
              loose: false,
            },
            { type: 'text', text: 'Item: One' },
            { type: 'list_item_end' },
            {
              type: 'list_item_start',
              task: false,
              checked: undefined,
              loose: false,
            },
            { type: 'text', text: 'Item Two without a colon' },
            { type: 'space' },
            { type: 'list_item_end' },
            { type: 'list_end' },
            { type: 'paragraph', text: 'Stuff with a [link][link]' },
            { type: 'space' },
          ],
        },
        {
          name: 'Another h2',
          tokens: [
            { type: 'list_start', ordered: false, start: '', loose: false },
            {
              type: 'list_item_start',
              task: false,
              checked: undefined,
              loose: false,
            },
            { type: 'text', text: 'Status: Cool' },
            { type: 'list_item_end' },
            {
              type: 'list_item_start',
              task: false,
              checked: undefined,
              loose: false,
            },
            { type: 'text', text: 'Really: Yep' },
            { type: 'space' },
            { type: 'list_item_end' },
            { type: 'list_end' },
            { type: 'paragraph', text: 'Eh' },
          ],
        },
      ],
    });
  });
});

describe('mapToSectionsTree validating', () => {
  it('does not throw if the headings are well-formed', () => {
    const md = `
# H1

## H2 below H1

## Another h2 below h1

### h3 below h2

## A final h2 below h1
    `.trim();
    expect(() => testMd(md)).not.toThrow();
  });

  it('throws if the first token is not a header', () => {
    expect(() => testMd('I should be a header')).toThrow();
    expect(() => testMd('## A h2 is fine')).not.toThrow();
  });

  it('throws if a heading level is skipped', () => {
    const md = `
# H1

## H2 below H1

#### Erroneous h4 below h2
    `.trim();
    expect(() => testMd(md)).toThrow('h4 should not appear in a h2 section');
  });

  it('throws if there are two h1s', () => {
    const md = `
# H1

# Erroneous h1
`.trim();
    expect(() => testMd(md)).toThrow(
      'There should only be a single h1 heading'
    );
  });

  it('throws if a heading above the first heading is present', () => {
    const md = `
### I am a h3

## I should not be here
    `.trim();
    expect(() => testMd(md)).toThrow(
      'h2 should not appear anywhere in a h3 node'
    );
  });

  it('throws if a h1 appears below a h2', () => {
    const md = `
## I am a h2

# I should not be here
    `.trim();
    expect(() => testMd(md)).toThrow(
      'h1 should not appear anywhere in a h2 node'
    );
  });
});
