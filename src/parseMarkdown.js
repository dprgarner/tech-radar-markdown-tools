const marked = require('marked');
const mapToSectionsTree = require('./mapToSectionsTree');
const mapToMetadataTree = require('./mapToMetadataTree');

function parseMarkdown(mdString) {
  const tokens = marked.lexer(mdString);
  if (tokens[0].type !== 'heading' || tokens[0].depth !== 1) {
    throw new Error('The first token must be a h1 heading');
  }
  const tree = mapToSectionsTree(tokens);
  return mapToMetadataTree(tokens.links, tree);
}

module.exports = parseMarkdown;
