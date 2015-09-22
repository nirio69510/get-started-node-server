var express 	= require('express');
var router 		= express.Router();
var sha1		= require('sha1');

/**
 *
 * @api {post} /api/1.0/users/ Create new user
 * @apiName signup
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiParam {String} login User login 
 * @apiParam {String} firstname User firstname 
 * @apiParam {String} lastname User lastname
 * @apiParam {String} email User email address
 * @apiParam {String} password User password
 * @apiSuccessExample {json} Success Response :
HTTP/1.1 201 Created
 {
    "infos": {
        "login": "Nirio",
        "password": "f91a8ee646a277a2f1359709604b99c1b32d9f24",
        "lastname": "PRIN",
        "firstname": "Nico",
        "email": "nico.prin69@gmail.com"
    },
    "auth": [
        "USER"
    ],
    "_id": "56015da93177e5b41b465999"
}
 *
 */

router.post('/', function(req, res) {
	var params = req.body;
	
	if (!params.login || !params.password || !params.firstname || !params.lastname || !params.email) {
		error.proc(res, "MISPARAMS", {fields: {login: 'User login', firstname: 'User firstname', lastname: 'User lastname', email: 'User email', password: 'User password'}, headers: null});
		return;
	}
	
	if (!Tools.checkEmail(params.email)) {
		error.proc(res, 'EMAILFORMAT', null);
		return;
	}
	
	DB.collection('users').count({"infos.email": params.email}, function(err, count) {
		
		if (count > 0) {
			error.proc(res, 'EMAILUSED', null);
			return;
		}
		
		var data = {infos: {login: params.login, password: sha1(params.password), lastname: params.lastname, firstname: params.firstname, email: params.email}, auth: ['USER']};
		DB.collection('users').insert(data, function(err, user) {
			if (err) {
				error.proc(res, "INTERR", err);
				return;
			}
			else if (!user) {
				error.proc(res, "INTERR", null);
				return;
			}
			
			res.status(201);
			res.json(user.ops[0]);
		});
	});
});

/**
 *
 * @api {post} /api/1.0/users/signin/ Signin user process
 * @apiName signin
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiParam {String} email User email address
 * @apiParam {String} password User password
 *
 */

router.post('/signin', function(req, res) {
	var params = req.body;
	
	if (!params.login || !params.password) {
		error.proc(res, "MISPARAMS", {fields: {login: 'User login', password: 'User password'}, headers: null});
		return;
	}

	DB.collection('users').findOne({"infos.login": params.login, "infos.password": sha1(params.password)}, {'infos.password': false}, function(err, user) {
		if (err) {
			error.proc(res, "INTERR", err);
		return;
		}
		else if (!user) {
			error.proc(res, "USNFOUND", null);
		return;
		}
		  
		var token = user.token;
		var now = new Date().getTime() / 1000;
		if (token == undefined || token.expiration < now) {
			token = {key: Tools.randomKey(32), expiration: parseInt(now + (60 * 60 * 5))};
		
			DB.collection('users').update({_id: user._id}, {$set: {token: token}}, function(err, u) {
				user.token = token;
				res.json(user);
			});
		}
		else {
			res.json(user);
		} 
	});
});

/**
 *
 * @api {get} /api/1.0/users/:uid[?offset=0&limit=25] Get list of users
 * @apiName getusers
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiParam {String} uid User unique _ID
 * @apiParam {String} [offset=0] Offset value of result data
 * @apiParam {String} [limit=25] Number of return users 
 *
 * @apiHeader {String} X-Auth-Token User token
 *
 */

router.get('/:uid', function(req, res, next) {
	
	// Parameters
	var		token 	= req.headers['x-auth-token'];
	var		uid		= req.params.uid;
	var		offset 	= (req.query.offset) ? req.query.offset : 0;
	var 	limit 	= (req.query.limit) ? req.query.limit : 25;
	
	if (!token || !uid) {
		error.proc(res, "MISPARAMS", {fields: {uid: 'User ID'}, headers: {'X-Auth-Token': 'User session token'}});
		return;
	}
	
	Token.checkToken(token, uid).then(function(user) {
		DB.collection('users').find({}, {"infos.password": false, "token": false}).skip(parseInt(offset)).toArray(function(err, users) {
			if (err) {
				error.proc(res, 'INTERR', err);
				return;
			}
			else if (user == null) {
				error.proc(res, "USNFOUND", null);
				return;
			}
			else {
				DB.collection('users').count({}, function(err, count) {
					if (err) {
						error.proc(res, 'INTERR', err);
						return;
					}
					res.json({total: count, offset: offset, users: users});
					return;
				});
			}
		});
	}, function(err) {
		error.proc(res, err.tag, err.error);
	}); 
});

module.exports = router;