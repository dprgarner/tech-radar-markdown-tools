/**
 * A markdown token object returned by marked lexer parse
 * @typedef {Object} Token
 * @property {type} string - The type of the token.
 */

/**
 * Collates an array of markdown tokens into an array of arrays of markdown
 * tokens, with each array having a single heading token of the given depth as
 * the first element. The first element in the input tokens array should be a
 * heading.
 *
 * @param {Number} depth The depth of the heading to split out
 * @param {Token[]} tokens An array of markdown tokens
 * @returns {Token[][]} An array of arrays of tokens, with each array having a
 * single token of depth `depth` as the first element.
 */
function collateByHeadingDepth(depth, tokens) {
  const sections = [];
  let section;
  for (let token of tokens) {
    if (token.type === 'heading' && token.depth === depth) {
      section = [];
      sections.push(section);
    }
    if (section) {
      section.push(token);
    }
  }
  return sections;
}

module.exports = collateByHeadingDepth;
