/*global $, createjs, Model, JSONModelGraphics */
/*export Canvas */
"use strict";

var canvas_id = 0;

/**
 * @class Canvas
 * @author Laouen Mayal Louan Belloli
 *
 * @description Represent a canvas where a Model is displayed.
 * It creates the DOM canvas, append it to the html body and initialize a new createjs.Stage
 * and subStage container.
 */

function Canvas(parameters) {
	this.initialize(parameters);
}

Canvas.prototype.initialize = function(parameters) {
    this.id = "stage_canvas_" + canvas_id.toString();
    this.canvas_id++;
    
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

    var jsonGraphics = parameters.jsonGraphics;
    if (jsonGraphics === undefined || jsonGraphics === null) {
        jsonGraphics = new JSONModelGraphics({ id: structure.id });
    }
    
    this.top_model = new Model({
    	is_top: true,
    	canvas: this,
    	structure: structure,
        jsonGraphics: jsonGraphics
    });

    this.subStage.addChild(this.top_model);
    this.stage.update();
};