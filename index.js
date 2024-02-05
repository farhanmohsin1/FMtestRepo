const exec = require('child_process').exec;

// Fake credentials to demonstrate sensitive data scan results
const ACCESS_KEY='AKIAABPX3123CJ5POOJD';
const ACCESS_SECRET='s1bP72zEwsd9wZAx508HaAS4Fl/mHm6WwetrO/34';

exports.handler = (event, context, callback) => {
    
    var response = new Object();
    response.isBase64Encoded = false;
    response.headers = {"Content-Type":"text/plain"};
    
    try{
        var requestBody = JSON.parse(event.body);
    }
    catch(error){
        console.error('event.body JSON parse error');
        response.statusCode = 500;
        response.body = error.message;
        return callback(null, response);
    }
    
    if (!requestBody.cmd) {
        console.error('requestBody.cmd not found');
        response.statusCode = 500;
        response.body = 'Please specify a command to run in request body like so: {\"cmd\":\"ls -al\"}';
        return callback(null, response);
    }
    
    const child = exec(requestBody.cmd, (error, stdout, stderr) => {

        if (error) {
            console.error(`child_process.exec error: ${error}`);
            response.statusCode = 500;
            response.body = error;
        }
        
        if (stdout) {
            console.log(`stdout: ${stdout}`);
            response.statusCode = 200;
            response.body = stdout;
        }
        
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            response.statusCode = 200;
            response.body = stderr;
        }
  
        return callback(null,response);
    });

};
