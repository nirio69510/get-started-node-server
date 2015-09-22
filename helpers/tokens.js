exports.checkToken = function(token, uid) {
	
	return new Promise(function(success, error) {
		DB.collection('users').findOne({"token.key": token}, {}, function(err, user) {
			if (err)
				error({tag: 'INTERR', error: err});
			else if (user == null)
				error({tag: "USNFOUND", error: null});
			else {
				var tk = user.token;
				var now = new Date().getTime() / 1000;
				
				if (tk.expiration < now)
					error({tag: 'TKEXPIRE', error: null});
				else 
					success(user);
			}
		});
	});
}