/*global $, Canvas, console */
/*exported main, canvas, new_input_model, update_options */
"use strict";

var canvas = [];

var selected_structures = [];
var selected_for_removal = [];

var options = {
	squared_models : false,
	show_message_type : false, 
};

var evt = {
	stopImmediatePropagation: function() {}
};

function remove_selected_top_models() {
	
	while (selected_for_removal.length > 0) {
		selected_for_removal[0].canvas.dom_canvas.remove();

		for (var j = 0; j < canvas.length; j++) {
			if (canvas[j].id == selected_for_removal[0].canvas.id) {
				canvas.splice(j, 0);
			}
		}

		selected_for_removal[0].select(evt);		
	}
}

function expand_selected_structures() {
	
	while (selected_structures.length > 0) {
		new_model(selected_structures[0].structure);
		selected_structures[0].select(evt);
	}
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

function update_options() {

	console.log("udate options");
	options.squared_models = $('input[name="squared_models"]:checked').length > 0;
	options.show_message_type = $('input[name="show_message_type"]:checked').length > 0;
}