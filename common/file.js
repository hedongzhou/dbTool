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
	readLine: function(filePath, callbackFn) {
		var input = fs.createReadStream(filePath), remaining = '';

		input.on('data', function(data) {
			remaining += data;
			var index = remaining.indexOf('\n');
			while (index > -1) {
				var line = remaining.substring(0, index);
				remaining = remaining.substring(index + 1);
				callbackFn(line);
				index = remaining.indexOf('\n');
			}

		});

		input.on('end', function() {
			if (remaining.length > 0) {
				callbackFn(remaining);
			}
		});
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