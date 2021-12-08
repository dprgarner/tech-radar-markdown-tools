const parseMarkdownToBlips = require('./parseMarkdownToBlips');

describe('parseMarkdownToBlips', () => {
  it('throws if the first token is not a H1', () => {
    expect(() => parseMarkdownToBlips('## I should be h1')).toThrow();
    expect(() => parseMarkdownToBlips('I should be h1')).toThrow();
  });

  it('maps markdown to blips', () => {
    const md = `
# Languages and Frameworks

## Placeholder

- Status: Adopt
- Modified: August 2018

This is a placeholder blip. Replace this with a list of technologies and tools, each under H2 headings, with the metadata of the tool listed under bullet points before the description. More information on the available format is available in the [docs][docs].

[docs]: https://github.com/dprgarner/tech-radar-markdown-tools/blob/master/README.md

## Another Placeholder

- Status: Avoid
    `.trim();

    expect(parseMarkdownToBlips(md)).toEqual([
      {
        name: 'Placeholder',
        ring: 'Adopt',
        isNew: true,
        quadrant: 'Languages and Frameworks',
        description:
          '<p>This is a placeholder blip. Replace this with a list of technologies and tools, each under H2 headings, with the metadata of the tool listed under bullet points before the description. More information on the available format is available in the <a href="https://github.com/dprgarner/tech-radar-markdown-tools/blob/master/README.md">docs</a>.</p>',
      },
      {
        name: 'Another Placeholder',
        ring: 'Avoid',
        isNew: false,
        quadrant: 'Languages and Frameworks',
        description: '',
      },
    ]);
  });

  it('uses date-parsing options', () => {
    const md = `
# en français

## espace réservé

- Status: Bon
- Modified: août 2018

La lune la fromage
    `.trim();

    expect(parseMarkdownToBlips(md, { locale: 'fr' })).toEqual([
      {
        name: 'espace réservé',
        ring: 'Bon',
        isNew: true,
        quadrant: 'en français',
        description: '<p>La lune la fromage</p>',
      },
    ]);
  });

  // see https://naereen.github.io/badges/
  it('support markdown github macro', () => {
    const md = `
# Languages and Frameworks

## Placeholder

- Status: Adopt
- Modified: August 2018

[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)
    `.trim();

    expect(parseMarkdownToBlips(md)).toEqual([
      {
        name: 'Placeholder',
        quadrant: 'Languages and Frameworks',
        ring: 'Adopt',
        isNew: true,
        description:
          '<p><a href="https://github.com/Naereen/StrapDown.js/blob/master/LICENSE"><img src="https://img.shields.io/github/license/Naereen/StrapDown.js.svg" alt="GitHub license"></a></p>',
      },
    ]);
  });
});
