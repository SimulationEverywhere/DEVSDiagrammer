/*global createjs, $, manifest */
/*exported Link*/
"use strict";

/**
 * @class Link
 * @author Laouen Mayal Louan Belloli
 * 
 * @description Displays a graphical vectorized links represented by a list of nodes in its local 
 * reference space. Each node can be dragged to a new position, and new nodes can be created by 
 * dragging a point witin the link. The new node is placed in between the two adjacents nodes of the
 * link containing the selected point.
 */

function Link(parameters) {
    /*jshint validthis:true */
    this.initialize(parameters);
}

Link.prototype = new createjs.Shape();
Link.prototype.ShapeInitialize = Link.prototype.initialize;
Link.prototype.ContainerTick = Link.prototype._tick;

Link.Kind = { IC: "IC", EIC: "EIC", EOC: "EOC" };

/**
 * Construct a new Link instance
 * @param  {Object} parameters - all the required parameters to construct a new instance.
 * @param {Object} parameters.start_point - the current start point where the link starts.
 * @param {Object} parameters.end_point - the current end point where the link ends.
 * @param {[Object]} parameters.nodes - the sorted list of nodes, a node is an object with attributes x and y.
 * @param {Canvas} parameters.canvas - The canvas where the link belongs to update the stage.
 * @param {String} parameters.color - The link colo in RGB format.
 * @param {Number} parameters.width - The link width in pixels.
 */
Link.prototype.initialize = function(parameters) {
    
    this.ShapeInitialize();
    $.extend(true, this, parameters);

    this.nodes.splice(0, 1, this.start_point);
    this.nodes.splice(this.nodes.length - 1, 1, this.end_point);

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

Link.prototype.update = function() {

    this.graphics = new createjs.Graphics();
    this.draw_link(this.graphics, this.width);
    this.hitArea = new createjs.Shape();
    this.hitArea.graphics = new createjs.Graphics();
    this.draw_link(this.hitArea.graphics, this.width + this.margin);
    this.canvas.stage.update();
};

Link.prototype.draw_link = function(graphic, width) {
    var i;

    graphic.setStrokeStyle(width);
    graphic.beginStroke(this.color);

    graphic.moveTo(this.nodes[0].x, this.nodes[0].y);
    for (i = 1; i < this.nodes.length; ++i) {
        graphic.lineTo(this.nodes[i].x, this.nodes[i].y);
    }
};

Link.prototype.check_min_values = function() {
    this.width = Math.max(this.width, 1);
};

Link.prototype.get_node = function(evt) {
    var i;

    for(i = 0; i < this.nodes.length; ++i) {
        
        if (this.is_over_node(this.nodes[i], evt)) {
            return this.nodes[i];
        }
    }

    return null;
};

Link.prototype.distance = function(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

Link.prototype.is_over_node = function (node, evt) {
    return this.distance(evt, node) < this.margin + this.node_epsilon;
};

Link.prototype.is_between = function(a, b, c) {
    var distanceByC = this.distance(a, c) + this.distance(c, b);
    return Math.abs(distanceByC - this.distance(a, b)) < this.margin + this.epsilon;
};

Link.prototype.get_new_node_index = function(node) {
    var i;

    for (i = 1; i < this.nodes.length; i++) {
        if (this.is_between(this.nodes[i - 1], this.nodes[i], node)) {
            return i;
        }
    }
};

/********* Drag & drop ******************/

Link.prototype.hold = function(evt) {
    var local_position, node;
    evt.stopImmediatePropagation();

    if (!this.holded) {
        this.holded = true;

        local_position = this.globalToLocal(evt.stageX, evt.stageY);
        node = this.get_node(local_position);
        
        if (node !== null) {
            this.holded_node = node;
        } else {
            this.create_node(local_position);
        }
    }
};

Link.prototype.move = function(evt) {
    evt.stopImmediatePropagation();
    if (this.holded) {
        this.update_position(evt);
    }
};

Link.prototype.release = function(evt) {
    evt.stopImmediatePropagation();

    if(this.holded) {
        this.holded = false;
        this.merge_nodes();
        this.update_position(evt);
        this.parent.logicalModel.update_link_nodes(this.kind, this.information, this.nodes);
    }
};

Link.prototype.update_position = function(evt) {
    var local_position = this.globalToLocal(evt.stageX, evt.stageY);
    this.holded_node.x = local_position.x;
    this.holded_node.y = local_position.y;
    this.update();
};

Link.prototype.merge_nodes = function() {
    var i = 1;
    while (i < this.nodes.length) {
        if (this.distance(this.nodes[i - 1], this.nodes[i]) < this.node_epsilon + this.margin) {
            this.nodes.splice(i, 1);
        } else {
            i++;
        }
    }
};

Link.prototype.create_node = function(local_position) {
    var index;

    this.holded_node = local_position;
    index = this.get_new_node_index(this.holded_node);
    this.nodes.splice(index, 0, this.holded_node);

    this.parent.logicalModel.add_node_to_link(this.kind, this.information, this.holded_node, index);
};