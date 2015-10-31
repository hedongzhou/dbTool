/**
 * @param isPrimary
 *            是否为主键，Y/N
 * @param alias
 *            数据库别名，如order_id
 * @param name
 *            字段名，如orderId
 * @param fnName
 *            方法名，如OrderId
 * @param jdbcType
 *            数据库类型，如varchar
 * @param javaType
 *            java类型，如String
 * @param isAuto
 *            字段是否为自增长
 * @param comment
 *            备注
 */
module.exports = function(isPrimary, alias, name, fnName, jdbcType, javaType, isAuto, comment) {
	return {
		isPrimary: isPrimary || 'N',
		alias: alias,
		name: name,
		fnName: fnName,
		jdbcType: jdbcType,
		javaType: javaType,
		isAuto: isAuto || 'Y',
		comment: comment
	};
};