const marked = require('marked');

const createTokensTree = require('./createTokensTree');
const mapToMetadataTree = require('./mapToMetadataTree');
const getIsNew = require('./getIsNew');
require('./typedef');

/**
 * Parses a string of markdown to an array of blips, in the format specified in
 * the tech-radar-generator.
 *
 * @param {string} mdString A string of markdown. This _must_ be in a specific
 * structured format: this is specified in the library's README.
 * @param  {IsNewOptions} isNewOptions Options for determining whether a blip is
 * new or not based on the value of the `modified` bullet point.
 * @return {Blip[]} An array of tech radar blips
 */
function parseMarkdownToBlips(mdString, isNewOptions) {
  const tokens = marked.lexer(mdString);
  if (tokens[0].type !== 'heading' || tokens[0].depth !== 1) {
    throw new Error('The first token must be a h1 heading');
  }
  const tokensTree = createTokensTree(tokens);
  const metadataTree = mapToMetadataTree(tokens.links, tokensTree);
  const { name } = metadataTree;
  const blips = metadataTree.sections.map(section => ({
    name: section.name,
    description: section.content,
    ring: section.metadata.status,
    quadrant: name,
    isNew: section.metadata.modified
      ? getIsNew(section.metadata.modified, isNewOptions)
      : false,
  }));
  return blips;
}

module.exports = parseMarkdownToBlips;
