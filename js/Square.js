/*global createjs, $, canvas */
/*exported Square*/
"use strict";

/**
 * @class Square
 * @author Laouen Mayal Louan Belloli
 *
 * @description Display a square with background color, border color and border radius.
 */

function Square(parameters) {
    /*jshint validthis:true */
    this.initialize(parameters);
}

/**
 * Initialize a new Square instance.
 *
 * @param {Object} parameters - all the requiered parameters to initialize the instance.
 * 
 */

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

    this.check_min_values();
    this.draw_square();
};

Square.prototype.draw_square = function() {
    var i;

    this.graphics = new createjs.Graphics();
    this.graphics.setStrokeStyle(this.strokeWidth);
    this.graphics.beginStroke(this.strokeColor);
    this.graphics.beginFill(this.fillColor);
    this.graphics.drawRoundRect(0, 0, this.width, this.height, this.radius);

    this.canvas.stage.update();
};

Square.prototype.check_min_values = function() {
    this.width = Math.max(this.width, 1);
    this.height = Math.max(this.height, 1);
    this.radius = Math.max(this.radius, 0);
}