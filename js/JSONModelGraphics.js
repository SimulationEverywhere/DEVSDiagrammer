/*global $, Link */
/*exported JSONModelGraphics */
"use strict";

function JSONModelGraphics(parameters) {
    this.initialize(parameters);
}


/**
 * Constructs a new instance of JSONModelGraphics.
 * @param {Object} parameters - All the necessary parameters to initialize the instance.
 * @param {JSON} parameters.structure - All the structure information related with the formalism, models, EIC, EOC, IC, etc.
 * @param {JSON} parmeters.json - All the custom graphic values needed to display the instance as exported.
 */
JSONModelGraphics.prototype.initialize = function(parameters) {

    this.json = $.extend(true, {}, JSONModelGraphics.emptyJSONGraphics);
    $.extend(true, this, parameters);
    this.json.id = this.id;
};

JSONModelGraphics.emptyJSONGraphics = {
    id: "",
    models: [],
    ic: [],
    eoc: [],
    eic: []
};

JSONModelGraphics.prototype.update_model_box = function(model_box) {
    if (this.json.model_box === undefined) {
        this.json.model_box = {};
    }

    $.extend(true, this.json.model_box, model_box);
};

JSONModelGraphics.prototype.get_ic_nodes = function(ic) {
    var i;
    for(i = 0; i < this.json.ic.length; i++) {
        if (this.same_ic(this.json.ic[i], ic)) {
            return this.clone_json(this.json.ic[i].nodes);
        }
    }
};

JSONModelGraphics.prototype.get_eic_nodes = function(eic) {
    var i;
    for(i = 0; i < this.json.eic.length; i++) {
        if (this.same_eic(this.json.eic[i], eic)) {
            return this.clone_json(this.json.eic[i].nodes);
        }
    }
};

JSONModelGraphics.prototype.get_eoc_nodes = function(eoc) {
    var i;
    for(i = 0; i < this.json.eoc.length; i++) {
        if (this.same_eoc(this.json.eoc[i], eoc)) {
            return this.clone_json(this.json.eoc[i].nodes);
        }
    }
};

JSONModelGraphics.prototype.save_ic_nodes = function(ic, nodes) {
    var i, nodes_to_save;

    nodes_to_save = this.clone_json(nodes);

    for(i = 0; i < this.json.ic.length; i++) {
        if (this.same_ic(this.json.ic[i], ic)) {
            this.json.ic[i].nodes = nodes_to_save;
            return;
        }
    }

    this.json.ic.push($.extend(true, {nodes: nodes_to_save}, ic));
};

JSONModelGraphics.prototype.save_eic_nodes = function(eic, nodes) {
    var i, nodes_to_save;

    nodes_to_save = this.clone_json(nodes);

    for(i = 0; i < this.json.eic.length; i++) {
        if (this.same_eic(this.json.eic[i], eic)) {
            this.json.eic[i].nodes = nodes_to_save;
            return;
        }
    }

    this.json.eic.push($.extend(true, {nodes: nodes_to_save}, eic));
};

JSONModelGraphics.prototype.save_eoc_nodes = function(eoc, nodes) {
    var i, nodes_to_save;

    nodes_to_save = this.clone_json(nodes);

    for(i = 0; i < this.json.eoc.length; i++) {
        if (this.same_eoc(this.json.eoc[i], eoc)) {
            this.json.eoc[i].nodes = nodes_to_save;
            return;
        }
    }

    this.json.eoc.push($.extend(true, {nodes: nodes_to_save}, eoc));
};

JSONModelGraphics.prototype.same_ic = function(ic_a, ic_b) {
    return  ic_a.from_model == ic_b.from_model &&
            ic_a.from_port == ic_b.from_port &&
            ic_a.to_model == ic_b.to_model &&
            ic_a.to_port == ic_b.to_port;
};

JSONModelGraphics.prototype.same_eic = function(eic_a, eic_b) {
    return  eic_a.from_port == eic_b.from_port &&
            eic_a.to_model == eic_b.to_model &&
            eic_a.to_port == eic_b.to_port;
};

JSONModelGraphics.prototype.same_eoc = function(eoc_a, eoc_b) {
    return  eoc_a.from_model == eoc_b.from_model &&
            eoc_a.from_port == eoc_b.from_port &&
            eoc_a.to_port == eoc_b.to_port;
};

JSONModelGraphics.prototype.clone_json = function(nodes) {
    
    return JSON.parse(JSON.stringify(nodes));
};

JSONModelGraphics.prototype.add_node_to_link = function(kind, information, node, index) {
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

JSONModelGraphics.prototype.update_link_nodes = function(kind, information, nodes) {
    
    if (kind === Link.Kind.IC) {
        this.save_ic_nodes(information, nodes);
    } else if (kind === Link.Kind.EIC) {
        this.save_eic_nodes(information, nodes);
    } else if (kind === Link.Kind.EOC) {
        this.save_eoc_nodes(information, nodes);
    }
};

JSONModelGraphics.prototype.get_submodel = function(model_id) {
    var i, jsonGraphics;

    for (i = 0; i < this.json.models.length; i++) {
        if (this.json.models[i].id === model_id) {
            jsonGraphics = new JSONModelGraphics({ id: model_id });
            // generate aliasing to modify the same logical structure
            jsonGraphics.json = this.json.models[i];
            return jsonGraphics; 
        }
    }

    // if there is no sub model, it creates a new empty
    
    jsonGraphics = new JSONModelGraphics({ id: model_id });
    this.json.models.push(jsonGraphics.json);
    return jsonGraphics;
};