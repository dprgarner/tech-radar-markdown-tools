const fs = require('fs');
const util = require('util');
require('./typedef');

const readFile = util.promisify(fs.readFile);

const parseMarkdownToBlips = require('./parseMarkdownToBlips');

/**
 * Creates a JSON object representation a tech radar for use with the
 * tech-radar-generator app.
 *
 * @param {RadarOpts} opts The options for configuring a radar
 * @returns {TechRadar} The generated tech radar
 */
async function createRadarJson({ title, quadrants, rings, isNewOptions }) {
  const mdArray = await Promise.all(quadrants.map(fp => readFile(fp, 'utf8')));
  const blipsArray = mdArray.map(md => parseMarkdownToBlips(md, isNewOptions));
  const quadrantNames = blipsArray.map(blips => blips[0].quadrant);
  const blips = blipsArray.flat();
  return {
    title,
    quadrants: quadrantNames,
    rings,
    blips,
  };
}

module.exports = createRadarJson;
