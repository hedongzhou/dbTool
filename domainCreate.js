var client = require('./common/client');
var file = require('./common/file');
var config = require('./common/config');
var fieldClass = require('./model/field');
var tableClass = require('./model/table');
var template = require('./common/template');

var domainConfig = config.get('./config/domain.json');

domainConfig.tables.forEach(function(table) {
	client.query('show full fields from ' + table.name, function(result) {
		console.log(result);
		var fields = [];

		result.forEach(function(row) {
			var isPrimary = row.Key === 'PRI' ? 'Y' : 'N';
			var alias = row.Field.toLowerCase();
			var name = isPrimary === 'Y' ? 'id' : alias.replace(/_(\w)/g, function(all, letter) {
				return letter.toUpperCase();
			});
			var fnName = name.substring(0, 1).toUpperCase() + name.substring(1);

			var index = row.Type.indexOf('(');
			index = index > 0 ? index : row.Type.length;
			var jdbcType = row.Type.substring(0, index).toLowerCase();
			var javaType = domainConfig.fieldMap[jdbcType];
			var isAuto = row.Extra === 'auto_increment' ? 'Y' : 'N';
			var comment = row.Comment;
			var fieldModel = fieldClass(isPrimary, alias, name, fnName, jdbcType, javaType, isAuto, comment);

			if (isPrimary === 'Y') {
				fields.unshift(fieldModel);
			} else {
				fields.push(fieldModel);
			}
		});

		var module = table.module.toLowerCase();
		var name = table.name.toUpperCase();
		var className = name.replace('BM_', '').toLowerCase();
		className = className.replace(/_(\w)/g, function(all, letter) {
			return letter.toUpperCase();
		});
		className = className.substring(0, 1).toUpperCase() + className.substring(1);
		var tableModel = tableClass(module, name, className, table.isShare, fields);
		console.log(tableModel);

		var domainStr = template.renderFile('./template/domain.tmpl', tableModel);
		console.log(domainStr);

		file.write(domainConfig.dir + className + ".java", domainStr);

		var hbmxmlStr = template.renderFile('./template/hbmxml.tmpl', tableModel);
		console.log(hbmxmlStr);

		var hbmxml = name.toLowerCase().replace(/_(\w)/g, function(all, letter) {
			return letter.toUpperCase();
		});
		hbmxml = hbmxml.substring(0, 1).toUpperCase() + hbmxml.substring(1);
		file.write(domainConfig.dir + hbmxml + ".hbm.xml", hbmxmlStr);
	});
});