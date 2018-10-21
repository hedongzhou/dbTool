var xls = require('./common/xls');

var sheets = xls.read('/Users/hedongzhou/Downloads/1.xls');

function loop(id, arr, result) {
	arr.forEach(function(one) {
		if (one[2] == id) {
			var temp = {
				id: one[0],
				name: one[1],
				list: []
			};

			result.push(temp);

			loop(temp.id, arr, temp.list);
		}
	});
}

var obj = [];
sheets.forEach(function(sheet) {
	loop('100000', sheet.data, obj);

	console.log(JSON.stringify(obj));
});
