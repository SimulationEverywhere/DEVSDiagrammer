/*global createjs, $, canvas */
/*exported Square*/
"use strict";

function Square(parameters) {
    /*jshint validthis:true */
    this.initialize(parameters);
}

Square.prototype = new createjs.Shape();
Square.prototype.ShapeInitialize = Square.prototype.initialize;
Square.prototype.ContainerTick = Square.prototype._tick;

Square.prototype.initialize = function(parameters) {
    
    this.ShapeInitialize();

    /*********** default values **************/
    this.strokeWidth = 1;
    this.radius = 0;
    this.strokeColor = "#000000";
    this.fillColor = "#FFFFFF";

    $.extend(true, this, parameters);

    this.draw_Square();
};

Square.prototype.draw_Square = function() {
    var i;

    this.graphics = new createjs.Graphics();
    this.graphics.setStrokeStyle(this.strokeWidth);
    this.graphics.beginStroke(this.strokeColor);
    this.graphics.beginFill(this.fillColor);
    this.graphics.drawRoundRect(0, 0, this.width, this.height, this.radius);

    this.canvas.stage.update();
};