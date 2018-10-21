var xls = require('./common/xls');
var file = require('./common/file');
var config = require('./common/config');
var template = require('./common/template');

var tableConfig = config.get('./config/table.json');

var rowFieldName = [
		'tableName', 'tableNameCN', 'fieldName', 'comment', 'type', 'key', 'isNull', 'isAuto', 'remark'
];

var sheets = xls.read(tableConfig.source);

var getRow = function(row) {
	var rowModel = {};

	for (var i = 0; i < rowFieldName.length; i++) {
		rowModel[rowFieldName[i]] = row[i];
	}

	return rowModel;
};

var tables = [];

sheets.forEach(function(sheet) {
	sheet.data.shift();
	sheet.data.forEach(function(row) {
		row = getRow(row);

		var table;
		if (row.tableName) {
			table = {
				tableName: row.tableName.toUpperCase(),
				tableNameCN: row.tableNameCN,
				fields: [],
				pkFields: []
			};
			tables.push(table);
		} else {
			table = tables[tables.length - 1];
		}

		var field = {
			fieldName: row.fieldName,
			type: row.type,
			comment: row.comment,
			isPrimary: row.key && row.key.toUpperCase() === 'PK' ? 'Y' : 'N',
			isNull: row.isNull || 'N',
			isAuto: row.isAuto || 'N',
			remark: row.remark || ''
		};

		if (field.isPrimary === 'Y') {
			table.pkFields.push(field);
		} else {
			table.fields.push(field);
		}
	});
});

tables.forEach(function(table) {
	table.fields = table.pkFields.concat(table.fields);
});

file.write(tableConfig.target, template.renderFile('./template/table.tmpl', {
	tables: tables
}));