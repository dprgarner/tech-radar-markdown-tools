const marked = require('marked');
const validateHeadings = require('./validateHeadings');
const mapToSectionsTree = require('./mapToSectionsTree');

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

function partitionTokens(tokens, links) {
  const metadata = {};
  const listStart = tokens.findIndex(token => token.type === 'list_start');
  const listEnd = tokens.findIndex(token => token.type === 'list_end');
  for (let i = listStart; i < listEnd; i++) {
    if (tokens[i].type === 'text') {
      let [key, value] = tokens[i].text.split(':').map(t => t.trim());
      if (value) {
        metadata[key.toLowerCase()] = value;
      }
    }
  }
  const markedTokens = tokens.slice(listEnd + 1);
  let renderedMd = '';
  if (markedTokens.length) {
    markedTokens.links = links;
    renderedMd = marked.parser(markedTokens).trim();
  }

  return { metadata, renderedMd };
}

function mapNode(links, { name, tokens, sections }) {
  const { metadata, renderedMd } = partitionTokens(tokens, links);
  if (sections) {
    content = sections.map(section => mapNode(links, section));
  } else {
    content = renderedMd;
  }
  return { name, metadata, content };
}

function parseMarkdown(mdString) {
  const tokens = marked.lexer(mdString);
  validateHeadings(tokens);
  const tree = mapToSectionsTree(tokens);
  return mapNode(tokens.links, tree);
}

module.exports = parseMarkdown;
