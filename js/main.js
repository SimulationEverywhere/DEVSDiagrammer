/*global $, Canvas */
/*exported main, canvas, remove_namespaces */
"use strict";

var canvas = [];

var selected_structures = [];
var selected_for_removal = [];

function remove_selected_top_models() {
	for(var i=0; i < selected_for_removal.length; i++) {
		selected_for_removal[i].canvas.dom_canvas.remove();
	}

	selected_for_removal = [];
	selected_structures = [];
}

function expand_selected_structures() {
	
	for(var i=0; i < selected_structures.length; i++) {
		new_model(selected_structures[i]);
	}

	selected_for_removal = [];
	selected_structures = [];
}

function new_model(structure) {
	canvas.push(new Canvas({ structure: structure }));
}

function new_input_model() {
    canvas.push(new Canvas({
        structure_input_id: "#model_structure",
    }));
}

$(window).keydown(function (e) {

  if (e.keyCode === 13) { // enter expands
  	expand_selected_structures();  
  } else if (e.keyCode === 46) { // suppr removes top models
  	remove_selected_top_models();
  }
});