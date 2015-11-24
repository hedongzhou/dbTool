var xlsx = require('node-xlsx');

var xls = {
	/**
	 * 读取Excel
	 * 
	 * @param filePath
	 *            文件路径
	 * @returns
	 */
	read: function(filePath) {
		return xlsx.parse(filePath);
	}
};

module.exports = xls;