var list = require('./errors.json');

exports.proc = function(res, tag, infos) {
	var e = list[tag];
	res.status(e.status);
	res.json({msg: e.msg, infos: infos, status: e.status, code: e.custom});
	return;
}