	__nest__ (
		__all__,
		'devtools_monitor', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					'Library handling DevTools websocket interaction.\n';
					var file_dir = os.path.dirname (__file__);
					sys.path.append (os.path.join (file_dir, '..', '..', 'perf'));
					var DEFAULT_TIMEOUT_SECONDS = 10;
					var _WEBSOCKET_TIMEOUT_SECONDS = 10;
					var DevToolsConnectionException = __class__ ('DevToolsConnectionException', [Exception], {
						get __init__ () {return __get__ (this, function (self, message) {
							super (DevToolsConnectionException, self).__init__ (message);
							logging.warning ('DevToolsConnectionException: ' + message);
						});}
					});
					var _StreamReader = __class__ ('_StreamReader', [object], {
						get __init__ () {return __get__ (this, function (self, inspector, stream_handle) {
							self._inspector_websocket = inspector;
							self._handle = stream_handle;
							self._callback = null;
							self._data = null;
						});},
						get Read () {return __get__ (this, function (self, callback) {
							!(self._callback);
							self._data = list ([]);
							self._callback = callback;
							self._ReadChunkFromStream ();
							self._ReadChunkFromStream ();
						});},
						get _ReadChunkFromStream () {return __get__ (this, function (self) {
							var req = dict ({'method': 'IO.read', 'params': dict ({'handle': self._handle, 'size': 32768})});
							self._inspector_websocket.AsyncRequest (req, self._GotChunkFromStream);
						});},
						get _GotChunkFromStream () {return __get__ (this, function (self, response) {
							if (self._data === null) {
								return ;
							}
							if (__in__ ('error', response)) {
								__except__ = DevToolsConnectionException ('Reading trace failed: %s' % response ['error'] ['message']);
								__except__.__cause__ = null;
								throw __except__;
							}
							var result = response ['result'];
							self._data.append (result ['data']);
							if (!(result.get ('eof', false))) {
								self._ReadChunkFromStream ();
								return ;
							}
							var req = dict ({'method': 'IO.close', 'params': dict ({'handle': self._handle})});
							self._inspector_websocket.SendAndIgnoreResponse (req);
							var trace_string = ''.join (self._data);
							self._data = null;
							self._callback (trace_string);
						});}
					});
					var DevToolsConnection = __class__ ('DevToolsConnection', [object], {
						get __init__ () {return __get__ (this, function (self, hostname, port) {
							'Initializes the connection with a DevTools server.\n\n    Args:\n      hostname: server hostname.\n      port: port number.\n    ';
							self._http_hostname = hostname;
							self._http_port = port;
							self._event_listeners = dict ({});
							self._domain_listeners = dict ({});
							self._scoped_states = dict ({});
							self._domains_to_enable = set ();
							self._tearing_down_tracing = false;
							self._please_stop = false;
							self._ws = null;
							self._target_descriptor = null;
							self._Connect ();
						});},
						get RegisterListener () {return __get__ (this, function (self, name, listener) {
							'Registers a listener for an event.\n\n    Also takes care of enabling the relevant domain before starting monitoring.\n\n    Args:\n      name: (str) Domain or event the listener wants to listen to, e.g.\n            "Network.requestWillBeSent" or "Tracing".\n      listener: (Listener) listener instance.\n    ';
							if (__in__ ('.', name)) {
								var domain = name.__getslice__ (0, name.index ('.'), 1);
								self._event_listeners [name] = listener;
							}
							else {
								var domain = name;
								self._domain_listeners [domain] = listener;
							}
							self._domains_to_enable.add (domain);
						});},
						get UnregisterListener () {return __get__ (this, function (self, listener) {
							'Unregisters a listener.\n\n    Args:\n      listener: (Listener) listener to unregister.\n    ';
							var py_keys = function () {
								var __accu0__ = [];
								var __iter0__ = self._event_listeners;
								for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
									var __left0__ = __iter0__ [__index0__];
									var k = __left0__ [0];
									var l = __left0__ [1];
									if (l === listener) {
										__accu0__.append (k);
									}
								}
								return __accu0__;
							} () + function () {
								var __accu0__ = [];
								var __iter0__ = self._domain_listeners;
								for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
									var __left0__ = __iter0__ [__index0__];
									var k = __left0__ [0];
									var l = __left0__ [1];
									if (l === listener) {
										__accu0__.append (k);
									}
								}
								return __accu0__;
							} ();
							py_keys'Removing non-existent listener';
							var __iter0__ = py_keys;
							for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
								var key = __iter0__ [__index0__];
								if (__in__ (key, self._event_listeners)) {
									delete self._event_listeners [key];
								}
								if (__in__ (key, self._domain_listeners)) {
									delete self._domain_listeners [key];
								}
							}
						});},
						get SetScopedState () {return __get__ (this, function (self, method, params, default_params, enable_domain) {
							'Changes state at the beginning the monitoring and resets it at the end.\n\n    |method| is called with |params| at the beginning of the monitoring. After\n    the monitoring completes, the state is reset by calling |method| with\n    |default_params|.\n\n    Args:\n      method: (str) Method.\n      params: (dict) Parameters to set when the monitoring starts.\n      default_params: (dict) Parameters to reset the state at the end.\n      enable_domain: (bool) True if enabling the domain is required.\n    ';
							if (enable_domain) {
								if (__in__ ('.', method)) {
									var domain = method.__getslice__ (0, method.index ('.'), 1);
									domain'No valid domain';
									self._domains_to_enable.add (domain);
								}
							}
							var scoped_state_value = tuple ([params, default_params]);
							if (self._scoped_states.has_key (method)) {
								self._scoped_states [method] == scoped_state_value;
							}
							else {
								self._scoped_states [method] = scoped_state_value;
							}
						});},
						get SyncRequest () {return __get__ (this, function (self, method, params) {
							if (typeof params == 'undefined' || (params != null && params .__class__ == __kwargdict__)) {;
								var params = null;
							};
							'Issues a synchronous request to the DevTools server.\n\n    Args:\n      method: (str) Method.\n      params: (dict) Optional parameters to the request.\n\n    Returns:\n      The answer.\n    ';
							var request = dict ({'method': method});
							if (params) {
								request ['params'] = params;
							}
							return self._ws.SyncRequest (request, __kwargdict__ ({timeout: _WEBSOCKET_TIMEOUT_SECONDS}));
						});},
						get SendAndIgnoreResponse () {return __get__ (this, function (self, method, params) {
							if (typeof params == 'undefined' || (params != null && params .__class__ == __kwargdict__)) {;
								var params = null;
							};
							'Issues a request to the DevTools server, do not wait for the response.\n\n    Args:\n      method: (str) Method.\n      params: (dict) Optional parameters to the request.\n    ';
							var request = dict ({'method': method});
							if (params) {
								request ['params'] = params;
							}
							self._ws.SendAndIgnoreResponse (request);
						});},
						get SyncRequestNoResponse () {return __get__ (this, function (self, method, params) {
							if (typeof params == 'undefined' || (params != null && params .__class__ == __kwargdict__)) {;
								var params = null;
							};
							'As SyncRequest, but asserts that no meaningful response was received.\n\n    Args:\n      method: (str) Method.\n      params: (dict) Optional parameters to the request.\n    ';
							var result = self.SyncRequest (method, params);
							if (__in__ ('error', result) || __in__ ('result', result) && result ['result']) {
								__except__ = DevToolsConnectionException ('Unexpected response for %s: %s' % tuple ([method, result]));
								__except__.__cause__ = null;
								throw __except__;
							}
						});},
						get ClearCache () {return __get__ (this, function (self) {
							'Clears buffer cache.\n\n    Will assert that the browser supports cache clearing.\n    ';
							var res = self.SyncRequest ('Network.canClearBrowserCache');
							res ['result']'Cache clearing is not supported by this browser.';
							self.SyncRequest ('Network.clearBrowserCache');
						});},
						get MonitorUrl () {return __get__ (this, function (self, url, timeout_seconds) {
							if (typeof timeout_seconds == 'undefined' || (timeout_seconds != null && timeout_seconds .__class__ == __kwargdict__)) {;
								var timeout_seconds = DEFAULT_TIMEOUT_SECONDS;
							};
							'Navigate to url and dispatch monitoring loop.\n\n    Unless you have registered a listener that will call StopMonitoring, this\n    will run until timeout from chrome.\n\n    Args:\n      url: (str) a URL to navigate to before starting monitoring loop.      timeout_seconds: timeout in seconds for monitoring loop.\n    ';
							var __iter0__ = self._domains_to_enable;
							for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
								var domain = __iter0__ [__index0__];
								self._ws.RegisterDomain (domain, self._OnDataReceived);
								if (domain != self.TRACING_DOMAIN) {
									self.SyncRequestNoResponse ('%s.enable' % domain);
								}
							}
							var __iter0__ = self._scoped_states;
							for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
								var scoped_state = __iter0__ [__index0__];
								self.SyncRequestNoResponse (scoped_state, self._scoped_states [scoped_state] [0]);
							}
							self._tearing_down_tracing = false;
							self.SendAndIgnoreResponse ('Page.navigate', dict ({'url': url}));
							self._Dispatch (__kwargdict__ ({timeout: timeout_seconds}));
							self._TearDownMonitoring ();
						});},
						get StopMonitoring () {return __get__ (this, function (self) {
							'Stops the monitoring.';
							self._please_stop = true;
						});},
						get ExecuteJavaScript () {return __get__ (this, function (self, expression) {
							'Run JavaScript expression.\n\n    Args:\n      expression: JavaScript expression to run.\n\n    Returns:\n      The return value from the JavaScript expression.\n    ';
							var response = self.SyncRequest ('Runtime.evaluate', dict ({'expression': expression, 'returnByValue': true}));
							if (__in__ ('error', response)) {
								__except__ = Exception (response ['error'] ['message']);
								__except__.__cause__ = null;
								throw __except__;
							}
							if (__in__ ('wasThrown', response ['result']) && response ['result'] ['wasThrown']) {
								__except__ = Exception (response ['error'] ['result'] ['description']);
								__except__.__cause__ = null;
								throw __except__;
							}
							if (response ['result'] ['result'] ['type'] == 'undefined') {
								return null;
							}
							return response ['result'] ['result'] ['value'];
						});},
						get PollForJavaScriptExpression () {return __get__ (this, function (self, expression, interval) {
							'Wait until JavaScript expression is true.\n\n    Args:\n      expression: JavaScript expression to run.\n      interval: Period between expression evaluation in seconds.\n    ';
							common_util.PollFor ((function __lambda__ () {
								return bool (self.ExecuteJavaScript (expression));}), 'JavaScript: {}'.format (expression), interval);
						});},
						get Close () {return __get__ (this, function (self) {
							'Cleanly close chrome by closing the only tab.';
							self._ws;
							var response = self._HttpRequest ('/close/' + self._target_descriptor ['id']);
							response == 'Target is closing';
							self._ws = null;
						});},
						get _Dispatch () {return __get__ (this, function (self, timeout, kind) {
							if (typeof kind == 'undefined' || (kind != null && kind .__class__ == __kwargdict__)) {;
								var kind = 'Monitoring';
							};
							self._please_stop = false;
							while (!(self._please_stop)) {
								try {
									self._ws.DispatchNotifications (__kwargdict__ ({timeout: timeout}));
								}
								catch (__except__) {
									if (isinstance (__except__, websocket.WebSocketTimeoutException)) {
										break;
									}
								}
							}
							if (!(self._please_stop)) {
								logging.warning ('%s stopped on a timeout.' % kind);
							}
						});},
						get _TearDownMonitoring () {return __get__ (this, function (self) {
							if (__in__ (self.TRACING_DOMAIN, self._domains_to_enable)) {
								logging.info ('Fetching tracing');
								self.SyncRequestNoResponse (self.TRACING_END_METHOD);
								self._tearing_down_tracing = true;
								self._Dispatch (__kwargdict__ ({timeout: self.TRACING_TIMEOUT, kind: 'Tracing'}));
							}
							var __iter0__ = self._scoped_states;
							for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
								var scoped_state = __iter0__ [__index0__];
								self.SyncRequestNoResponse (scoped_state, self._scoped_states [scoped_state] [1]);
							}
							var __iter0__ = self._domains_to_enable;
							for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
								var domain = __iter0__ [__index0__];
								if (domain != self.TRACING_DOMAIN) {
									self.SyncRequest ('%s.disable' % domain);
								}
								self._ws.UnregisterDomain (domain);
							}
							self._domains_to_enable.clear ();
							self._domain_listeners.clear ();
							self._event_listeners.clear ();
							self._scoped_states.clear ();
						});},
						get _OnDataReceived () {return __get__ (this, function (self, msg) {
							if (!__in__ ('method', msg)) {
								__except__ = DevToolsConnectionException ('Malformed message: %s' % msg);
								__except__.__cause__ = null;
								throw __except__;
							}
							var method = msg ['method'];
							var domain = method.__getslice__ (0, method.index ('.'), 1);
							if (self._tearing_down_tracing && method == self.TRACING_STREAM_EVENT) {
								var stream_handle = msg.get ('params', dict ({})).get ('stream');
								if (!(stream_handle)) {
									self._tearing_down_tracing = false;
									self.StopMonitoring ();
								}
								else {
									_StreamReader (self._ws, stream_handle).Read (self._TracingStreamDone);
									return ;
								}
							}
							if (!__in__ (method, self._event_listeners) && !__in__ (domain, self._domain_listeners)) {
								return ;
							}
							if (__in__ (method, self._event_listeners)) {
								self._event_listeners [method].Handle (method, msg);
							}
							if (__in__ (domain, self._domain_listeners)) {
								self._domain_listeners [domain].Handle (method, msg);
							}
							if (self._tearing_down_tracing && method == self.TRACING_DONE_EVENT) {
								self._tearing_down_tracing = false;
								self.StopMonitoring ();
							}
						});},
						get _TracingStreamDone () {return __get__ (this, function (self, data) {
							var tracing_events = json.loads (data);
							var __iter0__ = tracing_events;
							for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
								var evt = __iter0__ [__index0__];
								self._OnDataReceived (dict ({'method': self.TRACING_DATA_METHOD, 'params': dict ({'value': list ([evt])})}));
								if (self._please_stop) {
									break;
								}
							}
							self._tearing_down_tracing = false;
							self.StopMonitoring ();
						});},
						get _HttpRequest () {return __get__ (this, function (self, path) {
							path [0] == '/';
							var r = httplib.HTTPConnection (self._http_hostname, self._http_port);
							try {
								r.request ('GET', '/json' + path);
								var response = r.getresponse ();
								if (response.status != 200) {
									__except__ = DevToolsConnectionException ('Cannot connect to DevTools, reponse code %d' % response.status);
									__except__.__cause__ = null;
									throw __except__;
								}
								var raw_response = response.read ();
							}
							catch (__except__) {
							}
							finally {r.close ();
							}
							return raw_response;
						});},
						get _Connect () {return __get__ (this, function (self) {
							!(self._ws);
							!(self._target_descriptor);
							var __iter0__ = json.loads (self._HttpRequest ('/list'));
							for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
								var target_descriptor = __iter0__ [__index0__];
								if (target_descriptor ['type'] == 'page') {
									self._target_descriptor = target_descriptor;
									break;
								}
							}
							self._target_descriptor ['url'] == 'about:blank';
							self._ws = inspector_websocket.InspectorWebsocket ();
							self._ws.Connect (self._target_descriptor ['webSocketDebuggerUrl'], __kwargdict__ ({timeout: _WEBSOCKET_TIMEOUT_SECONDS}));
						});}
					});
					DevToolsConnection.TRACING_DOMAIN = 'Tracing';
					DevToolsConnection.TRACING_END_METHOD = 'Tracing.end';
					DevToolsConnection.TRACING_DATA_METHOD = 'Tracing.dataCollected';
					DevToolsConnection.TRACING_DONE_EVENT = 'Tracing.tracingComplete';
					DevToolsConnection.TRACING_STREAM_EVENT = 'Tracing.tracingComplete';
					DevToolsConnection.TRACING_TIMEOUT = 300;
					var Listener = __class__ ('Listener', [object], {
						get __init__ () {return __get__ (this, function (self, connection) {
							'Initializes a Listener instance.\n\n    Args:\n      connection: (DevToolsConnection).\n    ';
							// pass;
						});},
						get Handle () {return __get__ (this, function (self, method, msg) {
							'Handles an event this instance listens for.\n\n    Args:\n      event_name: (str) Event name, as registered.\n      event: (dict) complete event.\n    ';
							__except__ = NotImplementedError;
							__except__.__cause__ = null;
							throw __except__;
						});}
					});
					var Track = __class__ ('Track', [Listener], {
						get GetEvents () {return __get__ (this, function (self) {
							'Returns a list of collected events, finalizing the state if necessary.';
							__except__ = NotImplementedError;
							__except__.__cause__ = null;
							throw __except__;
						});},
						get ToJsonDict () {return __get__ (this, function (self) {
							'Serializes to a dictionary, to be dumped as JSON.\n\n    Returns:\n      A dict that can be dumped by the json module, and loaded by\n      FromJsonDict().\n    ';
							__except__ = NotImplementedError;
							__except__.__cause__ = null;
							throw __except__;
						});},
						get FromJsonDict () {return __get__ (this, function (cls, _json_dict) {
							'Returns a Track instance constructed from data dumped by\n       Track.ToJsonDict().\n\n    Args:\n      json_data: (dict) Parsed from a JSON file using the json module.\n\n    Returns:\n      a Track instance.\n    ';
							false;
						});}
					});
					__pragma__ ('<all>')
						__all__.DEFAULT_TIMEOUT_SECONDS = DEFAULT_TIMEOUT_SECONDS;
						__all__.DevToolsConnection = DevToolsConnection;
						__all__.DevToolsConnectionException = DevToolsConnectionException;
						__all__.Listener = Listener;
						__all__.Track = Track;
						__all__._StreamReader = _StreamReader;
						__all__._WEBSOCKET_TIMEOUT_SECONDS = _WEBSOCKET_TIMEOUT_SECONDS;
						__all__.file_dir = file_dir;
					__pragma__ ('</all>')
				}
			}
		}
	);
