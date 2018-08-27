var fs = require('fs');


var handleRequest = function (request, response) {
	fs.readFile(__dirname + '/index.html',
			function (err, data) {
				if (err) {
					response.writeHead(500);
					return response.end('Error loading index.html');
				}
				response.writeHead(200);
				response.end(data);
			}
		)
	};

var http = require('http');

var server = http.createServer(handleRequest);
server.listen(8080);
var io = require('socket.io').listen(server);

console.log('Server started on port 8080');
