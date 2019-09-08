/**
 * @file JSDoc types used in this library
 * @author David Garner
 */

/**
 * A markdown token object returned by marked lexer parse
 * @typedef {Object} Token
 * @property {string} type - The type of the token
 * @property {Number=} depth - The depth of a heading token
 * @property {text=} text - The text of the token
 */

/**
 * A tree node representing an array of `marked` tokens with nested subsections.
 * @typedef {Object} TokensNode
 * @property {string} name - The name of the section
 * @property {Token[]} tokens - An array of marked lexer tokens. This represents
 * the markdown appearing after the section heading but before any subsection
 * headings.
 * @property {TokensNode[]=} sections - The subsections of this section.
 */

/**
 * A map of link keys and values used by the `marked` Markdown parser
 * @typedef {Object} Links
 */

/**
 * The metadata object of a section.
 * @typedef {Object.<string, string>} Metadata
 */

/**
 * A tree node representing a section with metadata, rendered content, and
 * nested subsections
 * @typedef {Object} MetadataNode
 * @property {string} name - The name of the section
 * @property {Metadata} metadata - An object of metadata for the section
 * @property {string} content - The rendered HTML content of this node
 * @property {MetadataNode[]=} sections - The subsections of this section
 */
