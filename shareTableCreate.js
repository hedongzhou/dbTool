var template = require('./common/template');
var file = require('./common/file');
var config = require('./common/config');

var shareTableConfig = config.get('./config/shareTable.json');
var result = template.renderFile('./template/shareTable.tmpl', shareTableConfig);

console.log(result);

file.write(shareTableConfig.file, result);