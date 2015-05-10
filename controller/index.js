(function (controller) {
    var mapController = require("./mapController");
    controller.initializeControllers = function (app) {
        mapController.initialize(app);
    }
	
})(module.exports)