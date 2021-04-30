var exec = require('child_process').exec;

var result = function(command, cb){
    var child = exec(command, function(err, stdout, stderr){
        if(err != null){
            return cb(new Error(err), null);
        } else if(typeof(stderr) != "string"){
            return cb(new Error(stderr), null);
        } else{
            return cb(null, stdout);
        }
    });
}

exports.result = result;
