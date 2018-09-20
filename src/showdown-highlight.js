var decodeHtml = require("html-encoder-decoder").decode;
var showdown = require("showdown");
var hljs = require("highlightjs");

module.exports = function showdownHighlight() {
    return [
        {
            type: "output",
            filter: function filter(text) {
                var left = "<pre><code\\b[^>]*>";
                var right = "</code></pre>";
                var flags = "g";
                var replacement = function replacement(wholeMatch, match, left, right) {
                    match = decodeHtml(match);
                    var lang = (left.match(/class="([^ "]+)/) || [])[1];
                    if (lang && hljs.getLanguage(lang)) {
                        return left + hljs.highlight(lang, match).value + right;
                    } else {
                        return wholeMatch;
                    }
                };

                return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
            }
        }
    ];
};