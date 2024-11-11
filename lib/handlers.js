//this are the request handlers


//dependnces 
var _data = require('./data');
var helpers = require('./helpers');
//define the hendlers
var handlers = {};

//sample handler

// handlers.sample = function(data, callback){
//     //callback a http status code, and a payload object
//     callback(406, {'name': 'sample handler'});
// }


//users handler
handlers.users = function(data, callback){
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data, callback);
    } else{
        callback(405);
    }
};

//container for the users submethods
handlers._users = {};

//users - post
//required data: firstName, lastName, phone, password, tosAgreement
//optional data: none
handlers._users.post = function(data, callback){
    //check that all required fields are filled out
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;


    if(firstName && lastName && phone && password && tosAgreement){
        //make sure that the user doesent already exist 
        _data.read('users', phone, function(err, data){
            if(err){
                //hash the password
                var hashedPassword = helpers.hash(password);

                if(hashedPassword){
                                    var user ={
                    'firstName':firstName,
                    'lastName': lastName,
                    'phone': phone,
                    'password': hashedPassword,
                    'tosAgreement': true
                }

            //store the user
            _data.create('users', phone, user, function(err){
                if(!err){
                    callback(200);
                } else{
                    console.log(err);
                    callback(500, {'Error': 'Could not create the new user'});
                }
            });
                }else{
                    callback(500, {'Error': 'Could not hash the user\'s password'});
                }

                
    } else{
        //user already exist
        callback(400,{'Erro': 'a user with that phone number already exist'});
    }
        });
    }

//users - get
handlers._users.get = function(data, callback){
    
}

//users - put
handlers._users.put = function(data, callback){
    
}

//users - delete
handlers._users.delete = function(data, callback){
    
}
//ping handler
handlers.ping = function(data, callback){
    callback(200);
};
handlers.hello = function(data, callback){
    callback(200, 
        [
            {'id': '1'},
            {'type': 'API'},
            {'port': '3000'},
            {'message': 'Welcome to the API'}

        ]
        
    );
};


//not found handler

handlers.notFound = function(data, callback){
    callback(404);   
}



//export all the handlers

module.export = handlers;