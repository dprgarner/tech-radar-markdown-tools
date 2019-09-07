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
