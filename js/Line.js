/*global createjs, $ */
/*exported Line*/
"use strict";

function Line(parameters) {
    /*jshint validthis:true */
    this.initialize(parameters);
}

Line.prototype = new createjs.Shape();
Line.prototype.ShapeInitialize = Line.prototype.initialize;
Line.prototype.ContainerTick = Line.prototype._tick;

Line.prototype.initialize = function(parameters) {
    
    this.ShapeInitialize();
    $.extend(true, this, parameters);

    this.check_min_values();
    this.draw_line();
};

Line.prototype.draw_line = function() {
    var i;

    this.graphics = new createjs.Graphics();
    this.graphics.setStrokeStyle(this.width);
    this.graphics.beginStroke(this.color);

    this.graphics.moveTo(this.nodes[0].x, this.nodes[0].y);
    for (i = 1; i < this.nodes.length; ++i) {
        this.graphics.lineTo(this.nodes[i].x, this.nodes[i].y);
    }
    this.canvas.stage.update();
};

Line.prototype.check_min_values = function() {
    this.width = Math.max(this.width, 1);
}