var ejs = require('ejs');
var file = require('./file');

var template = {
	/**
	 * 解析字符串
	 * 
	 * @param str
	 *            字符串
	 * @param map
	 *            映射
	 * @returns
	 */
	render: function(str, map) {
		return ejs.render(str, map);
	},
	/**
	 * 解析文件
	 * 
	 * @param filePath
	 *            文件路径
	 * @param map
	 *            映射
	 * @returns
	 */
	renderFile: function(filePath, map) {
		return template.render(file.read(filePath), map);
	}
};

module.exports = template;