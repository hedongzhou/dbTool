var client = require('./common/client');
var file = require('./common/file');
var config = require('./common/config');
var template = require('./common/template');

client.config = './mybatis/jdbc.json';
var domainConfig = config.get('./mybatis/domain.json');

// 遍历配置
domainConfig.tables.forEach(function(table) {
	// 查询表结构
	client.query('show full fields from ' + table.name, function(result) {
		var fields = [], pkFields = [];

		// 遍历字段
		result.forEach(function(row) {
			if (row.Field.toLowerCase() === 'flag' || row.Field.toLowerCase() === 'createuser' || row.Field.toLowerCase() === 'createtime' || row.Field.toLowerCase() === 'updateuser' || row.Field.toLowerCase() === 'updatetime') {
				return true;
			}

			// 是否为主键
			var isPrimary = row.Key === 'PRI' ? 'Y' : 'N';
			// 字段别名
			var alias = row.Field;
			// 字段名称
			var name = isPrimary === 'Y' && table.pkName ? table.pkName : alias.substring(0, 1).toLowerCase() + alias.substring(1).replace(/_(\w)/g, function(all, letter) {
				return letter.toUpperCase();
			});
			// 字段方法名
			var fnName = name.substring(0, 1).toUpperCase() + name.substring(1);

			var index = row.Type.indexOf('(');
			index = index > 0 ? index : row.Type.length;
			// 数据库原类型
			var dbType = row.Type;
			// 数据库类型，不带长度
			var jdbcType = row.Type.substring(0, index).toLowerCase();
			// java类型
			var javaType = domainConfig.fieldMap[jdbcType];
			// 是否可空
			var isNull = row.Null === 'YES' ? 'Y' : 'N';
			// 是否自增长
			var isAuto = row.Extra === 'auto_increment' ? 'Y' : 'N';
			// 字段备注
			var comment = row.Comment;

			// 字段模型
			var fieldModel = {
				isPrimary: isPrimary,
				alias: alias,
				name: name,
				fnName: fnName,
				dbType: dbType,
				jdbcType: jdbcType,
				javaType: javaType,
				isNull: isNull,
				isAuto: isAuto,
				comment: comment
			};

			if (isPrimary === 'Y') {
				pkFields.push(fieldModel);
			} else {
				fields.push(fieldModel);
			}
		});

		// 表名
		var name = table.name.toUpperCase();
		// 变量名
		var variableName = name.toLowerCase();
		variableName = variableName.replace(/_(\w)/g, function(all, letter) {
			return letter.toUpperCase();
		});
		// 实体类名
		var className = variableName.substring(0, 1).toUpperCase() + variableName.substring(1);

		// 表模型
		var tableModel = {
			module: domainConfig.module,
			name: name,
			variableName: variableName,
			className: className,
			nameCN: table.nameCN,
			fields: pkFields.concat(fields),
			pkFields: pkFields,
			noCU: table.noCU
		};

		// 生成java类
		file.write(domainConfig.dir + '/domain/' + className + '.java', template.renderFile('./mybatis/tmpl/domain.tmpl', tableModel));
		file.write(domainConfig.dir + '/mapper/' + className + 'Mapper.java', template.renderFile('./mybatis/tmpl/mapper.tmpl', tableModel));
		file.write(domainConfig.dir + '/mapper/' + className + 'Mapper.xml', template.renderFile('./mybatis/tmpl/mapperXML.tmpl', tableModel));
	});
});