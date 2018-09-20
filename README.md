# Static-GFM

Static-GFM is a NodeJS Markdown to static HTML converter.
The goal was to convert single markdown files that use GitHub Flavored Markdown (GFM) to a single self-contained static HTML file.

Under the covers, Static-GFM uses [Showdown](https://github.com/showdownjs/showdown), [Handlebars.js](https://github.com/wycats/handlebars.js/), and [Highlight.js](https://github.com/highlightjs/highlight.js). Showdown provides the basic conversion from .md to .html. Highlight.js is used for code block coloring and Handlebars.js is used for custom HTML templates.

## CLI Usage

`static-gfm "path-to-source" -d "path-to-destination" -t "path-to-template.html"`

## NodeJS Usage

```js
var StaticGFM = require("static-gfm");
var sgfm = new StaticGFM({
    dest: "path-to-destination",
    template: "path-to-template.html"
});

sgfm.convert("path-to-source");
```

## Options

### Source

The source can be a path to a directory containing markdown files or a single markdown file.
If it is a path to a directory, each .md file will be converted to a .html file.
the source is required when the script is being called from a command line.

### Destination

The destination can either be a filename or a directory.
By default, the destination is the directory the script is being run from.
If the source is a directory, the destination must also be a directory.
When the destination is a directory, each .html file will have the same name as the converted .md file with the new extension.
If the destination is a filename and the source is a single file, the converted file will be given the full filename from the destination.

### Template

The template is a path to a .html file that will be used as a Handlebar.js template when converting the .md file.
See `src/defaultTemplate.html` for an example.
By default, the defaultTemplate.html file is used to style the code similarly to GitHub Flavored Markdown.