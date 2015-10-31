/**
 * @param module
 *            模块名称，如bsa
 * @param name
 *            表名，如ORDER_INFO
 * @param className
 *            实体类名，如OrderInfo
 * @param isShare
 *            是否分表，Y/N
 * @param fields
 *            字段数组
 */
module.exports = function(module, name, className, isShare, fields) {
	return {
		module: module,
		name: name,
		className: className,
		isShare: isShare || 'N',
		fields: fields
	};
};