var template = require('./common/template');
var file = require('./common/file');
var config = require('./common/config');

var result = template.renderFile('./template/shareTable.tmpl', config.get('./config/shareTable.json'));

console.log(result);

file.write('./temp/shareTable.txt', result);