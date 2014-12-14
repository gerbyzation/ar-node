// load dependencies
var http = require('http');
var Url = require('url');
var LessSimpleRouter = require('./LessSimpleRouter.js');
var pg = require('pg');


var port = process.env.PORT || 8080;
var db = process.env.DATABASE_URL;

var router = new LessSimpleRouter();
var server = http.createServer(router.handleRequest.bind(router));

router.get('/pos/{pos}', function (request, response, args) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.end();

	var pos = args.pos.split(',');
	client.query('INSERT INTO locations VALUES (50.374686,-4.126134)', function (err, result) {
		if (err) {
			console.error(err);
		}
	})


})

router.get('/db', function (request, response, args) {
	pg.connect(db, function (err, client, done) {
		client.query('SELECT * FROM locations', function(err, result) {
			done();


			if(err){
				console.error(err); response.send('Error ' + err);
			} else {
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.write(JSON.stringify(result.rows));
				response.end();
			}
		})
	})
})

router.error('404', function (req, res, args) {
	res.writeHead(404, {"Content-Type": "text/plain"});
	res.end("Not found");
})

server.listen(port, function() {
	console.log("Server listening at " + port);
});

server.listen(port);

/* Test data: 

/pos/50.374686,-4.126134

*/