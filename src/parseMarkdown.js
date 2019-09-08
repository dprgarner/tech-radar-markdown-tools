const marked = require('marked');

const createTokensTree = require('./createTokensTree');
const mapToMetadataTree = require('./mapToMetadataTree');
require('./typedef');

function parseMarkdown(mdString) {
  const tokens = marked.lexer(mdString);
  if (tokens[0].type !== 'heading' || tokens[0].depth !== 1) {
    throw new Error('The first token must be a h1 heading');
  }
  const tokensTree = createTokensTree(tokens);
  const metadataTree = mapToMetadataTree(tokens.links, tokensTree);
  return metadataTree;
}

module.exports = parseMarkdown;
