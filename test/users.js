var Config = require('../config.app.js');

var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var winston = require('winston');

describe('Users', function() {
  var url = 'http://localhost:'+Config.PORT;
  before(function(done) {
  	// Before run tests
    done();
  });

  describe('Account', function() {
    it('should return 201 Created HTTP response', function(done) {
      var profile = {
        login : 'Nirio',
  		email: 'nico.prin69@gmail.com',
  		password: 'panda',
  		firstname: 'Nicolas',
  		lastname: 'PRIN'
      };

    request(url)
	.post('/api/1.0/users/')
	.send(profile)
	.end(function(err, res) {
          if (err) {
            throw err;
          }
          res.status.should.be.equal(201);
          done();
        });
    });
  });
}); 