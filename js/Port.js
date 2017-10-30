/*global createjs, $, Square, manifest */
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

    this.text_color = manifest.port.text_color;
    this.font_size = manifest.font_size;
    
    $.extend(true,this,parameters);

    this.width = this.height * manifest.port.ratio;

    this.regX = this.width / 2;
    this.regY = this.height / 2;

    this.draw_box();
    this.draw_name();

    if (options.show_message_type) {
        this.draw_message_type();
    }

    this.canvas.stage.update();
};

Port.prototype.draw_box = function() {
    this.port_box = new Square({
        canvas: this.canvas,
        fillColor: this.fillColor,
        width: this.width,
        height: this.height
    });
    this.addChild(this.port_box);
}

Port.prototype.draw_name = function() {

    var text_style = this.font_size.toString() + "px Arial";
    this.port_name = new createjs.Text(this.id, text_style, this.text_color);
    this.port_name.textBaseline = "top";

    this.port_name.y = 2;
    this.port_name.x = this.width / 2;
    this.port_name.regX = this.port_name.getBounds().width / 2;

    this.addChild(this.port_name);
};

Port.prototype.draw_message_type = function() {

    var text_style = this.font_size.toString() + "px Arial";
    this.port_message_type = new createjs.Text(this.message_type, text_style, this.text_color);
    this.port_message_type.textBaseline = "bottom";

    this.port_message_type.y = this.height - 2;
    this.port_message_type.x = this.width / 2;
    this.port_message_type.regX = this.port_message_type.getBounds().width / 2;


    this.addChild(this.port_message_type);
};