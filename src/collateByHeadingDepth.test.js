const collateByHeadingDepth = require('./collateByHeadingDepth');
const marked = require('marked');

describe('collateByHeadingDepth', () => {
  it('splits h1s', () => {
    const md = `
# First heading

Content under first heading

## X

yyy

### Z
hhh

# Second heading

Content under second heading

# Third heading

Content under third heading
    `.trim();
    const tokens = marked.lexer(md);

    expect(collateByHeadingDepth(1, tokens)).toEqual([
      [
        { type: 'heading', depth: 1, text: 'First heading' },
        { type: 'paragraph', text: 'Content under first heading' },
        { type: 'space' },
        { type: 'heading', depth: 2, text: 'X' },
        { type: 'paragraph', text: 'yyy' },
        { type: 'space' },
        { type: 'heading', depth: 3, text: 'Z' },
        { type: 'paragraph', text: 'hhh' },
        { type: 'space' },
      ],
      [
        { type: 'heading', depth: 1, text: 'Second heading' },
        { type: 'paragraph', text: 'Content under second heading' },
        { type: 'space' },
      ],
      [
        { type: 'heading', depth: 1, text: 'Third heading' },
        { type: 'paragraph', text: 'Content under third heading' },
      ],
    ]);
  });
});
