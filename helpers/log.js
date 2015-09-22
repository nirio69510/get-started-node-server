var colors = require("colors");

exports.e = function(txt) {
	if (Config.MODE === "dev")
		console.log((new Date()+"\t[ERROR]\t").blue+txt.red);
};

exports.i = function(txt) {
	if (Config.MODE === "dev")
		console.log((new Date()+"\t[INFO]\t").blue+txt.green);
}; 