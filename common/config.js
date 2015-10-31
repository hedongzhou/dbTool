var file = require('./file');

var config = {
	/**
	 * 获取配置
	 * 
	 * @param filePath
	 *            文件路径
	 * @returns
	 */
	get: function(filePath) {
		return JSON.parse(file.read(filePath));
	}
};

module.exports = config;