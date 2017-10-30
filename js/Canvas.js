/*global $, createjs, Coupled, canvas */
/*export Canvas */
"use strict";
function Canvas(parameters) {
	this.initialize(parameters);
}

Canvas.prototype.initialize = function(parameters) {
    this.id = "stage_canvas_" + canvas.length.toString();
    this.dom_canvas = $('<canvas/>',{'Width':1000,'Height':800, 'id': this.id });
    $('body').append(this.dom_canvas);

    this.stage = new createjs.Stage(this.dom_canvas.get(0));
    this.subStage = new createjs.Container();
    this.stage.addChild(this.subStage);

    this.stageWidth  = this.dom_canvas.width();
    this.stageHeight = this.dom_canvas.height();

    var structure = parameters.structure;
    if (structure === undefined || structure === null) {
        structure = JSON.parse($(parameters.structure_input_id).val());
    }
    
    this.top_model = new Coupled({
    	is_top: true,
    	canvas: this,
    	structure: structure,
    });

    this.subStage.addChild(this.top_model);
    this.stage.update();
};