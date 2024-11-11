//library use for storing and editing data
var fs = require('fs');
var path = require('path');

//container for the module to be exported

var lib = {};


//base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

//write data to file
lib.create = function(dir, file, data, callback){
    //open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            //convert data to string 
            var stringData = JSON.stringify(data);

            //write to file and close
            fs.writeFile(fileDescriptor, stringData, function(err){
                if(!err){
                    fs.close(fileDescriptor, function(err){
                        if(!err){
                            callback(false);
                        } else{
                            callback('Error closing new file');
                        }
                    });
                } else{
                    callback('Error writing to new file');
                }
            })
        } else{
            callback('Could not create new file, it may already exist');
        }
    });
}

lib.delete = function(dir,file,callback){
    //unlink the file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
        if(!err){
            callback(false);
        } else{
            callback('Error deleting file');
        }
    });
}



//read data from a file
lib.read = function(dir, file, callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', function(err, data){
        callback(err, data);
    });
};

//update data inside a file
lib.update = function(dir, file, data, callback){
    //open the file for writing
    fs.open(lib,this.baseDir+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            //convert data to string
            var stringData = JSON.stringify(data);

            //truncate the file
            fs.ftruncate(fileDescriptor, function(err){
                if(!err){
                    //write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, function(err){
                        if(!err){
                            fs.close(fileDescriptor, function(err){
                                if(!err){
                                    callback(false);
                                } else{
                                    callback('Error closing the file');
                                }
                            });
                        } else{
                            callback('Error writing to existing file');
                        }
                    });
                } else{
                    callback('Error truncating file');
                }
            });

        }
});
};

//export the module
module.exports = lib;