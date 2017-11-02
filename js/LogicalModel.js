/*global $, Link */
/*exported LogicalModel */
"use strict";

function LogicalModel(parameters) {
    this.initialize(parameters);
}


/**
 * Constructs a new instance of LogicalModel.
 * @param  {Object} parameters - All the necessary parameters to initialize the instance.
 * @param {JSON} parameters.structure - All the structure information related with the formalism, models, EIC, EOC, IC, etc.
 * @param {JSON} parmeters.graphics - All the custom graphic values needed to display the instance as exported.
 */
LogicalModel.prototype.initialize = function(parameters) {

    this.graphics = $.extend(true, {}, LogicalModel.emptyGraphics);
    this.structure = $.extend(true, {}, LogicalModel.emptryStructure);

    $.extend(true, this, parameters);

    this.graphics.id = this.id;
};

LogicalModel.emptyGraphics = {
    id: "",
    models: [],
    ic: [],
    eoc: [],
    eic: []
};

LogicalModel.emptryStructure = {};

LogicalModel.prototype.get_ic_nodes = function(ic) {
    var i;
    for(i = 0; i < this.graphics.ic.length; i++) {
        if (this.same_ic(this.graphics.ic[i], ic)) {
            return this.clone_json(this.graphics.ic[i].nodes);
        }
    }
};

LogicalModel.prototype.get_eic_nodes = function(eic) {
    var i;
    for(i = 0; i < this.graphics.eic.length; i++) {
        if (this.same_eic(this.graphics.eic[i], eic)) {
            return this.clone_json(this.graphics.eic[i].nodes);
        }
    }
};

LogicalModel.prototype.get_eoc_nodes = function(eoc) {
    var i;
    for(i = 0; i < this.graphics.eoc.length; i++) {
        if (this.same_eoc(this.graphics.eoc[i], eoc)) {
            return this.clone_json(this.graphics.eoc[i].nodes);
        }
    }
};

LogicalModel.prototype.save_ic_nodes = function(ic, nodes) {
    var i, nodes_to_save;

    nodes_to_save = this.clone_json(nodes);

    for(i = 0; i < this.graphics.ic.length; i++) {
        if (this.same_ic(this.graphics.ic[i], ic)) {
            this.graphics.ic[i].nodes = nodes_to_save;
            return;
        }
    }

    this.graphics.ic.push($.extend(true, {nodes: nodes_to_save}, ic));
};

LogicalModel.prototype.save_eic_nodes = function(eic, nodes) {
    var i, nodes_to_save;

    nodes_to_save = this.clone_json(nodes);

    for(i = 0; i < this.graphics.eic.length; i++) {
        if (this.same_eic(this.graphics.eic[i], eic)) {
            this.graphics.eic[i].nodes = nodes_to_save;
            return;
        }
    }

    this.graphics.eic.push($.extend(true, {nodes: nodes_to_save}, eic));
};

LogicalModel.prototype.save_eoc_nodes = function(eoc, nodes) {
    var i, nodes_to_save;

    nodes_to_save = this.clone_json(nodes);

    for(i = 0; i < this.graphics.eoc.length; i++) {
        if (this.same_eoc(this.graphics.eoc[i], eoc)) {
            this.graphics.eoc[i].nodes = nodes_to_save;
            return;
        }
    }

    this.graphics.eoc.push($.extend(true, {nodes: nodes_to_save}, eoc));
};

LogicalModel.prototype.same_ic = function(ic_a, ic_b) {
    return  ic_a.from_model == ic_b.from_model &&
            ic_a.from_port == ic_b.from_port &&
            ic_a.to_model == ic_b.to_model &&
            ic_a.to_port == ic_b.to_port;
};

LogicalModel.prototype.same_eic = function(eic_a, eic_b) {
    return  eic_a.from_port == eic_b.from_port &&
            eic_a.to_model == eic_b.to_model &&
            eic_a.to_port == eic_b.to_port;
};

LogicalModel.prototype.same_eoc = function(eoc_a, eoc_b) {
    return  eoc_a.from_model == eoc_b.from_model &&
            eoc_a.from_port == eoc_b.from_port &&
            eoc_a.to_port == eoc_b.to_port;
};

LogicalModel.prototype.clone_json = function(nodes) {
    return JSON.parse(JSON.stringify(nodes));
};

LogicalModel.prototype.add_node_to_link = function(kind, information, node, index) {
    var nodes;

    if (kind === Link.Kind.IC) {
        
        nodes = this.get_ic_nodes(information);
        nodes.splice(index, 0, this.clone_json(node));
        this.save_ic_nodes(information, nodes);
    
    } else if (kind === Link.Kind.EIC) {
    
        nodes = this.get_eic_nodes(information);
        nodes.splice(index, 0, this.clone_json(node));
        this.save_eic_nodes(information, nodes);
    
    } else if (kind === Link.Kind.EOC) {

        nodes = this.get_eoc_nodes(information);
        nodes.splice(index, 0, this.clone_json(node));
        this.save_eoc_nodes(information, nodes);

    }
};

LogicalModel.prototype.update_link_nodes = function(kind, information, nodes) {
    
    if (kind === Link.Kind.IC) {
        this.save_ic_nodes(information, nodes);
    } else if (kind === Link.Kind.EIC) {
        this.save_eic_nodes(information, nodes);
    } else if (kind === Link.Kind.EOC) {
        this.save_eoc_nodes(information, nodes);
    }
};

LogicalModel.prototype.get_submodel = function(model_id) {
    var i, logicalModel;

    for (i = 0; i < this.graphics.models.length; i++) {
        if (this.graphics.models[i].id === model_id) {
            logicalModel = new LogicalModel({ id: model_id });
            // generate aliasing to modify the same logical structure
            logicalModel.graphics = this.graphics.models[i];
            return logicalModel; 
        }
    }

    // if there is no sub model, it creates a new empty
    
    logicalModel = new LogicalModel({ id: model_id });
    this.graphics.models.push(logicalModel.graphics);
    return logicalModel;
};