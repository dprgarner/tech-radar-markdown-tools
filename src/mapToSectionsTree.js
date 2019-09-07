const collateByHeadingDepth = require('./collateByHeadingDepth');

/**
 * A markdown token object returned by marked lexer parse
 * @typedef {Object} Token
 * @property {type} string - The type of the token.
 */

/**
 * A tree node representing a section with nested subsections.
 * @typedef {Object} SectionNode
 * @property {string} name - The name of the section
 * @property {Token[]} tokens - An array of marked lexer tokens. This represents
 * the markdown appearing after the section heading but before any subsection
 * headings.
 * @property {SectionNode[]=} sections - The subsections of this section.
 */

/**
 * Maps an array of marked tokens to a nested tree, where each node has the
 * section title and list of tokens as properties, and any nested subsections.
 *
 * The input tokens _must_ be in a valid section tree structure, i.e the first
 * element in the tokens array should be a heading, all other headings in the
 * tree must be lower than this heading level, and no heading levels should be
 * skipped (e.g. h4s should not appear directly below h2s).
 * @param {Token[]} tokens An array of markdown tokens
 * @returns {SectionNode} The top-level section node
 */
function mapToSectionsTree(tokens) {
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
    ).map(mapToSectionsTree),
  };

  return acc;
}

module.exports = mapToSectionsTree;
