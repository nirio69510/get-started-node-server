exports.obligatory = function(params, obligatory, callback) {

	return new Promise(function(success, error) {
		var missing = [];
		var result = true;
		var j = 0;
		
		for (i in obligatory) {
			if (!(obligatory[i] in params)){
				missing[missing.length] = obligatory[i];
				result = false;
				j++;
			} 
		}
		
		if (missing.length > 0)
			error(missing);
		else
			success(result);
	});
	
};

exports.checkEmail = function(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
};

exports.randomKey = function(len)
{
    var key = "";
    var src = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < len; i++ )
        key += src.charAt(Math.floor(Math.random() * src.length));

    return key;
};