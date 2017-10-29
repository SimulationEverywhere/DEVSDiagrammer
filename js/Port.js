/*global createjs, $, Square */
/*exported Port */
"use strict";

function Port(parameters) {
	this.initialize(parameters);
}

Port.out = "out";
Port.in = "in";

Port.prototype = new createjs.Container();
Port.prototype.ContainerInitialize = Port.prototype.initialize;
Port.prototype.ContainerTick = Port.prototype._tick;

Port.prototype.initialize = function(parameters) {
    this.ContainerInitialize();

    this.textColor = "#000000";
    this.font_size = 12;
    
    $.extend(true,this,parameters);

    this.port_box = new Square({
        canvas: this.canvas,
        fillColor: this.fillColor,
        width: this.width,
        height: this.height
    });

    var text_style = this.font_size.toString() + "px Arial";
    this.port_name = new createjs.Text(this.id, text_style, this.textColor);
    this.port_name.textBaseline = "top";

    if (this.outin === Port.in) {
        this.port_name.x = this.width + 2;
    } else {
        this.port_name.regX = this.port_name.getBounds().width;
        this.port_name.x = -2;
    }

    this.regX = this.width / 2;
    this.regY = this.height / 2;

    this.addChild(this.port_box, this.port_name);
    this.canvas.stage.update();
};