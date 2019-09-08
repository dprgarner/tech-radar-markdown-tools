const parseMarkdown = require('./parseMarkdown');

describe('parseMarkdown', () => {
  it('throws if the first token is not a H1', () => {
    expect(() => parseMarkdown('## I should be h1')).toThrow();
    expect(() => parseMarkdown('I should be h1')).toThrow();
  });
});
