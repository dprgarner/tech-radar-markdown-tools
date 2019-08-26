const marked = require('marked');

function getHeadings(mdString) {
  const lexerData = marked.lexer(mdString);
  const headings = [];
  let quadrant;
  let currentHeading;
  for (let token of lexerData) {
    if (token.type === 'heading' && token.depth === 1) {
      quadrant = token.text;
    } else if (token.type === 'heading' && token.depth === 2) {
      currentHeading = {
        name: token.text,
        values: [],
      };
      headings.push(currentHeading);
    } else if (currentHeading) {
      currentHeading.values.push(token);
    }
  }
  return { quadrant, headings, links: lexerData.links };
}

function partitionSection(tokens, links) {
  const frontMatter = [];
  const listStart = tokens.findIndex(token => token.type === 'list_start');
  const listEnd = tokens.findIndex(token => token.type === 'list_end');
  for (let i = listStart; i < listEnd; i++) {
    if (tokens[i].type === 'text') {
      frontMatter.push(tokens[i].text);
    }
  }
  description = tokens.slice(listEnd + 1);

  return { frontMatter, description, links };
}

function parseMarkdown(mdString) {
  const { quadrant, headings, links } = getHeadings(mdString);
  return headings.map(({ name, values }) => {
    const { frontMatter, description } = partitionSection(values);
    const markedDescription = [...description];
    markedDescription.links = links;
    const blip = { name, description: marked.parser(markedDescription).trim() };
    for (let token of frontMatter) {
      let [key, value] = token.split(':').map(t => t.trim());
      if (value) {
        blip[key.toLowerCase()] = value;
      }
    }
    blip.quadrant = quadrant;
    return blip;
  });
}

function getIsNew(dateStr, months) {
  const date = new Date(dateStr);
  const cutoff = new Date(
    Date.UTC(Date.now().getFullYear(), Date.now().getMonth(), 0, -1, 0, 0)
  );
  cutoff.setMonth((12 + cutoff.getMonth() - months) % 12);
  console.log(date, cutoff);
  return date > cutoff;
}

function mapModifiedToIsNew(blips, threshold) {
  return blips;
}

exports.getHeadings = getHeadings;
exports.getIsNew = getIsNew;
exports.mapModifiedToIsNew = mapModifiedToIsNew;
exports.partitionSection = partitionSection;
exports.parseMarkdown = parseMarkdown;
