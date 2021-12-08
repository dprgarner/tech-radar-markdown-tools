const marked = require('marked');

const createTokensTree = require('./createTokensTree');

const testMd = md => createTokensTree(marked.lexer(md.trim()));

describe('createTokensTree', () => {
  it('creates a leaf node', () => {
    const md = `
# H1

Nothing else here.
    `;
    expect(testMd(md)).toEqual(
      expect.objectContaining({
        name: 'H1',
        tokens: [
          expect.objectContaining({
            type: 'paragraph',
            text: 'Nothing else here.',
          }),
        ],
      })
    );
  });

  it('creates a leaf node for a nested header', () => {
    const md = `
## H2

Nothing else here.
    `;
    expect(testMd(md)).toEqual(
      expect.objectContaining({
        name: 'H2',
        tokens: [
          expect.objectContaining({
            type: 'paragraph',
            text: 'Nothing else here.',
          }),
        ],
      })
    );
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
    expect(testMd(md)).toEqual(
      expect.objectContaining({
        name: 'H1',
        sections: [
          expect.objectContaining({
            name: 'H2',
            tokens: [
              expect.objectContaining({
                type: 'list',
                items: [
                  expect.objectContaining({
                    type: 'list_item',
                    text: 'Item: One',
                  }),
                  expect.objectContaining({
                    type: 'list_item',
                    text: 'Item Two without a colon',
                  }),
                ],
              }),
              expect.objectContaining({ type: 'space' }),
              expect.objectContaining({
                type: 'paragraph',
                text: 'Stuff with a [link][link]',
                tokens: [
                  expect.objectContaining({
                    type: 'text',
                    text: 'Stuff with a ',
                  }),
                  expect.objectContaining({
                    type: 'link',
                    text: 'link',
                    href: 'http://link',
                  }),
                ],
              }),
              expect.objectContaining({ type: 'space' }),
            ],
          }),
          expect.objectContaining({
            name: 'Another h2',
            tokens: [
              expect.objectContaining({
                type: 'list',
                items: [
                  expect.objectContaining({
                    type: 'list_item',
                    text: 'Status: Cool',
                  }),
                  expect.objectContaining({
                    type: 'list_item',
                    text: 'Really: Yep',
                  }),
                ],
              }),
              expect.objectContaining({ type: 'space' }),
              expect.objectContaining({
                type: 'paragraph',
                text: 'Eh',
              }),
            ],
          }),
        ],
      })
    );
  });
});

describe('createTokensTree validating', () => {
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
