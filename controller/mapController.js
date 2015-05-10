(function (mapController) {
    var fs = require('fs');
    mapController.initialize = function (app) {
        app.get("/", function (req, res) {
			var handleFile = function (err, data) {
                if (err) {
                    res.end();
                } else {
                    var obj = JSON.parse(data);
                    res.render("../views/index", {data:{ title: "Exzeo Map", states: JSON.stringify(obj) }});
					res.end();
                }
            }
           fs.readFile('./public/data/states.json', handleFile);
        });
    }
})(module.exports)