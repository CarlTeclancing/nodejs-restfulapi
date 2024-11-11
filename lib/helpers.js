//helpers for varius task
//dependencies
var crypto = require('crypto');
var config = require('./config');


//container for all the helpers
var helpers = {};

//create a SHA256 HASH
helpers.hash = function(str){
    if(typeof(str) == 'string' && str.length > 0){
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
        //create user object
        var user ={
            'firstName':firstName,
            'lastName': lastName,
            'phone': phone,
            'password': hashedPassword,
            'tosAgreement': true
        }
        }else{
            return false;
        }
    }
//export the mobule
module.exports = helpers;