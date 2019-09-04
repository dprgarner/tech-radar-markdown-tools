const marked = require('marked');

/**
 * A markdown token object returned by marked lexer parse
 * @typedef {Object} Token
 */

function splitByHeadings(tokens, depth) {
  const sections = [];
  let preamble = [];
  let section;
  for (let token of tokens) {
    if (token.type === 'heading' && token.depth === depth) {
      section = [];
      sections.push(section);
    }
    if (section) {
      section.push(token);
    } else {
      preamble.push(token);
    }
  }
  return sections;
}

function toTree(tokens) {
  if (!tokens.length || tokens[0].type !== 'heading') {
    const start = tokens.findIndex(token => token.type === 'heading');
    if (start === -1) {
      return {
        tokens: [],
      };
    }
    return toTree(tokens.slice(start));
  }

  const firstSubheading =
    tokens
      .slice(1)
      .findIndex(
        token => token.type === 'heading' && token.depth > tokens[0].depth
      ) + 1;

  if (firstSubheading === 0) {
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
    sections: splitByHeadings(tokens.slice(firstSubheading, end), depth).map(
      toTree
    ),
  };

  return acc;
}

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

function mapNode({ name, tokens, sections }, links) {
  const { metadata, renderedMd } = partitionTokens(tokens, links);
  if (sections) {
    content = sections.map(section => mapNode(section, links));
  } else {
    content = renderedMd;
  }
  return { name, metadata, content };
}

/**
 * Validate that the headings hierarchy is well-formed
 * @param {Token[]} tokens The array of markdown tokens
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

function parseMarkdown(mdString) {
  const tokens = marked.lexer(mdString);
  validateHeadings(tokens);
  const tree = toTree(tokens);
  return mapNode(tree, tokens.links);
}

exports.splitByHeadings = splitByHeadings;
exports.toTree = toTree;
exports.validateHeadings = validateHeadings;
exports.parseMarkdown = parseMarkdown;
