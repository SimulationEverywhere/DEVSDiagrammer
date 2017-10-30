/*global $, Canvas, console */
/*exported main, canvas, new_input_model, update_options */
"use strict";

var canvas = [];

var selected_for_add = [];
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

function expand_selected() {
	
	while (selected_for_add.length > 0) {
		new_model(selected_for_add[0].structure);
		selected_for_add[0].select(evt);
	}
}

function unlink_selected() {
	
	while (selected_for_add.length > 0) {
		selected_for_add[0].remove_links();
		selected_for_add[0].select(evt);
	}
}

function show_submodel_link_selected() {
	
	while (selected_for_add.length > 0) {
		if (!selected_for_add[0].is_top) {
			selected_for_add[0].parent.show_submodel_links(selected_for_add[0]);
		}
		selected_for_add[0].select(evt);
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
	switch(e.keyCode) {
		case 13: expand_selected(); break;  
		case 46: remove_selected_top_models(); break;
		case 49: unlink_selected(); break;
		case 50: show_submodel_link_selected(); break;
	}
});

function update_options() {

	console.log("udate options");
	options.squared_models = $('input[name="squared_models"]:checked').length > 0;
	options.show_message_type = $('input[name="show_message_type"]:checked').length > 0;
}