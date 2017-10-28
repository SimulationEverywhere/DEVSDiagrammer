/*global createjs, $ */
/*exported coupled */

"use strict";
function coupled(parameters) {
    /*jshint validthis:true */
    this.initialize(parameters);
}

coupled.prototype = new createjs.Container();
coupled.prototype.ContainerInitialize = coupled.prototype.initialize;
coupled.prototype.ContainerTick = coupled.prototype._tick;

coupled.prototype = {

    initialize : function(parameters) {
        this.ContainerInitialize();

        /********** Default values **************/
        this.is_top = false;
        this.port = [];
        this.EIC = [];
        this.IC = [];
        this.EOC = [];

        $.extend(true, this, parameters);
    },

    expand : function() {},

    contract : function() {},

    expandInNewCanvas : function() {},

    destroy : function() {
        if (!this.is_top) { return; }
    }
};