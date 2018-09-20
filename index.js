var argv = require("minimist")(process.argv.slice(2));

var StaticGFM = require("./src/staticGfm");

if (argv.h || argv.help) {
    console.log("This is a simple NodeJS app that consumes a .md file and outputs a static HTML file.");
    console.log("");
    console.log("-s --src      :   The target md file or directory of md files to convert");
    console.log("-d --dest     :   The destination file name or directory to export to");
    console.log("-t --template :   A path to the template.html to use when generating the static HTML");
    console.log("");
    process.exit();
}

var source = (argv._.length > 0) ? argv._[0] : argv.src || argv.s || process.cwd();
if (source) {
    var dest = argv.dest || argv.d;
    var template = argv.template || argv.t;
    var sgfm = new StaticGFM({dest: dest, template: template});
    sgfm.convert(source);
    process.exit();
}

module.exports = StaticGFM;