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

/**
 * @typedef IsNewOptions
 * @type {Object}
 * @property {string=} format The format to expect the string, in Moment date
 * format syntax. See https://momentjs.com/docs/#/parsing/string-format/ for
 * full list of format options available. Defaults to `"MMMM YYYY"`.
 * @property {string=} locale The Moment locale in which to parse the dates.
 * Defaults to `"en"`.
 * @property {Number=} thresholdInMonths After this time in months, the blip is no
 * longer considered new
 */

/**
 * Options for building a radar from Markdown files.
 * @typedef {Object} RadarOpts
 * @property {string} title The title of the markdown radar. This is copied
 * across to the output object.
 * @property {string[]} quadrants An array of the markdown file sources for the
 * tech radar. These _must_ take a structured format given in this library's
 * README.
 * @property {string[]} rings An array of strings specifying the rings, with the
 * inner-most ring listed first. This is copied across to the output object.
 * @property {IsNewOptions=} isNewOptions for determining whether a blip is new
 * or not based on the value of the `modified` bullet point.
 */

/**
 * A Thoughtworks radar "blip".
 * @typedef {Object} Blip
 * @property {string} name - The name of the blip
 * @property {string} quadrant - The quadrant that the blip sits in
 * @property {string} ring - The ring that the blip sits in, reflecting the
 * status of the blip. This should take one of up to four pre-set values.
 * @property {boolean} isNew - If the blip is new
 * @property {string} description - The description of the blip in rendered HTML
 */

/**
 * A tech radar object. The schema of this object is given here:
 * https://raw.githubusercontent.com/dprgarner/tech-radar-generator/master/schema.json
 * @typedef {Object} TechRadar
 * @property {string} title - The title of the radar
 * @property {string[]} quadrants - The quadrants of the radar
 * @property {string[]} rings - The quadrants of the radar
 * @property {Blip[]} blips - The blips of the radar
 */
