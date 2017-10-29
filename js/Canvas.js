/*global $, createjs, Coupled */
/*export Canvas */
"use strict";
function Canvas(parameters) {
	this.initialize(parameters);
}

Canvas.prototype.initialize = function(parameters) {
	this.dom_canvas = $(parameters.canvasId);

    this.stage = new createjs.Stage(this.dom_canvas.get(0));
    this.subStage = new createjs.Container();
    this.stage.addChild(this.subStage);

    this.stageWidth  = this.dom_canvas.width();
    this.stageHeight = this.dom_canvas.height();

    var structure = JSON.parse($(parameters.structure_input_id).val());
    this.top_model = new Coupled({
    	is_top: true,
    	canvas: this,
    	id: structure.id,
    	structure: structure,
    });

    this.subStage.addChild(this.top_model);
    this.stage.update();
};