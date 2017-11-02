/*global $, Canvas, console, JSONModelGraphics */
/*exported main, new_input_model, update_options */
"use strict";

var selected_models = [];

var options = {
	squared_models : false,
	show_message_type : false,
	show_port_name : true,
	compress_in_left : false,
	sort_ports_by_name : true,
};

var evt = {
	stopImmediatePropagation: function() {}
};

function remove_selected_top_models() {
	
	while (selected_models.length > 0) {
		if (selected_models[0].is_top) {
			selected_models[0].canvas.dom_canvas.remove();
		}
		selected_models[0].select(evt);		
	}
}

function expand_in_new_canvas_selected() {
	
	while (selected_models.length > 0) {
		new_model(selected_models[0].structure, selected_models[0].jsonGraphics.json);
		selected_models[0].select(evt);
	}
}

function remove_links_selected() {
	
	while (selected_models.length > 0) {
		selected_models[0].remove_links(false);
		selected_models[0].select(evt);
	}
}

function show_submodel_links_selected() {
	
	while (selected_models.length > 0) {
		if (!selected_models[0].is_top) {
			selected_models[0].parent.show_submodel_links(selected_models[0]);
		}
		selected_models[0].select(evt);
	}
}

function toggle_selected() {
	while (selected_models.length > 0) {
		selected_models[0].toggle();
		selected_models[0].select(evt);
	}
}

function toggle_port_name_selected() {
	while (selected_models.length > 0) {
		selected_models[0].toggle_port_names();
		selected_models[0].select(evt);
	}
}

function new_model(structure, jsonGraphics) {
	new Canvas({
		structure: structure,
		jsonGraphics: new JSONModelGraphics({
			id: jsonGraphics.id,
			json: $.extend(true, {}, jsonGraphics)
		})
	});
}

function new_input_model() {
    new Canvas({ structure_input_id: "#model_structure" });
}

$(window).keydown(function (e) {
	switch(e.keyCode) {
		case 13: expand_in_new_canvas_selected(); break;  
		case 46: remove_selected_top_models(); break;
		case 49: toggle_selected(); break;
		case 50: remove_links_selected(); break;
		case 51: show_submodel_links_selected(); break;
		case 52: toggle_port_name_selected(); break;
	}
});

function update_options() {

	console.log("udate options");
	options.squared_models = $('input[name="squared_models"]:checked').length > 0;
	options.show_message_type = $('input[name="show_message_type"]:checked').length > 0;
	options.show_port_name = $('input[name="show_port_name"]:checked').length > 0;
	options.compress_in_left = $('input[name="compress_in_left"]:checked').length > 0;
	options.sort_ports_by_name = $('input[name="sort_ports_by_name"]:checked').length > 0;
}