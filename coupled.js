"use strict";
function coupled(parameters) {
	this.initialize(parameters);
}

coupled.prototype = new createjs.Container();
coupled.prototype.ShapeInitialize = coupled.prototype.initialize;
coupled.prototype.ShapeTick = coupled.prototype._tick;

coupled.prototype = {

	initialize : function(parameters) {
		this.ShapeInitialize();

		/********** Default values **************/
		this.is_top = false;
		this.port = [];
		this.EIC = [];
		this.IC = [];
		this.EOC = [];

		$.extend(true, this, parameters);
	}

	expand : function() {}

	contract : function() {}

	expandInNewCanvas : function() {}

	destroy : function() {
		if (!this->is_top)
	}
}