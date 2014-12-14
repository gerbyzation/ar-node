
/*
 * LessSimpleRouter is not on NPM, so added via this route
 */

var Url = require('url');
var LessSimpleRouter;

LessSimpleRouter = (function() {

	function LessSimpleRouter()
	{

		this.listeners = {
			"get": [],
			"put": [],
			"post": [],
			"delete": [],
			"error": []
		};

		this.http = false;

	};

	LessSimpleRouter.prototype.get = function(path, callback)
	{	
		this.addRoute('get', path, callback);
	};
	
	LessSimpleRouter.prototype.put = function(path, callback)
	{	
		this.addRoute('put', path, callback);
	};

	LessSimpleRouter.prototype.post = function(path, callback)
	{	
		this.addRoute('post', path, callback);
	};

	LessSimpleRouter.prototype.delete = function(path, callback)
	{	
		this.addRoute('delete', path, callback);
	};

	LessSimpleRouter.prototype.delete = function(path, callback)
	{	
		this.addRoute('delete', path, callback);
	};

	LessSimpleRouter.prototype.error = function(code, callback)
	{	
		this.addRoute('error', code, callback);
	};

	LessSimpleRouter.prototype.addRoute = function(method, path, callback)
	{

		var listener = {"path": path.toLowerCase(), "callback": callback};

		this.listeners[method][this.listeners[method].length] = listener;

	};

	LessSimpleRouter.prototype.handleRequest = function(request, response)
	{

		var method = request.method.toLowerCase();

		var wasTriggered = this.triggerListener(method, request.url, request, response);
		
		if(wasTriggered) {
			//Do nothing.
		} else {
			var wasErrorTriggered = this.triggerErrorListener('404', request, response);
			if(!wasErrorTriggered) {
				//close the response.
				response.end();
			}
		}

	};

	LessSimpleRouter.prototype.triggerErrorListener = function(code, request, response)
	{
		return this.triggerListener('error', code, request, response);
	}

	LessSimpleRouter.prototype.triggerListener = function(method, url, request, response)
	{

		if(url.length > 1 && url.slice(-1) == '/') {
			url = url.substring(0, url.length - 1);
		}
		
		url = Url.parse(url, true);

		//If we have a list of listeners for the request method then run.
		if("undefined" !== typeof this.listeners[method]) {

			for (var i = 0; i < this.listeners[method].length; i++) {

				var matchData = this.match(this.listeners[method][i].path, url);

				if(matchData.isMatch) {
					this.listeners[method][i].callback(request, response, matchData.data);
					return true;
				}

			};

		}

		return false;
	};

	LessSimpleRouter.prototype.match = function(routePath, url)
	{

		var routePathParts = routePath.split('/');
		var pathParts = url.pathname.split('/');

		if(routePathParts.length == pathParts.length) {

			var numStatic = 0;
			var staticParts = {};
			var dynamicParts = {};
			var data = {};

			for (var i = 0; i < routePathParts.length; i++) {
				if(routePathParts[i].match(/\{|\}/g) !== null) {
					dynamicParts[i] = routePathParts[i].replace(/\{|\}/g, '');
				} else {
					numStatic++;
					staticParts[i] = routePathParts[i];
				}
			};

			var foundStatic = 0;

			for (var i = 0; i < pathParts.length; i++) {
				
				if(typeof dynamicParts[i] !== "undefined") {

					data[dynamicParts[i]] = pathParts[i];

				} else if(typeof staticParts[i] !== "undefined") {

					if(staticParts[i] == pathParts[i]) {
						foundStatic++;
					}

				}

			};

			return {"isMatch": (foundStatic == numStatic), "data": data};
		}

		return {"isMatch": false, "data": {}};
	};

	LessSimpleRouter.prototype.getHttp = function()
	{
		return this.http;
	};

	LessSimpleRouter.prototype.setHttp = function(http)
	{
		this.http = http;
		return this;
	};

	return LessSimpleRouter;

})();

module.exports = LessSimpleRouter;