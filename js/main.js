/*global Canvas */
/*exported main, canvas */
"use strict";

var canvas = [];

function main() {
    canvas.push(new Canvas({
        canvasId: "#stageCanvas",
        structure_input_id: "#model_structure",
    }));
}