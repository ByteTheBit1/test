const https             =   require('https');
const app               =   require('./app');


var fs = require('fs');

// * SET UP KEY FOR HTTPS *
//
//     (pro tip: fs.readFileSync - unlike fs.readFile, fs.readFileSync 
//               will block the entire process until it completes.
//               In a busy server, however, using a synchronous function 
//               during a request will force the server to deal with the requests one by one!!!!)
var key = fs.readFileSync('./SSL KEYS/15886504_stas.com.key');
var cert = fs.readFileSync( './SSL KEYS/15886504_stas.com.cert' );
var options = {key: key,   cert: cert  };


https.createServer(options, app).listen(process.env.PORT || 3000);
