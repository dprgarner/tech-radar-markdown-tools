# Tech Radar Markdown Tools

[![npm](https://img.shields.io/npm/v/tech-radar-markdown-tools)](http://npmjs.com/package/tech-radar-markdown-tools)

Tools for creating a Tech Radar in Markdown and converting it to JSON.

## Overview

This repo contains a set of helper functions for parsing Markdown documents into JSON for use with the [Tech Radar generator](https://github.com/dprgarner/tech-radar-generator).

Both these tools are likely to be superseded in the future by another static site building tool such as Gatsby with MDX.

## Usage

First create your source markdown files with the data underlying your tech radar. The library expects the markdown files to follow some rules with respect to structure, to allow them to be parsed reliably to JSON:

- There should be a single markdown file for each of the four quadrants.
- The title of each quadrant should be the h1 title of each markdown file. This must appear at the first line of the file. There should be no other h1 headings in the file.
- Each blip should be represented by a h2-level section in the markdown file. The title of the blip should be the h2 section text.
- Each h2 section representing a blip should be a bullet-point list of metadata of that blip. The metadata must include the Status of the blip, prefixed with "Status: ", and may optionally include the date the blip was added/modified, prefixed with "Modified: ". These keys are case-insensitive.
- Each h2 section can optionally include any markdown after the metadata bullet-point list, _except_ for section headings. This will be rendered as HTML as the description of the blip.

An example markdown file keeping to this format:

```md
# Languages and Frameworks

## Placeholder

- Status: Adopt
- Modified: August 2018

This is a placeholder blip. Replace this with a list of technologies and tools, each under H2 headings, with the metadata of the tool listed under bullet points before the description. More information on the available format is available in the [docs][docs].

[docs]: https://github.com/dprgarner/tech-radar-markdown-tools/blob/master/README.md

## Another Placeholder

- Status: Avoid
```

Next, import the `createRadarJson` function from this library. This function accepts an options object as argument, in which you should put the file paths of the source markdown data, and optionally some data to determine whether a blip is considered "new" or not. The output of this function will adhere to [this JSON schema][schema].

[schema]: https://github.com/dprgarner/tech-radar-generator/blob/master/schema.json

Example usage of this function:

```js
const path = require('path');
const { createRadarJson } = require('tech-radar-markdown-tools');

createRadarJson({
  title: 'My radar',
  rings: ['Adopt', 'Explore', 'Endure', 'Retire'],
  quadrants: [
    path.resolve('./data/languages-and-frameworks.md'),
    path.resolve('./data/platforms.md'),
    path.resolve('./data/techniques.md'),
    path.resolve('./data/tools.md'),
  ],
}).then(radar => {
  console.log(radar);
});
```

## API

This library exports two functions: `createRadarJson` and `parseMarkdownToBlips`.

### `createRadarJson`

This function takes an array of input markdown files and generates a promise resolving to a JSON object. The available options are as follows:

- `title` (string): The title of the markdown radar. This is copied across to the output object.
- `quadrants` (string[]): An array of the markdown file sources for the tech radar. These _must_ take the structured format given above.
- `rings` (string[]): An array of strings specifying the rings, with the inner-most ring listed first. This is copied across to the output object.
- `isNewOptions` (IsNewOptions) (optional) Options for determining whether a blip is new or not based on the value of the `Modified` bullet point on each section.

The `IsNewOptions` object is optional, and can take the following properties:

- `format` (string) (optional): The format to expect the string, in Moment date
  format syntax. See https://momentjs.com/docs/#/parsing/string-format/ for full
  list of format options available. Defaults to `"MMMM YYYY"`.
- `locale` (string) (optional): The Moment locale in which to parse the dates. Defaults to `"en"`.
- `thresholdInMonths` (number) (optional) After this time in months, the blip is no longer considered new. Defaults to `3`.

### `parseMarkdownToBlips`

The library also exports the function that parses a markdown string to an array of blips. This takes the following arguments:

- `mdString` (string): A string of markdown. This _must_ take the structured format given above.
- `isNewOptions` (IsNewOptions) (optional) Options for determining whether a blip is new or not based on the value of the `Modified` bullet point on each section.

Example usage:

```js
const md = `
# en français

## espace réservé

- Status: Bon
- Modified: août 2018

La lune est un fromage
`.trim();

// Returns an array with one "blip" object
parseMarkdownToBlips(md, { locale: 'fr' });
```

## Developing

To run the tests:

    yarn test

To run the linter:

    yarn lint

## Releasing

Publishing is performed manually.

In your PR, create a new tagged commit and bump the version in package.json with the npm version script:

```bash
npm version patch
```

and push the new commits and tags with:

```bash
git push && git push --tags
```
