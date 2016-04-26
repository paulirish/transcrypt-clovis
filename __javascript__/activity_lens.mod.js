	(function () {
		'Gives a picture of the CPU activity between timestamps.\n\nWhen executed as a script, takes a loading trace, and prints the activity\nbreakdown for the request dependencies.\n';
		var ActivityLens = __class__ ('ActivityLens', [object], {
			get __init__ () {return __get__ (this, function (self, trace) {
				'Initializes an instance of ActivityLens.\n\n    Args:\n      trace: (LoadingTrace) loading trace.\n    ';
				self._trace = trace;
				var events = trace.tracing_track.GetEvents ();
				self._renderer_main_pid_tid = self._GetRendererMainThreadId (events);
				self._tracing = self._trace.tracing_track.Filter.apply (null, self._renderer_main_pid_tid);
			});},
			get _GetRendererMainThreadId () {return __get__ (this, function (cls, events) {
				'Returns the most active main renderer thread.\n\n    Several renderers may be running concurrently, but we assume that only one\n    of them is busy during the time covered by the loading trace.. It can be\n    selected by looking at the number of trace events generated.\n\n    Args:\n      events: [tracing.Event] List of trace events.\n\n    Returns:\n      (PID (int), TID (int)) of the busiest renderer main thread.\n    ';
				var events_count_per_pid_tid = collections.defaultdict (int);
				var main_renderer_thread_ids = set ();
				var __iter0__ = events;
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var event = __iter0__ [__index0__];
					var tracing_event = event.tracing_event;
					var pid = event.tracing_event ['pid'];
					var tid = event.tracing_event ['tid'];
					events_count_per_pid_tid.__setitem__ ([pid, tid], events_count_per_pid_tid.__getitem__ ([pid, tid]) + 1);
					if (tracing_event ['cat'] == '__metadata' && tracing_event ['name'] == 'thread_name' && event.args ['name'] == 'CrRendererMain') {
						main_renderer_thread_ids.add (tuple ([pid, tid]));
					}
				}
				var events_count_per_pid_tid = function () {
					var __accu0__ = [];
					var __iter0__ = events_count_per_pid_tid.py_items ();
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var __left0__ = __iter0__ [__index0__];
						var pid_tid = __left0__ [0];
						var count = __left0__ [1];
						if (__in__ (pid_tid, main_renderer_thread_ids)) {
							__accu0__.append (list ([pid_tid, count]));
						}
					}
					return dict (__accu0__);
				} ();
				var pid_tid_events_counts = sorted (events_count_per_pid_tid.py_items (), __kwargdict__ ({key: operator.itemgetter (1), reverse: true}));
				if (len (pid_tid_events_counts) > 1 && pid_tid_events_counts [0] [1] < 2 * pid_tid_events_counts [1] [1]) {
					logging.warning ('Several active renderers (%d and %d with %d and %d events).' % tuple ([pid_tid_events_counts [0] [0] [0], pid_tid_events_counts [1] [0] [0], pid_tid_events_counts [0] [1], pid_tid_events_counts [1] [1]]));
				}
				return pid_tid_events_counts [0] [0];
			});},
			get _OverlappingMainRendererThreadEvents () {return __get__ (this, function (self, start_msec, end_msec) {
				return self._tracing.OverlappingEvents (start_msec, end_msec);
			});},
			get _ClampedDuration () {return __get__ (this, function (cls, event, start_msec, end_msec) {
				return max (0, min (end_msec, event.end_msec) - max (start_msec, event.start_msec));
			});},
			get _ThreadBusyness () {return __get__ (this, function (cls, events, start_msec, end_msec) {
				'Amount of time a thread spent executing from the message loop.';
				var busy_duration = 0;
				var message_loop_events = function () {
					var __accu0__ = [];
					var __iter0__ = events;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var e = __iter0__ [__index0__];
						if (e.tracing_event ['cat'] == 'toplevel' && e.tracing_event ['name'] == 'MessageLoop::RunTask') {
							__accu0__.append (e);
						}
					}
					return __accu0__;
				} ();
				var __iter0__ = message_loop_events;
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var event = __iter0__ [__index0__];
					var clamped_duration = cls._ClampedDuration (event, start_msec, end_msec);
					busy_duration += clamped_duration;
				}
				var interval_msec = end_msec - start_msec;
				busy_duration <= interval_msec;
				return busy_duration;
			});},
			get _ScriptsExecuting () {return __get__ (this, function (cls, events, start_msec, end_msec) {
				"Returns the time during which scripts executed within an interval.\n\n    Args:\n      events: ([tracing.Event]) list of tracing events.\n      start_msec: (float) start time in ms, inclusive.\n      end_msec: (float) end time in ms, inclusive.\n\n    Returns:\n      A dict {URL (str) -> duration_msec (float)}. The dict may have a None key\n      for scripts that aren't associated with a URL.\n    ";
				var script_to_duration = collections.defaultdict (float);
				var script_events = function () {
					var __accu0__ = [];
					var __iter0__ = events;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var e = __iter0__ [__index0__];
						if (__in__ ('devtools.timeline', e.tracing_event ['cat']) && __in__ (e.tracing_event ['name'], cls._SCRIPT_EVENT_NAMES)) {
							__accu0__.append (e);
						}
					}
					return __accu0__;
				} ();
				var __iter0__ = script_events;
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var event = __iter0__ [__index0__];
					var clamped_duration = cls._ClampedDuration (event, start_msec, end_msec);
					var script_url = event.args ['data'].get ('scriptName', null);
					script_to_duration [script_url] += clamped_duration;
				}
				return dict (script_to_duration);
			});},
			get _FullyIncludedEvents () {return __get__ (this, function (cls, events, event) {
				'Return a list of events wholly included in the |event| span.';
				var __left0__ = tuple ([event.start_msec, event.end_msec]);
				var start = __left0__ [0];
				var end = __left0__ [1];
				var result = list ([]);
				var __iter0__ = events;
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var event = __iter0__ [__index0__];
					if ((start <= event.start_msec && event.start_msec < end) && (start <= event.end_msec && event.end_msec < end)) {
						result.append (event);
					}
				}
				return result;
			});},
			get _Parsing () {return __get__ (this, function (cls, events, start_msec, end_msec) {
				"Returns the HTML/CSS parsing time within an interval.\n\n    Args:\n      events: ([tracing.Event]) list of events.\n      start_msec: (float) start time in ms, inclusive.\n      end_msec: (float) end time in ms, inclusive.\n\n    Returns:\n      A dict {URL (str) -> duration_msec (float)}. The dict may have a None key\n      for tasks that aren't associated with a URL.\n    ";
				var url_to_duration = collections.defaultdict (float);
				var parsing_events = function () {
					var __accu0__ = [];
					var __iter0__ = events;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var e = __iter0__ [__index0__];
						if (__in__ ('devtools.timeline', e.tracing_event ['cat']) && __in__ (e.tracing_event ['name'], cls._PARSING_EVENT_NAMES)) {
							__accu0__.append (e);
						}
					}
					return __accu0__;
				} ();
				var __iter0__ = parsing_events;
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var event = __iter0__ [__index0__];
					var nested_events = cls._FullyIncludedEvents (events, event);
					var events_tree = _EventsTree (event, nested_events);
					var js_events = events_tree.DominatingEventsWithNames (cls._SCRIPT_EVENT_NAMES);
					var duration_to_subtract = sum (cls._ClampedDuration (e, start_msec, end_msec)ejs_events);
					var tracing_event = event.tracing_event;
					var clamped_duration = cls._ClampedDuration (event, start_msec, end_msec);
					if (tracing_event ['name'] == 'ParseAuthorStyleSheet') {
						var url = tracing_event ['args'] ['data'] ['styleSheetUrl'];
					}
					else {
						var url = tracing_event ['args'] ['beginData'] ['url'];
					}
					var parsing_duration = clamped_duration - duration_to_subtract;
					parsing_duration >= 0;
					url_to_duration [url] += parsing_duration;
				}
				return dict (url_to_duration);
			});},
			get GenerateEdgeActivity () {return __get__ (this, function (self, dep) {
				"For a dependency between two requests, returns the renderer activity\n    breakdown.\n\n    Args:\n      dep: (Request, Request, str) As returned from\n           RequestDependencyLens.GetRequestDependencies().\n\n    Returns:\n      {'edge_cost': (float) ms, 'busy': (float) ms,\n       'parsing': {'url' -> time_ms}, 'script' -> {'url' -> time_ms}}\n    ";
				var __left0__ = dep;
				var first = __left0__ [0];
				var second = __left0__ [1];
				var reason = __left0__ [2];
				var __left0__ = request_track.IntervalBetween (first, second, reason);
				var start_msec = __left0__ [0];
				var end_msec = __left0__ [1];
				end_msec - start_msec >= 0.0;
				var events = self._OverlappingMainRendererThreadEvents (start_msec, end_msec);
				var result = dict ({'edge_cost': end_msec - start_msec, 'busy': self._ThreadBusyness (events, start_msec, end_msec), 'parsing': self._Parsing (events, start_msec, end_msec), 'script': self._ScriptsExecuting (events, start_msec, end_msec)});
				return result;
			});},
			get BreakdownEdgeActivityByInitiator () {return __get__ (this, function (self, dep) {
				"For a dependency between two requests, categorizes the renderer activity.\n\n    Args:\n      dep: (Request, Request, str) As returned from\n           RequestDependencyLens.GetRequestDependencies().\n\n    Returns:\n      {'script': float, 'parsing': float, 'other_url': float,\n       'unknown_url': float, 'unrelated_work': float}\n      where the values are durations in ms:\n      - idle: The renderer main thread was idle.\n      - script: The initiating file was executing.\n      - parsing: The initiating file was being parsed.\n      - other_url: Other scripts and/or parsing activities.\n      - unknown_url: Activity which is not associated with a URL.\n      - unrelated_work: Activity unrelated to scripts or parsing.\n    ";
				var activity = self.GenerateEdgeActivity (dep);
				var breakdown = dict ({'unrelated_work': activity ['busy'], 'idle': activity ['edge_cost'] - activity ['busy'], 'script': 0, 'parsing': 0, 'other_url': 0, 'unknown_url': 0});
				var __iter0__ = tuple (['script', 'parsing']);
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var kind = __iter0__ [__index0__];
					var __iter1__ = activity [kind].py_items ();
					for (var __index1__ = 0; __index1__ < __iter1__.length; __index1__++) {
						var __left0__ = __iter1__ [__index1__];
						var script_name = __left0__ [0];
						var duration_ms = __left0__ [1];
						if (!(script_name)) {
							breakdown ['unknown_url'] += duration_ms;
						}
						else {
							if (script_name == dep [0].url) {
								breakdown [kind] += duration_ms;
							}
							else {
								breakdown ['other_url'] += duration_ms;
							}
						}
					}
				}
				breakdown ['unrelated_work'] -= sum (breakdown [x]xtuple (['script', 'parsing', 'other_url', 'unknown_url']));
				return breakdown;
			});},
			get MainRendererThreadBusyness () {return __get__ (this, function (self, start_msec, end_msec) {
				'Returns the amount of time the main renderer thread was busy.\n\n    Args:\n      start_msec: (float) Start of the interval.\n      end_msec: (float) End of the interval.\n    ';
				var events = self._OverlappingMainRendererThreadEvents (start_msec, end_msec);
				return self._ThreadBusyness (events, start_msec, end_msec);
			});}
		});
		ActivityLens._SCRIPT_EVENT_NAMES = tuple (['EvaluateScript', 'FunctionCall']);
		ActivityLens._PARSING_EVENT_NAMES = tuple (['ParseHTML', 'ParseAuthorStyleSheet']);
		var _EventsTree = __class__ ('_EventsTree', [object], {
			get __init__ () {return __get__ (this, function (self, root_event, events) {
				'Creates the tree.\n\n    Args:\n      root_event: (Event) Event held by the tree root.\n      events: ([Event]) List of events that are fully included in |root_event|.\n    ';
				self.event = root_event;
				self.start_msec = root_event.start_msec;
				self.end_msec = root_event.end_msec;
				self.children = list ([]);
				events.py_sort (__kwargdict__ ({key: operator.attrgetter ('start_msec')}));
				if (!(events)) {
					return ;
				}
				var current_child = tuple ([events [0], list ([])]);
				var __iter0__ = events.__getslice__ (1, null, 1);
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var event = __iter0__ [__index0__];
					if (event.end_msec < current_child [0].end_msec) {
						current_child [1].append (event);
					}
					else {
						self.children.append (_EventsTree (current_child [0], current_child [1]));
						var current_child = tuple ([event, list ([])]);
					}
				}
				self.children.append (_EventsTree (current_child [0], current_child [1]));
			});},
			get DominatingEventsWithNames () {return __get__ (this, function (self, names) {
				'Returns a list of the top-most events in the tree with a matching name.\n    ';
				if (__in__ (self.event.name, names)) {
					return list ([self.event]);
				}
				else {
					var result = list ([]);
					var __iter0__ = self.children;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var child = __iter0__ [__index0__];
						result += child.DominatingEventsWithNames (names);
					}
					return result;
				}
			});}
		});
		if (__name__ == '__main__') {
			var filename = sys.argv [1];
			var json_dict = json.load (open (filename));
			var loading_trace = loading_trace.LoadingTrace.FromJsonDict (json_dict);
			var activity_lens = ActivityLens (loading_trace);
			var dependencies_lens = request_dependencies_lens.RequestDependencyLens (loading_trace);
			var deps = dependencies_lens.GetRequestDependencies ();
			var __iter0__ = deps;
			for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
				var requests_dep = __iter0__ [__index0__];
				print (activity_lens.GenerateEdgeActivity (requests_dep));
			}
		}
		__pragma__ ('<all>')
			__all__.ActivityLens = ActivityLens;
			__all__._EventsTree = _EventsTree;
			__all__.activity_lens = activity_lens;
			__all__.dependencies_lens = dependencies_lens;
			__all__.deps = deps;
			__all__.filename = filename;
			__all__.json_dict = json_dict;
			__all__.loading_trace = loading_trace;
			__all__.requests_dep = requests_dep;
		__pragma__ ('</all>')
	}) ();
