const marked = require('marked');

const validateHeadings = require('./validateHeadings');

describe('validateHeadings', () => {
  it('does not throw if the headings are well-formed', () => {
    const md = `
# H1

## H2 below H1

## Another h2 below h1

### h3 below h2

## A final h2 below h1
`.trim();
    const tokens = marked.lexer(md);
    expect(() => validateHeadings(tokens)).not.toThrow();
  });

  it('throws if the first token is not a H1', () => {
    const md1 = marked.lexer('## I should be h1');
    expect(() => validateHeadings(md1)).toThrow();

    const md2 = marked.lexer('I should be h1');
    expect(() => validateHeadings(md2)).toThrow();
  });

  it('throws if a heading level is skipped', () => {
    const md = `
# H1

## H2 below H1

#### Erroneous h4 below h2
`.trim();
    const tokens = marked.lexer(md);
    expect(() => validateHeadings(tokens)).toThrow(
      'h4 should not appear in a h2 section'
    );
  });

  it('throws if there are two h1s', () => {
    const md = `
# H1

# Erroneous h1
`.trim();
    const tokens = marked.lexer(md);
    expect(() => validateHeadings(tokens)).toThrow(
      'There should only be a single h1'
    );
  });
});
