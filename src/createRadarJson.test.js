const path = require('path');
const createRadarJson = require('./createRadarJson');

describe('createRadarJson', () => {
  it('parses example data', async () => {
    const data = await createRadarJson({
      title: 'My radar',
      rings: ['Adopt', 'Explore', 'Endure', 'Retire'],
      quadrants: [
        path.resolve(__dirname, '../example/languages-and-frameworks.md'),
        path.resolve(__dirname, '../example/platforms.md'),
        path.resolve(__dirname, '../example/techniques.md'),
        path.resolve(__dirname, '../example/tools.md'),
      ],
    });

    expect(data).toEqual({
      title: 'My radar',
      quadrants: [
        'Languages and Frameworks',
        'Platforms',
        'Techniques',
        'Tools',
      ],
      rings: ['Adopt', 'Explore', 'Endure', 'Retire'],
      blips: [
        {
          name: 'Placeholder',
          ring: 'Adopt',
          isNew: true,
          quadrant: 'Languages and Frameworks',
          description:
            '<p>This is a placeholder blip. Replace this with a list of technologies and tools, each under H2 headings, with the metadata of the tool listed under bullet points before the description. More information on the available format is available in the <a href="https://github.com/dprgarner/tech-radar-markdown-tools/blob/master/README.md">docs</a>.</p>',
        },
        {
          name: 'Placeholder',
          ring: 'Explore',
          isNew: true,
          quadrant: 'Platforms',
          description:
            '<p>This is a placeholder blip. Replace this with a list of technologies and tools, each under H2 headings, with the metadata of the tool listed under bullet points before the description. More information on the available format is available in the <a href="https://github.com/dprgarner/tech-radar-markdown-tools/blob/master/README.md">docs</a>.</p>',
        },
        {
          name: 'Placeholder',
          ring: 'Endure',
          isNew: true,
          quadrant: 'Techniques',
          description:
            '<p>This is a placeholder blip. Replace this with a list of technologies and tools, each under H2 headings, with the metadata of the tool listed under bullet points before the description. More information on the available format is available in the <a href="https://github.com/dprgarner/tech-radar-markdown-tools/blob/master/README.md">docs</a>.</p>',
        },
        {
          name: 'Placeholder',
          ring: 'Retire',
          isNew: true,
          quadrant: 'Tools',
          description:
            '<p>This is a placeholder blip. Replace this with a list of technologies and tools, each under H2 headings, with the metadata of the tool listed under bullet points before the description. More information on the available format is available in the <a href="https://github.com/dprgarner/tech-radar-markdown-tools/blob/master/README.md">docs</a>.</p>',
        },
      ],
    });
  });

  it('uses is-new options', async () => {
    const data = await createRadarJson({
      title: 'My radar',
      rings: ['Adopt', 'Explore', 'Endure', 'Retire'],
      quadrants: [
        path.resolve(__dirname, '../example/languages-and-frameworks.md'),
        path.resolve(__dirname, '../example/platforms.md'),
        path.resolve(__dirname, '../example/techniques.md'),
        path.resolve(__dirname, '../example/tools.md'),
      ],
      isNewOptions: {
        thresholdInMonths: 0,
      },
    });
    expect(data.blips.map(blip => blip.isNew)).toEqual([
      false,
      false,
      false,
      false,
    ]);
  });
});
