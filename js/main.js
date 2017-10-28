/*global createjs, $ */
/*exported main, canvas */
"use strict";

var canvas = {
    stage: null,
    subStage: null,
    stageWidth: null,
    stageHeight: null
};

function main() {
    var dom_canvas = $("#stageCanvas");

    canvas.stage = new createjs.Stage(dom_canvas.get(0));
    canvas.subStage = new createjs.Container();
    canvas.stage.addChild(canvas.subStage);

    canvas.stageWidth  = dom_canvas.width();
    canvas.stageHeight = dom_canvas.height();
}