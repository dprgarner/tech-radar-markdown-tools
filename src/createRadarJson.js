/**
 * @fileoverview A function for generating a tech radar from markdown files
 * @author David Garner
 */
const fs = require('fs');
const util = require('util');
require('./typedef');

const readFile = util.promisify(fs.readFile);

const parseMarkdownToBlips = require('./parseMarkdownToBlips');

const flatten = xs => xs.reduce((acc, x) => acc.concat(x), []);

/**
 * Creates a JSON object representation a tech radar for use with the
 * tech-radar-generator app.
 *
 * @param {RadarOpts} opts The options for configuring a radar
 * @returns {Promise<TechRadar>} The generated tech radar
 */
async function createRadarJson({ title, quadrants, rings, isNewOptions }) {
  const mdArray = await Promise.all(quadrants.map(fp => readFile(fp, 'utf8')));
  const blipsArray = mdArray.map(md => parseMarkdownToBlips(md, isNewOptions));
  const quadrantNames = blipsArray.map(blips => blips[0].quadrant);
  const blips = flatten(blipsArray);
  return {
    title,
    quadrants: quadrantNames,
    rings,
    blips,
  };
}

module.exports = createRadarJson;
