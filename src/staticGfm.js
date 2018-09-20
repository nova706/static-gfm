var fs = require("fs");
var Handlebars = require("handlebars");
var path = require("path");
var showdown = require("showdown");

var showdownHighlight = require("./showdown-highlight");

var StaticGFM = function (conf) {
    conf = conf || {};

    this.config = {
        dest: conf.dest || process.cwd(),
        template: conf.template || __dirname + "/defaultTemplate.html"
    };

    this.converter = new showdown.Converter({
        extensions: [showdownHighlight]
    });
    this.converter.setFlavor('github');
};

StaticGFM.prototype.convert = function (src) {
    if (!fs.existsSync(src)) {
        throw "The file or directory '" + src + "' does not exist";
    }

    var files = [];
    var i;
    var isDir = fs.lstatSync(src).isDirectory();
    if (isDir) {
        var dirFiles = fs.readdirSync(src);
        for (i = 0; i < dirFiles.length; i++) {
            if (dirFiles[i].split('.').pop() === "md") {
                files.push(src + "/" + dirFiles[i]);
            }
        }
    } else {
        files.push(src);
    }

    if (files.length === 0) {
        throw "No files to convert.";
    }

    var template = fs.readFileSync(this.config.template, {encoding: "utf8"});

    for (i = 0; i < files.length; i++) {
        var md = fs.readFileSync(files[i], {encoding: "utf8"});

        var html = this.converter.makeHtml(md);

        html = StaticGFM.applyTemplate(template, html);

        var saveAs;
        if (this.config.dest.indexOf(".html") > 0 && files.length === 1) {
            saveAs = this.config.dest;
        } else {
            saveAs = path.join(this.config.dest, path.basename(files[i].replace(/\.md$/, '.html')));
        }

        fs.writeFileSync(saveAs, html);
    }
};

StaticGFM.applyTemplate = function (templateSource, html) {
    var template = Handlebars.compile(templateSource);

    var context = {
        body: new Handlebars.SafeString(html),
        scripts: StaticGFM.getScripts(),
        styles: StaticGFM.getStyles()
    };

    return template(context);
};

StaticGFM.getScripts = function () {
    var highlightjs = fs.readFileSync("./node_modules/highlightjs/highlight.pack.js", {encoding: "utf8"});
    return new Handlebars.SafeString('<script type="text/javascript">' + highlightjs + '</script>');
};

StaticGFM.getStyles = function () {
    var highlightcss = fs.readFileSync("./node_modules/highlightjs/styles/github.css", {encoding: "utf8"});
    var gitHubMarkdownCss = fs.readFileSync("./node_modules/github-markdown-css/github-markdown.css", {encoding: "utf8"});

    return new Handlebars.SafeString('<style>' + gitHubMarkdownCss + '</style><style>' + highlightcss + '</style><style>body { margin: 40px; }</style>');
};

module.exports = StaticGFM;