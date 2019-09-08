/**
 * @file Utility functions for converting markdown to a structured tree of
 * sections
 * @author David Garner
 */

require('./typedef');

/**
 * Validate that the headings hierarchy is well-formed,i.e the first element in
 * the tokens array should be a h1 heading, all other headings in the tree must
 * be lower than this heading level, and no heading levels should be skipped
 * (e.g. h4s should not appear directly below h2s).
 *
 * @param {Token[]} tokens An array of markdown tokens
 */
function validateHeadingStructure(tokens) {
  if (tokens[0].type !== 'heading') {
    throw new Error('The first token must be a heading');
  }
  const minDepth = tokens[0].depth;
  let currentDepth = minDepth;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'heading') {
      if (token.depth === minDepth && i !== 0) {
        throw new Error(
          `There should only be a single h${minDepth} heading in this node`
        );
      }
      if (token.depth - 1 > currentDepth) {
        throw new Error(
          `h${token.depth} should not appear in a h${currentDepth} section`
        );
      }
      if (token.depth < minDepth) {
        throw new Error(
          `h${token.depth} should not appear anywhere in a h${minDepth} node`
        );
      }
      currentDepth = token.depth;
    }
  }
  return tokens;
}

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

/**
 * Maps an array of marked tokens to a nested tree, where each node has the
 * section title and list of tokens as properties, and any nested subsections.
 *
 * The input tokens _must_ be in a valid section tree structure, i.e the first
 * element in the tokens array should be a heading, all other headings in the
 * tree must be lower than this heading level, and no heading levels should be
 * skipped (e.g. h4s should not appear directly below h2s).
 * @param {Token[]} tokens An array of markdown tokens
 * @returns {TokensNode} The top-level node
 */
function createTokensTree(tokens) {
  validateHeadingStructure(tokens);
  const firstSubheading =
    tokens
      .slice(1)
      .findIndex(
        token => token.type === 'heading' && token.depth > tokens[0].depth
      ) + 1;

  if (firstSubheading === 0) {
    // Leaf node with no nested subsections.
    let endOfSection =
      tokens.slice(1).findIndex(token => token.type === 'heading') + 1;
    if (endOfSection === 0) {
      endOfSection = tokens.length;
    }
    return {
      name: tokens[0].text,
      tokens: tokens.slice(1, endOfSection),
    };
  }

  // Tree node with nested subsections.
  const { depth } = tokens[firstSubheading];
  let end = tokens
    .slice(firstSubheading)
    .findIndex(token => token.type === 'heading' && token.depth < depth);
  if (end === -1) {
    end = tokens.length;
  } else {
    end += firstSubheading;
  }
  const acc = {
    name: tokens[0].text,
    tokens: tokens.slice(1, firstSubheading),
    sections: collateByHeadingDepth(
      depth,
      tokens.slice(firstSubheading, end)
    ).map(createTokensTree),
  };

  return acc;
}

module.exports = createTokensTree;
