const parseMarkdown = require('./parseMarkdown');

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
    expect(parseMarkdown(md)).toEqual({
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
    expect(parseMarkdown(md)).toEqual({
      name: 'Stuff',
      metadata: {},
      content:
        '<p>Everything after this is kept...</p>\n<ul>\n<li>just<ul>\n<li>pure</li>\n<li>markdown</li>\n</ul>\n</li>\n</ul>',
    });
  });

  it('returns an empty object when no h2 headings', () => {
    const md = '# No h2s here';
    expect(parseMarkdown(md)).toEqual({
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
    expect(parseMarkdown(md)).toEqual({
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

  it('throws if the first token is not a H1', () => {
    expect(() => parseMarkdown('## I should be h1')).toThrow();
    expect(() => parseMarkdown('I should be h1')).toThrow();
  });
});
