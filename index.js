/*
 - this is the primary file for the api
 dependencies connecting to the http server

*/

var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

//the server should respond to all request with a string 
var server = http.createServer(function(req, res){

    //get the url and pass it 
    var parsedUrl = url.parse(req.url,true);

    //get the path 
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //get the query string as an object
    var queryStringObject = parsedUrl.query;

    //get the http method
    var method = req.method.toLowerCase();

    //get the headers as an object
    var headers = req.headers;

    //get the payload if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });

    req.on('end', function(){
        buffer += decoder.end();

        //request where handlers should go to chossen handle
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        //send the response

        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        //route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload){
            //use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            //use the payload called back by the handler, or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            //convert the payload to a string
            var payloadString = JSON.stringify(payload);

            //return the response

            res.writeHead(statusCode);
                    //send the response
        res.end(payloadString);

        

        //log the request path
        //console.log('Request is received on path: ' + trimmedPath + ' with method: ' + method + 'with query object ',queryStringObject);
        console.log('Returning this response: ',statusCode,payloadString);
        });


    });    
});


//start the server, and have it listen to port 3000
server.listen(3000, function(){
    console.log('The server is listening on port 3000 now');
})

//define the hendlers
var handlers = {};

//sample handler

handlers.sample = function(data, callback){
    //callback a http status code, and a payload object
    callback(406, {'name': 'sample handler'});
}

//not found handler

handlers.notFound = function(data, callback){
    callback(404);   
}
//define request router

var router ={
    'sample': handlers.sample
}
