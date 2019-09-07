/**
 * A markdown token object returned by marked lexer parse
 * @typedef {Object} Token
 * @property {type} string - The type of the token.
 */

/**
 * Validate that the headings hierarchy is well-formed,i.e the first element in
 * the tokens array should be a h1 heading, all other headings in the tree must
 * be lower than this heading level, and no heading levels should be skipped
 * (e.g. h4s should not appear directly below h2s).
 *
 * @param {Token[]} tokens An array of markdown tokens
 */
function validateHeadings(tokens) {
  if (tokens[0].type !== 'heading' || tokens[0].depth !== 1) {
    throw new Error('The first token must be a h1 heading');
  }
  let currentDepth = 1;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'heading') {
      if (token.depth === 1 && i !== 0) {
        throw new Error('There should only be a single h1');
      }
      if (token.depth - 1 > currentDepth) {
        throw new Error(
          `h${token.depth} should not appear in a h${currentDepth} section`
        );
      }
      currentDepth = token.depth;
    }
  }
  return tokens;
}

module.exports = validateHeadings;
