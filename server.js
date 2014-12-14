// load dependencies
var http = require('http');
var Url = require('url');
var LessSimpleRouter = require('./LessSimpleRouter.js');
var pg = require('pg');


var port = process.env.PORT || 8080;
var dbLoc = process.env.DATABASE_URL;

var router = new LessSimpleRouter();
var server = http.createServer(router.handleRequest.bind(router));

router.get('/pos/{pos}', function (request, response, args) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.end();

	var pos = args.pos.split(',');

	var client = new pg.Client(dbLoc);
	client.connect(function(err) {
		if(err) {
			return console.error("error "  + err);
		} else {
			client.query('INSERT INTO locations VALUES (' + pos[0] + ',' + pos[1] + ')', function (err, result) {
				if (err) {
					return console.error("error " + err);
				} 
				client.end();
			});
		}
	});
})

router.get('/db', function (request, response, args) {
	var client = new pg.Client(dbLoc);
	client.connect(function(err) {
		if(err) {
			return console.error("error "  + err);
		} else {
			client.query('SELECT * FROM locations', function (err, result) {
				if (err) {
					return console.error("error " + err);
				} else {
					response.writeHead(200, {"Content-Type": "application/json"});
					response.write(JSON.stringify(result.rows));
					response.end();
				}
				client.end();
			});
		}
	});
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