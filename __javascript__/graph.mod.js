	(function () {
		'Support for graphs.';
		var Node = __class__ ('Node', [object], {
			get __init__ () {return __get__ (this, function (self) {
				'Create a new node.';
				self.cost = 0;
			});},
			get ToJsonDict () {return __get__ (this, function (self) {
				return common_util.SerializeAttributesToJsonDict (dict ({}), self, list (['cost']));
			});},
			get FromJsonDict () {return __get__ (this, function (cls, json_dict) {
				return common_util.DeserializeAttributesFromJsonDict (json_dict, cls (), list (['cost']));
			});}
		});
		var Edge = __class__ ('Edge', [object], {
			get __init__ () {return __get__ (this, function (self, from_node, to_node) {
				'Creates an Edge.\n\n    Args:\n      from_node: (Node) Start node.\n      to_node: (Node) End node.\n    ';
				self.from_node = from_node;
				self.to_node = to_node;
				self.cost = 0;
			});},
			get ToJsonDict () {return __get__ (this, function (self) {
				return common_util.SerializeAttributesToJsonDict (dict ({}), self, list (['from_node', 'to_node', 'cost']));
			});},
			get FromJsonDict () {return __get__ (this, function (cls, json_dict) {
				var result = cls (null, null);
				return common_util.DeserializeAttributesFromJsonDict (json_dict, result, list (['from_node', 'to_node', 'cost']));
			});}
		});
		var DirectedGraph = __class__ ('DirectedGraph', [object], {
			get __init__ () {return __get__ (this, function (self, nodes, edges) {
				'Builds a graph from a set of node and edges.\n\n    Note that the edges referencing a node not in the provided list are dropped.\n\n    Args:\n      nodes: ([Node]) Sequence of Nodes.\n      edges: ([Edge]) Sequence of Edges.\n    ';
				self._nodes = set (nodes);
				self._edges = set (filter ((function __lambda__ (e) {
					return __in__ (e.from_node, self._nodes) && __in__ (e.to_node, self._nodes);}), edges));
				all (isinstance (node, Node)nodeself._nodes);
				all (isinstance (edge, Edge)edgeself._edges);
				self._in_edges = function () {
					var __accu0__ = [];
					var __iter0__ = self._nodes;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var n = __iter0__ [__index0__];
						__accu0__.append (list ([n, list ([])]));
					}
					return dict (__accu0__);
				} ();
				self._out_edges = function () {
					var __accu0__ = [];
					var __iter0__ = self._nodes;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var n = __iter0__ [__index0__];
						__accu0__.append (list ([n, list ([])]));
					}
					return dict (__accu0__);
				} ();
				var __iter0__ = self._edges;
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var edge = __iter0__ [__index0__];
					self._out_edges [edge.from_node].append (edge);
					self._in_edges [edge.to_node].append (edge);
				}
			});},
			get OutEdges () {return __get__ (this, function (self, node) {
				'Returns a list of edges starting from a node.\n    ';
				return self._out_edges [node];
			});},
			get InEdges () {return __get__ (this, function (self, node) {
				'Returns a list of edges ending at a node.';
				return self._in_edges [node];
			});},
			get Nodes () {return __get__ (this, function (self) {
				'Returns the set of nodes of this graph.';
				return self._nodes;
			});},
			get Edges () {return __get__ (this, function (self) {
				'Returns the set of edges of this graph.';
				return self._edges;
			});},
			get RootNodes () {return __get__ (this, function (self) {
				'Returns an iterable of nodes that have no incoming edges.';
				return filter ((function __lambda__ (n) {
					return !(self.InEdges (n));}), self._nodes);
			});},
			get UpdateEdge () {return __get__ (this, function (self, edge, new_from_node, new_to_node) {
				'Updates an edge.\n\n    Args:\n      edge:\n      new_from_node:\n      new_to_node:\n    ';
				__in__ (edge, self._edges);
				__in__ (new_from_node, self._nodes);
				__in__ (new_to_node, self._nodes);
				self._in_edges [edge.to_node].remove (edge);
				self._out_edges [edge.from_node].remove (edge);
				edge.from_node = new_from_node;
				edge.to_node = new_to_node;
				self._in_edges [edge.to_node].append (edge);
				self._out_edges [edge.from_node].append (edge);
			});},
			get TopologicalSort () {return __get__ (this, function (self, roots) {
				if (typeof roots == 'undefined' || (roots != null && roots .__class__ == __kwargdict__)) {;
					var roots = null;
				};
				'Returns a list of nodes, in topological order.\n\n      Args:\n        roots: ([Node]) If set, the topological sort will only consider nodes\n                        reachable from this list of sources.\n    ';
				var sorted_nodes = list ([]);
				if (roots === null) {
					var nodes_subset = self._nodes;
				}
				else {
					var nodes_subset = self.ReachableNodes (roots);
				}
				var remaining_in_edges = function () {
					var __accu0__ = [];
					var __iter0__ = nodes_subset;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var n = __iter0__ [__index0__];
						__accu0__.append (list ([n, 0]));
					}
					return dict (__accu0__);
				} ();
				var __iter0__ = self._edges;
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var edge = __iter0__ [__index0__];
					if (__in__ (edge.from_node, nodes_subset) && __in__ (edge.to_node, nodes_subset)) {
						remaining_in_edges [edge.to_node]++;
					}
				}
				var sources = function () {
					var __accu0__ = [];
					var __iter0__ = remaining_in_edges.py_items ();
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var __left0__ = __iter0__ [__index0__];
						var node = __left0__ [0];
						var count = __left0__ [1];
						if (count == 0) {
							__accu0__.append (node);
						}
					}
					return __accu0__;
				} ();
				while (sources) {
					var node = sources.py_pop (0);
					sorted_nodes.append (node);
					var __iter0__ = self.OutEdges (node);
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var e = __iter0__ [__index0__];
						var successor = e.to_node;
						if (!__in__ (successor, nodes_subset)) {
							continue;
						}
						remaining_in_edges [successor] > 0;
						remaining_in_edges [successor]--;
						if (remaining_in_edges [successor] == 0) {
							sources.append (successor);
						}
					}
				}
				return sorted_nodes;
			});},
			get ReachableNodes () {return __get__ (this, function (self, roots, should_stop) {
				if (typeof should_stop == 'undefined' || (should_stop != null && should_stop .__class__ == __kwargdict__)) {;
					var should_stop = (function __lambda__ (n) {
						return false;});
				};
				'Returns a list of nodes from a set of root nodes.\n\n    Args:\n      roots: ([Node]) List of roots to start from.\n      should_stop: (callable) Returns True when a node should stop the\n                   exploration and be skipped.\n    ';
				var visited = set ();
				var fifo = collections.deque (function () {
					var __accu0__ = [];
					var __iter0__ = roots;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var n = __iter0__ [__index0__];
						if (!(should_stop (n))) {
							__accu0__.append (n);
						}
					}
					return __accu0__;
				} ());
				while (len (fifo) != 0) {
					var node = fifo.py_pop ();
					if (should_stop (node)) {
						continue;
					}
					visited.add (node);
					var __iter0__ = self.OutEdges (node);
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var e = __iter0__ [__index0__];
						if (!__in__ (e.to_node, visited) && !(should_stop (e.to_node))) {
							visited.add (e.to_node);
						}
						fifo.appendleft (e.to_node);
					}
				}
				return list (visited);
			});},
			get Cost () {return __get__ (this, function (self, roots, path_list, costs_out) {
				if (typeof roots == 'undefined' || (roots != null && roots .__class__ == __kwargdict__)) {;
					var roots = null;
				};
				if (typeof path_list == 'undefined' || (path_list != null && path_list .__class__ == __kwargdict__)) {;
					var path_list = null;
				};
				if (typeof costs_out == 'undefined' || (costs_out != null && costs_out .__class__ == __kwargdict__)) {;
					var costs_out = null;
				};
				'Compute the cost of the graph.\n\n    Args:\n      roots: ([Node]) If set, only compute the cost of the paths reachable\n             from this list of nodes.\n      path_list: if not None, gets a list of nodes in the longest path.\n      costs_out: if not None, gets a vector of node costs by node.\n\n    Returns:\n      Cost of the longest path.\n    ';
				var costs = function () {
					var __accu0__ = [];
					var __iter0__ = self._nodes;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var n = __iter0__ [__index0__];
						__accu0__.append (list ([n, 0]));
					}
					return dict (__accu0__);
				} ();
				var __iter0__ = self.TopologicalSort (roots);
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var node = __iter0__ [__index0__];
					var cost = 0;
					if (self.InEdges (node)) {
						var cost = max (function () {
							var __accu0__ = [];
							var __iter1__ = self.InEdges (node);
							for (var __index1__ = 0; __index1__ < __iter1__.length; __index1__++) {
								var e = __iter1__ [__index1__];
								__accu0__.append (costs [e.from_node] + e.cost);
							}
							return __accu0__;
						} ());
					}
					costs [node] = cost + node.cost;
				}
				var max_cost = max (costs.values ());
				if (costs_out !== null) {
					delete costs_out.__getslice__ (0, null, 1);
					costs_out.extend (costs);
				}
				max_cost > 0;
				if (path_list !== null) {
					delete path_list.__getslice__ (0, null, 1);
					var node = iiself._nodescosts [i] == max_cost.next ();
					path_list.append (node);
					while (self.InEdges (node)) {
						var predecessors = function () {
							var __accu0__ = [];
							var __iter0__ = self.InEdges (node);
							for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
								var e = __iter0__ [__index0__];
								__accu0__.append (e.from_node);
							}
							return __accu0__;
						} ();
						var node = reduce ((function __lambda__ (costliest_node, next_node) {
							return (costs [next_node] > costs [costliest_node] ? next_node : costliest_node);}), predecessors);
						path_list.insert (0, node);
					}
				}
				return max_cost;
			});},
			get ToJsonDict () {return __get__ (this, function (self) {
				var node_dicts = list ([]);
				var node_to_index = function () {
					var __accu0__ = [];
					var __iter0__ = enumerate (self._nodes);
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var __left0__ = __iter0__ [__index0__];
						var index = __left0__ [0];
						var node = __left0__ [1];
						__accu0__.append (list ([node, index]));
					}
					return dict (__accu0__);
				} ();
				var __iter0__ = node_to_index.py_items ();
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var __left0__ = __iter0__ [__index0__];
					var node = __left0__ [0];
					var index = __left0__ [1];
					var node_dict = node.ToJsonDict ();
					!__in__ (self.__GRAPH_NODE_INDEX, node_dict);
					node_dict.update (dict ([[self.__GRAPH_NODE_INDEX, index]]));
					node_dicts.append (node_dict);
				}
				var edge_dicts = list ([]);
				var __iter0__ = self._edges;
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var edge = __iter0__ [__index0__];
					var edge_dict = edge.ToJsonDict ();
					!__in__ (self.__TO_NODE_INDEX, edge_dict);
					!__in__ (self.__FROM_NODE_INDEX, edge_dict);
					edge_dict.update (dict ([[self.__TO_NODE_INDEX, node_to_index [edge.to_node]], [self.__FROM_NODE_INDEX, node_to_index [edge.from_node]]]));
					edge_dicts.append (edge_dict);
				}
				return dict ({'nodes': node_dicts, 'edges': edge_dicts});
			});},
			get FromJsonDict () {return __get__ (this, function (cls, json_dict, node_class, edge_class) {
				'Returns an instance from a dict.\n\n    Note that the classes of the nodes and edges need to be specified here.\n    This is done to reduce the likelihood of error.\n    ';
				var index_to_node = function () {
					var __accu0__ = [];
					var __iter0__ = json_dict ['nodes'];
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var node_dict = __iter0__ [__index0__];
						__accu0__.append (list ([node_dict [cls.__GRAPH_NODE_INDEX], node_class.FromJsonDict (node_dict)]));
					}
					return dict (__accu0__);
				} ();
				var edges = list ([]);
				var __iter0__ = json_dict ['edges'];
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var edge_dict = __iter0__ [__index0__];
					var edge = edge_class.FromJsonDict (edge_dict);
					edge.from_node = index_to_node [edge_dict [cls.__FROM_NODE_INDEX]];
					edge.to_node = index_to_node [edge_dict [cls.__TO_NODE_INDEX]];
					edges.append (edge);
				}
				var result = DirectedGraph (index_to_node.values (), edges);
				return result;
			});}
		});
		DirectedGraph.__GRAPH_NODE_INDEX = '__graph_node_index';
		DirectedGraph.__TO_NODE_INDEX = '__to_node_index';
		DirectedGraph.__FROM_NODE_INDEX = '__from_node_index';
		__pragma__ ('<all>')
			__all__.DirectedGraph = DirectedGraph;
			__all__.Edge = Edge;
			__all__.Node = Node;
		__pragma__ ('</all>')
	}) ();
