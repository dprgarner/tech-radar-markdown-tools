const marked = require('marked');

const createTokensTree = require('./createTokensTree');
const mapToMetadataTree = require('./mapToMetadataTree');

describe('mapToMetadataTree', () => {
  it('maps a sections tree to a metadata tree', () => {
    const sectionsTree = {
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
    };
    const links = {
      link: {
        href: 'http://link',
        title: undefined,
      },
    };

    expect(mapToMetadataTree(links, sectionsTree)).toEqual({
      name: 'H1',
      metadata: {},
      content: '',
      sections: [
        {
          name: 'H2',
          metadata: { item: 'One' },
          content: '<p>Stuff with a <a href="http://link">link</a></p>',
        },
        {
          name: 'Another h2',
          metadata: { status: 'Cool', really: 'Yep' },
          content: '<p>Eh</p>',
        },
      ],
    });
  });
});

describe('mapToMetadataTree from markdown', () => {
  const testMd = mdString => {
    const tokens = marked.lexer(mdString);
    return mapToMetadataTree(tokens.links, createTokensTree(tokens));
  };

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
    expect(testMd(md)).toEqual({
      name: 'H1',
      metadata: {},
      content: '',
      sections: [
        {
          name: 'H2',
          metadata: { item: 'One' },
          content: '<p>Stuff with a <a href="http://link">link</a></p>',
        },
        {
          name: 'Another h2',
          metadata: { status: 'Cool', really: 'Yep' },
          content: '<p>Eh</p>',
        },
      ],
    });
  });

  it('ignores text which does not fit the format', () => {
    const md = `
# Stuff

This line should be ignored.

- More
- stuff

Everything after this is kept...

- just
  - pure
  - markdown
    `.trim();
    expect(testMd(md)).toEqual({
      name: 'Stuff',
      metadata: {},
      content:
        '<p>Everything after this is kept...</p>\n<ul>\n<li>just<ul>\n<li>pure</li>\n<li>markdown</li>\n</ul>\n</li>\n</ul>',
    });
  });

  it('returns an empty object when no h2 headings', () => {
    const md = '# No h2s here';
    expect(testMd(md)).toEqual({
      name: 'No h2s here',
      metadata: {},
      content: '',
    });
  });

  it('handles arbitrary levels', () => {
    const md = `
# H1

## H2

- Item: in h2

### H3

- Status: Cool
- Really: Yep

Eh
  `.trim();
    expect(testMd(md)).toEqual({
      name: 'H1',
      metadata: {},
      content: '',
      sections: [
        {
          name: 'H2',
          metadata: { item: 'in h2' },
          content: '',
          sections: [
            {
              name: 'H3',
              metadata: {
                status: 'Cool',
                really: 'Yep',
              },
              content: '<p>Eh</p>',
            },
          ],
        },
      ],
    });
  });
});
