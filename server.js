// load dependencies
var http = require('http');
var Url = require('url');
var LessSimpleRouter = require('./LessSimpleRouter.js');
var JsonFileLoader = require('./JsonFileLoader.js');
var fs = require('fs');
var pg = require('pg');


var port = process.env.PORT || 8080;

// load data file
var json = new JsonFileLoader('./data.json');
var jsonString = json.getData(json);

var router = new LessSimpleRouter();
var server = http.createServer(router.handleRequest.bind(router));

router.get('/poll', function (request, response, args) {
	response.writeHead(200, {"Content-Type": "application/json"});
	list(response, request, args);
})

router.get('/pos/{pos}', function (request, response, args) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.end();

	console.log('adding position to file');

	fs.readFile('data.json', 'utf8', function(err, data) {
		if (err) {console.error(err);}

		var pos = args.pos.split(',');
		
		var obj = {
			"lat": pos[0],
			"lng": pos[1]
		};

		var jsonList = JSON.parse(data);
		jsonList.push(obj);

		fs.writeFile('data.json', JSON.stringify(jsonList), 'utf8');
	})
})

router.get('/cb/', function (request, response, args) {
	pg.connect(process.env.DATABSE_URL, function (err, cleint, done) {
		client.query('SELECT * FROM test_table', function(err, result) {
			done();
			if(err){
				console.error(err); response.send('Error ' + err);
			} else {
				response.send(result.rows);
			}
		})
	})
})

router.get('/', function (request, response, args) {
	response.writeHead(200, {"Content-Type": "application/json"});
	list(response, request, args);
})



router.error('404', function (req, res, args) {
	res.writeHead(404, {"Content-Type": "text/plain"});
	res.end("Not found");
})

server.listen(port, function() {
	console.log("Server listening at " + port);
});

server.listen(port);

function list(res, req, args) {
	res.write(JSON.stringify(jsonString));
	res.end();
}

// 50.374686, -4.126134