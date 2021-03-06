var mysql = require('mysql');
var config = require('./config');

var client = {
	config: './config/jdbc.json',
	/**
	 * 创建连接
	 * 
	 * @param filePath
	 *            文件路径
	 * @returns
	 */
	connect: function() {
		return mysql.createConnection(config.get(client.config));
	},
	/**
	 * 查询
	 * 
	 * @param sql
	 * @param callbackFn
	 */
	query: function(sql, callbackFn) {
		var conn = client.connect();
		conn.connect();
		conn.query(sql, function(err, result, fields) {
			if (err) {
				throw err;
			}
			callbackFn(result, fields);
		});
		conn.end();
	}
};

module.exports = client;