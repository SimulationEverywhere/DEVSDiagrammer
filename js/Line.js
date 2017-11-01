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

    this.holded = false;
    this.node_epsilon = manifest.link.node_epsilon;
    this.epsilon = manifest.link.epsilon;
    this.margin = manifest.link.margin;

    this.check_min_values();
    this.update();

    this.addEventListener("mousedown", this.hold.bind(this));
    this.addEventListener("pressmove", this.move.bind(this));
    this.addEventListener("pressup", this.release.bind(this));
};

Line.prototype.update = function() {

    this.graphics = new createjs.Graphics();
    this.draw_line(this.graphics, this.width);
    this.hitArea = new createjs.Shape();
    this.hitArea.graphics = new createjs.Graphics();
    this.draw_line(this.hitArea.graphics, this.width + this.margin);
    this.canvas.stage.update();
};

Line.prototype.draw_line = function(graphic, width) {
    var i;

    graphic.setStrokeStyle(width);
    graphic.beginStroke(this.color);

    graphic.moveTo(this.nodes[0].x, this.nodes[0].y);
    for (i = 1; i < this.nodes.length; ++i) {
        graphic.lineTo(this.nodes[i].x, this.nodes[i].y);
    }
};

Line.prototype.check_min_values = function() {
    this.width = Math.max(this.width, 1);
};

Line.prototype.get_node = function(evt) {
    var i;

    for(i = 0; i < this.nodes.length; ++i) {
        
        if (this.is_over_node(this.nodes[i], evt)) {
            return this.nodes[i];
        }
    }

    return null;
};

Line.prototype.distance = function(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

Line.prototype.is_over_node = function (node, evt) {
    return this.distance(evt, node) < this.margin + this.node_epsilon;
};

Line.prototype.is_between = function(a, b, c) {
    var distanceByC = this.distance(a, c) + this.distance(c, b);
    return Math.abs(distanceByC - this.distance(a, b)) < this.margin + this.epsilon;
};

Line.prototype.get_new_node_index = function(node) {
    var i;

    for (i = 1; i < this.nodes.length; i++) {
        if (this.is_between(this.nodes[i - 1], this.nodes[i], node)) {
            return i;
        }
    }
};

Line.prototype.hold = function(evt) {
    var local_position, node, index;
    evt.stopImmediatePropagation();

    if (!this.holded) {
        this.holded = true;

        local_position = this.globalToLocal(evt.stageX, evt.stageY);
        node = this.get_node(local_position);
        
        if (node !== null) {

            this.holded_node = node;
        } else {

            this.holded_node = local_position;
            index = this.get_new_node_index(this.holded_node);
            this.nodes.splice(index, 0, this.holded_node);
        }
    }
};

Line.prototype.move = function(evt) {
    evt.stopImmediatePropagation();
    if (this.holded) {
        this.update_position(evt);
    }
};

Line.prototype.release = function(evt) {
    evt.stopImmediatePropagation();
    if(this.holded) {
        this.holded = false;
        this.merge_nodes();
        this.update_position(evt);
    }
};

Line.prototype.update_position = function(evt) {
    var local_position = this.globalToLocal(evt.stageX, evt.stageY);
    this.holded_node.x = local_position.x;
    this.holded_node.y = local_position.y;
    this.update();
};

Line.prototype.merge_nodes = function() {
    var i = 1;
    while (i < this.nodes.length) {
        if (this.distance(this.nodes[i - 1], this.nodes[i]) < this.node_epsilon + this.margin) {
            this.nodes.splice(i, 1);
        } else {
            i++;
        }
    }
};