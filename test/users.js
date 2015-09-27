var Config = require('../config.app.js');
var app = require('../app.js');

var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var winston = require('winston');
var expect = require('chai').expect;

describe('Users', function() {
	
	session = null;

	var userTest1 = {
		login : 'utest1',
		email: 'testuser@test.com',
		password: 'test',
		firstname: 'User',
		lastname: 'TEST1'
	};
	
	var incompleteUser = {
		login: 'utest2',
		email: 'testuser2@test.com',
		firstname: 'User2'
	}
	
	before(function(done) {
		// Before run tests
		this.timeout(5000);
		var MongoClient = require('mongodb').MongoClient;
		var DB = null;
		MongoClient.connect(Config.MONGO_ADDR, function(err, db) {
			if(!err) {
				DB = db;
				done();
			}
			else {
				throw err;
			}
		});
	});
	
	after(function(done) {
		this.timeout(5000);
		DB.collection('users').remove({"infos.email": userTest1.email}, function(err) {
			if (err)
				throw err;
			done();
		});
	});
	
	describe('POST /api/1.0/users', function() {
		it('should return new user and 201 Created Status', function(done) {
		
		request(app)
			.post('/api/1.0/users/')
			.send(userTest1)
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				expect(res.body).to.have.deep.property('infos');
				expect(res.body).to.have.deep.property('auth');
				expect(res.body).to.have.deep.property('_id');
				
				session = res.body;
				
				res.status.should.be.equal(201);
				done();
			});
		});
		
		it('should return 401 Unauthorized HTTP response', function(done) {
		
			request(app)
				.post('/api/1.0/users/')
				.send(userTest1)
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.status.should.be.equal(401);
					done();
			});
		});
		
		it('should return 400 Bad Request HTTP response', function(done) {
		
			request(app)
				.post('/api/1.0/users/')
				.send(incompleteUser)
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.status.should.be.equal(400);
					done();
			});
		});
	}); /* END Describe POST api/1.0/users */
	
	describe('POST /api/1.0/users/signin', function() {
		
		it('should return user and 200 OK Status', function(done) {
			request(app)
				.post('/api/1.0/users/signin')
				.send(userTest1)
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					expect(res.body).to.have.deep.property('infos');
					expect(res.body).to.have.deep.property('auth');
					expect(res.body).to.have.deep.property('_id');
					expect(res.body).to.have.deep.property('token');
					
					session = res.body;
					
					res.status.should.be.equal(200);
					done();
			});
		});
		
		it('should return 400 Bad Request Status', function(done) {
			request(app)
				.post('/api/1.0/users/signin')
				.send(incompleteUser)
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					
					res.status.should.be.equal(400);
					done();
			});
		});
		
		it('should return 404 User Not Found Request Status', function(done) {
			request(app)
				.post('/api/1.0/users/signin')
				.send({login: 'test', password: '123456789'})
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					
					res.status.should.be.equal(404);
					done();
			});
		});
	});
}); 