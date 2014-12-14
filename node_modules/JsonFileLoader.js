//Dependencies
var fs= require('fs');


var JsonFileLoader = (function() {

	function JsonFileLoader(path)
	{
		this.path = path;
	};

	JsonFileLoader.prototype.getData = function()
	{
		var string = fs.readFileSync(this.path, "utf8");
		return JSON.parse(string);
	};

	return JsonFileLoader;

})();

module.exports = JsonFileLoader;