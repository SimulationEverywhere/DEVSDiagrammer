/*exported relaxed_khan */
"use strict";

/**
 * Sorts a graph in topologically, if this is not posible due to cycles, the 
 * sort is made minimizing the amount of egdes violating the topological rule.
 * 
 * @param  {model: string, neigghbors: [string]} graph - A graph represented as adjacency lists where model is the node.
 * @return {[model]} A list of the models (nodes) sorted
 */
function relaxed_khan(graph) {
	var L, n;

	graph = copy(graph); // in order to not modify the original grap
	L = [];
	while (graph.length > 0) {
		graph.sort(degree_comparator.bind(degree_comparator, copy(graph)));
		n = graph.splice(0,1)[0];
		L.push(n);
	}

	return separate_in_columns(L);
}

function degree_comparator(graph, a, b) {
	return in_degree(graph, a) - in_degree(graph, b); 
}

function copy(graph) {
	var copied = [];
	for (var i = 0; i < graph.length; i++) { copied.push(graph[i]); }
	return copied; 
}

function in_degree(graph, node) {
	var degree, i, j, neighbors;

	degree = 0;
	for (i = 0; i < graph.length; i++) {
		neighbors = graph[i].neighbors;
		for (j = 0; j < neighbors.length; j++) {
			if (neighbors[j] === node.model) {
				degree++;
			}
		}
	}
	return degree;
}

function separate_in_columns(sorted_graph) {
	var i, res, neighbors, node;

	res = [[sorted_graph[0].model]];
	neighbors = sorted_graph[0].neighbors;

	for(i = 1; i < sorted_graph.length; i++) {
		
		node = sorted_graph[i];
		if(neighbors.indexOf(node.model) === -1) { // if is no neighbor it can be placed in the same column
			neighbors.concat(node.neighbors);
			res[res.length - 1].push(node.model);
		} else { // if is a neighbor, a new column must start
			res.push([node.model]);
			neighbors = node.neighbors;
		}
	}

	return res;
}
