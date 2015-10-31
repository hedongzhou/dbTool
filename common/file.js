var fs = require('fs');

var file = {
	/**
	 * 读文件
	 * 
	 * @param filePath
	 *            文件路径
	 * @param callbackFn
	 *            回调函数
	 * @returns 若无回调函数，直接返回字符串
	 */
	read: function(filePath, callbackFn) {
		if (callbackFn) {
			fs.readFile(filePath, 'utf8', function(err, data) {
				if (err) {
					throw err;
				}

				callbackFn(data);
			});
		} else {
			return fs.readFileSync(filePath, 'utf8');
		}
	},
	/**
	 * 写文件
	 * 
	 * @param filePath
	 *            文件路径
	 * @param data
	 *            数据
	 * @param callbackFn
	 *            回调函数
	 */
	write: function(filePath, data, callbackFn) {
		fs.writeFile(filePath, data, function(err) {
			if (err) {
				throw err;
			}

			if (callbackFn) {
				callbackFn();
			}
		});
	}
};

module.exports = file;