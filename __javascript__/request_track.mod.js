	(function () {
		'The request data track.\n\nWhen executed, parses a JSON dump of DevTools messages.\n';
		var Timing = __class__ ('Timing', [object], {
			get __init__ () {return __get__ (this, function (self) {
				'Constructor.\n\n    Initialize with keywords arguments from __slots__.\n    ';
				var __iter0__ = self.__slots__;
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var slot = __iter0__ [__index0__];
					setattr (self, slot, -(1));
				}
				var __iter0__ = kwargs.py_items ();
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var __left0__ = __iter0__ [__index0__];
					var attr = __left0__ [0];
					var value = __left0__ [1];
					setattr (self, attr, value);
				}
			});},
			get __eq__ () {return __get__ (this, function (self, o) {
				return all (getattr (self, attr) == getattr (o, attr)attrself.__slots__);
			});},
			get LargestOffset () {return __get__ (this, function (self) {
				'Returns the largest offset in the available timings.';
				return max (0, max (getattr (self, attr)attrself.__slots__attr != 'request_time'));
			});},
			get ToJsonDict () {return __get__ (this, function (self) {
				return function () {
					var __accu0__ = [];
					var __iter0__ = self.__slots__;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var attr = __iter0__ [__index0__];
						if (getattr (self, attr) != -(1)) {
							__accu0__.append (list ([attr, getattr (self, attr)]));
						}
					}
					return dict (__accu0__);
				} ();
			});},
			get FromJsonDict () {return __get__ (this, function (cls, json_dict) {
				return cls (__kwargdict__ (json_dict));
			});},
			get FromDevToolsDict () {return __get__ (this, function (cls, json_dict) {
				'Returns an instance of Timing from a dict, as passed by DevTools.';
				var timing_dict = function () {
					var __accu0__ = [];
					var __iter0__ = json_dict.py_items ();
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var __left0__ = __iter0__ [__index0__];
						var k = __left0__ [0];
						var v = __left0__ [1];
						__accu0__.append (list ([cls._TIMING_NAMES_MAPPING [k], v]));
					}
					return dict (__accu0__);
				} ();
				return cls (__kwargdict__ (timing_dict));
			});}
		});
		Timing._TIMING_NAMES = tuple ([tuple (['connectEnd', 'connect_end']), tuple (['connectStart', 'connect_start']), tuple (['dnsEnd', 'dns_end']), tuple (['dnsStart', 'dns_start']), tuple (['proxyEnd', 'proxy_end']), tuple (['proxyStart', 'proxy_start']), tuple (['receiveHeadersEnd', 'receive_headers_end']), tuple (['requestTime', 'request_time']), tuple (['sendEnd', 'send_end']), tuple (['sendStart', 'send_start']), tuple (['sslEnd', 'ssl_end']), tuple (['sslStart', 'ssl_start']), tuple (['workerReady', 'worker_ready']), tuple (['workerStart', 'worker_start']), tuple (['loadingFinished', 'loading_finished']), tuple (['pushStart', 'push_start']), tuple (['pushEnd', 'push_end'])]);
		Timing._TIMING_NAMES_MAPPING = dict (_TIMING_NAMES);
		Timing.__slots__ = tuple (x [1]x_TIMING_NAMES);
		var ShortName = function (url) {
			'Returns a shortened version of a URL.';
			var parsed = urlparse.urlparse (url);
			var path = parsed.path;
			var hostname = (parsed.hostname ? parsed.hostname : '?.?.?');
			if (path != '' && path != '/') {
				var last_path = parsed.path.py_split ('/') [-(1)];
				if (len (last_path) < 10) {
					if (len (path) < 10) {
						return (hostname + '/') + path;
					}
					else {
						return (hostname + '/..') + parsed.path.__getslice__ (-(10), null, 1);
					}
				}
				else {
					return (hostname + '/..') + last_path.__getslice__ (0, 5, 1);
				}
			}
			else {
				return hostname;
			}
		};
		var IntervalBetween = function (first, second, reason) {
			"Returns the start and end of the inteval between two requests, in ms.\n\n  This is defined as:\n  - [first.headers, second.start] if reason is 'parser'. This is to account\n    for incremental parsing.\n  - [first.end, second.start] if reason is 'script', 'redirect' or 'other'.\n\n  Args:\n    first: (Request) First request.\n    second: (Request) Second request.\n    reason: (str) Link between the two requests, in Request.INITIATORS.\n\n  Returns:\n    (start_msec (float), end_msec (float)),\n  ";
			__in__ (reason, Request.INITIATORS);
			var second_ms = second.timing.request_time * 1000;
			if (reason == 'parser') {
				var first_offset_ms = first.timing.receive_headers_end;
			}
			else {
				var first_offset_ms = first.timing.LargestOffset ();
			}
			return tuple ([first.timing.request_time * 1000 + first_offset_ms, second_ms]);
		};
		var TimeBetween = function (first, second, reason) {
			'(end_msec - start_msec), with the values as returned by IntervalBetween().\n  ';
			var __left0__ = IntervalBetween (first, second, reason);
			var first_ms = __left0__ [0];
			var second_ms = __left0__ [1];
			return second_ms - first_ms;
		};
		var TimingAsList = function (timing) {
			'Transform Timing to a list, eg as is used in JSON output.\n\n  Args:\n    timing: a Timing.\n\n  Returns:\n    A list identical to what the eventual JSON output will be (eg,\n    Request.ToJsonDict).\n  ';
			return json.loads (json.dumps (timing));
		};
		var Request = __class__ ('Request', [object], {
			get __init__ () {return __get__ (this, function (self) {
				self.request_id = null;
				self.frame_id = null;
				self.loader_id = null;
				self.document_url = null;
				self.url = null;
				self.protocol = null;
				self.method = null;
				self.mime_type = null;
				self.request_headers = null;
				self.response_headers = null;
				self.initial_priority = null;
				self.timestamp = -(1);
				self.wall_time = -(1);
				self.initiator = null;
				self.resource_type = null;
				self.served_from_cache = false;
				self.from_disk_cache = false;
				self.from_service_worker = false;
				self.timing = null;
				self.status = null;
				self.encoded_data_length = 0;
				self.data_chunks = list ([]);
				self.failed = false;
			});},
			get start_msec () {return __get__ (this, function (self) {
				return self.timing.request_time * 1000;
			});},
			get end_msec () {return __get__ (this, function (self) {
				if (self.start_msec === null) {
					return null;
				}
				return self.start_msec + self.timing.LargestOffset ();
			});},
			get _TimestampOffsetFromStartMs () {return __get__ (this, function (self, timestamp) {
				self.timing.request_time != -(1);
				var request_time = self.timing.request_time;
				return (timestamp - request_time) * 1000;
			});},
			get ToJsonDict () {return __get__ (this, function (self) {
				var result = copy.deepcopy (self.__dict__);
				result ['timing'] = self.timing.ToJsonDict ();
				return result;
			});},
			get FromJsonDict () {return __get__ (this, function (cls, data_dict) {
				var result = Request ();
				var __iter0__ = data_dict.py_items ();
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var __left0__ = __iter0__ [__index0__];
					var k = __left0__ [0];
					var v = __left0__ [1];
					setattr (result, k, v);
				}
				if (!(result.response_headers)) {
					result.response_headers = dict ({});
				}
				if (result.timing) {
					result.timing = Timing.FromJsonDict (result.timing);
				}
				else {
					result.timing = Timing (__kwargdict__ ({request_time: result.timestamp}));
				}
				return result;
			});},
			get GetHTTPResponseHeader () {return __get__ (this, function (self, header_name) {
				'Gets the value of a HTTP response header.\n\n    Does a case-insensitive search for the header name in the HTTP response\n    headers, in order to support servers that use a wrong capitalization.\n    ';
				var lower_case_name = header_name.lower ();
				var result = null;
				var __iter0__ = self.response_headers.iteritems ();
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var __left0__ = __iter0__ [__index0__];
					var name = __left0__ [0];
					var value = __left0__ [1];
					if (name.lower () == lower_case_name) {
						var result = value;
						break;
					}
				}
				return result;
			});},
			get GetContentType () {return __get__ (this, function (self) {
				'Returns the content type, or None.';
				if (self.GetHTTPResponseHeader ('Location') !== null) {
					return 'redirect';
				}
				if (self.GetHTTPResponseHeader ('Content-Length') == '0' || self.status == 204) {
					return 'ping';
				}
				if (self.mime_type) {
					return self.mime_type;
				}
				var content_type = self.GetHTTPResponseHeader ('Content-Type');
				if (!(content_type) || !__in__ (';', content_type)) {
					return content_type;
				}
				else {
					return content_type.__getslice__ (0, content_type.index (';'), 1);
				}
			});},
			get IsDataRequest () {return __get__ (this, function (self) {
				return self.protocol == 'data';
			});},
			get MaxAge () {return __get__ (this, function (self) {
				'Returns the max-age of a resource, or -1.';
				var cache_control = dict ({});
				if (!(self.response_headers)) {
					return -(1);
				}
				var cache_control_str = self.GetHTTPResponseHeader ('Cache-Control');
				if (cache_control_str !== null) {
					var directives = function () {
						var __accu0__ = [];
						var __iter0__ = cache_control_str.py_split (',');
						for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
							var s = __iter0__ [__index0__];
							__accu0__.append (s.strip ());
						}
						return __accu0__;
					} ();
					var __iter0__ = directives;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var directive = __iter0__ [__index0__];
						var parts = function () {
							var __accu0__ = [];
							var __iter1__ = directive.py_split ('=');
							for (var __index1__ = 0; __index1__ < __iter1__.length; __index1__++) {
								var s = __iter1__ [__index1__];
								__accu0__.append (s.strip ());
							}
							return __accu0__;
						} ();
						if (len (parts) == 1) {
							cache_control [parts [0]] = true;
						}
						else {
							cache_control [parts [0]] = parts [1];
						}
					}
				}
				if (__in__ ('no-store', cache_control) || __in__ ('no-cache', cache_control) || len (cache_control) == 0) {
					return -(1);
				}
				if (__in__ ('max-age', cache_control)) {
					var age_match = re.match ('\\s*(\\d+)+', cache_control ['max-age']);
					if (!(age_match)) {
						return -(1);
					}
					return int (age_match.group (1));
				}
				return -(1);
			});},
			get Cost () {return __get__ (this, function (self) {
				'Returns the cost of this request in ms, defined as time between\n    request_time and the latest timing event.\n    ';
				return self.timing.LargestOffset ();
			});},
			get __eq__ () {return __get__ (this, function (self, o) {
				return self.__dict__ == o.__dict__;
			});},
			get __hash__ () {return __get__ (this, function (self) {
				return hash (self.request_id);
			});},
			get __str__ () {return __get__ (this, function (self) {
				return json.dumps (self.ToJsonDict (), __kwargdict__ ({sort_keys: true, indent: 2}));
			});}
		});
		Request.REQUEST_PRIORITIES = tuple (['VeryLow', 'Low', 'Medium', 'High', 'VeryHigh']);
		Request.RESOURCE_TYPES = tuple (['Document', 'Stylesheet', 'Image', 'Media', 'Font', 'Script', 'TextTrack', 'XHR', 'Fetch', 'EventSource', 'WebSocket', 'Manifest', 'Other']);
		Request.INITIATORS = tuple (['parser', 'script', 'other', 'redirect']);
		Request.INITIATING_REQUEST = 'initiating_request';
		Request.ORIGINAL_INITIATOR = 'original_initiator';
		var RequestTrack = __class__ ('RequestTrack', [object], {
			get __init__ () {return __get__ (this, function (self, connection) {
				super (RequestTrack, self).__init__ (connection);
				self._connection = connection;
				self._requests = list ([]);
				self._requests_in_flight = dict ({});
				self._completed_requests_by_id = dict ({});
				self._redirects_count_by_id = collections.defaultdict (int);
				self._indexed = false;
				self._request_start_timestamps = null;
				self._request_end_timestamps = null;
				self._requests_by_start = null;
				self._requests_by_end = null;
				if (connection) {
					var __iter0__ = RequestTrack._METHOD_TO_HANDLER;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var method = __iter0__ [__index0__];
						self._connection.RegisterListener (method, self);
					}
					self._connection.SetScopedState ('Debugger.setAsyncCallStackDepth', dict ({'maxDepth': 4}), dict ({'maxDepth': 0}), true);
				}
				self._request_id_to_response_received = dict ({});
				self.duplicates_count = 0;
				self.inconsistent_initiators_count = 0;
			});},
			get Handle () {return __get__ (this, function (self, method, msg) {
				__in__ (method, RequestTrack._METHOD_TO_HANDLER);
				self._indexed = false;
				var params = msg ['params'];
				var request_id = params ['requestId'];
				RequestTrack._METHOD_TO_HANDLER [method] (self, request_id, params);
			});},
			get GetEvents () {return __get__ (this, function (self) {
				if (self._requests_in_flight) {
					logging.warning ('Number of requests still in flight: %d.' % len (self._requests_in_flight));
				}
				return self._requests;
			});},
			get GetFirstResourceRequest () {return __get__ (this, function (self) {
				return self.GetEvents () [0];
			});},
			get GetFirstRequestMillis () {return __get__ (this, function (self) {
				'Find the canonical start time for this track.\n\n    Returns:\n      The millisecond timestamp of the first request.\n    ';
				self._requests'No requests to analyze.';
				self._IndexRequests ();
				return self._request_start_timestamps [0];
			});},
			get GetLastRequestMillis () {return __get__ (this, function (self) {
				'Find the canonical start time for this track.\n\n    Returns:\n      The millisecond timestamp of the first request.\n    ';
				self._requests'No requests to analyze.';
				self._IndexRequests ();
				return self._request_end_timestamps [-(1)];
			});},
			get GetEventsStartingBetween () {return __get__ (this, function (self, start_ms, end_ms) {
				'Return events that started in a range.\n\n    Args:\n      start_ms: the start time to query, in milliseconds from the first request.\n      end_ms: the end time to query, in milliseconds from the first request.\n\n    Returns:\n      A list of requests whose start time is in [start_ms, end_ms].\n    ';
				self._IndexRequests ();
				var low = bisect.bisect_left (self._request_start_timestamps, start_ms);
				var high = bisect.bisect_right (self._request_start_timestamps, end_ms);
				return self._requests_by_start.__getslice__ (low, high, 1);
			});},
			get GetEventsEndingBetween () {return __get__ (this, function (self, start_ms, end_ms) {
				'Return events that ended in a range.\n\n    Args:\n      start_ms: the start time to query, in milliseconds from the first request.\n      end_ms: the end time to query, in milliseconds from the first request.\n\n    Returns:\n      A list of requests whose end time is in [start_ms, end_ms].\n    ';
				self._IndexRequests ();
				var low = bisect.bisect_left (self._request_end_timestamps, start_ms);
				var high = bisect.bisect_right (self._request_end_timestamps, end_ms);
				return self._requests_by_end.__getslice__ (low, high, 1);
			});},
			get ToJsonDict () {return __get__ (this, function (self) {
				if (self._requests_in_flight) {
					logging.warning ('Requests in flight, will be ignored in the dump');
				}
				return dict ([[self._EVENTS_KEY, function () {
					var __accu0__ = [];
					var __iter0__ = self._requests;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var request = __iter0__ [__index0__];
						__accu0__.append (request.ToJsonDict ());
					}
					return __accu0__;
				} ()], [self._METADATA_KEY, dict ([[self._DUPLICATES_KEY, self.duplicates_count], [self._INCONSISTENT_INITIATORS_KEY, self.inconsistent_initiators_count]])]]);
			});},
			get FromJsonDict () {return __get__ (this, function (cls, json_dict) {
				__in__ (cls._EVENTS_KEY, json_dict);
				__in__ (cls._METADATA_KEY, json_dict);
				var result = RequestTrack (null);
				var requests = function () {
					var __accu0__ = [];
					var __iter0__ = json_dict [cls._EVENTS_KEY];
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var request = __iter0__ [__index0__];
						__accu0__.append (Request.FromJsonDict (request));
					}
					return __accu0__;
				} ();
				result._requests = requests;
				var metadata = json_dict [cls._METADATA_KEY];
				result.duplicates_count = metadata.get (cls._DUPLICATES_KEY, 0);
				result.inconsistent_initiators_count = metadata.get (cls._INCONSISTENT_INITIATORS_KEY, 0);
				return result;
			});},
			get _IndexRequests () {return __get__ (this, function (self) {
				if (self._indexed) {
					return ;
				}
				var valid_requests = function () {
					var __accu0__ = [];
					var __iter0__ = self._requests;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var r = __iter0__ [__index0__];
						if (r.start_msec !== null) {
							__accu0__.append (r);
						}
					}
					return __accu0__;
				} ();
				self._requests_by_start = sorted (valid_requests, __kwargdict__ ({key: (function __lambda__ (r) {
					return r.start_msec;})}));
				self._request_start_timestamps = function () {
					var __accu0__ = [];
					var __iter0__ = self._requests_by_start;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var r = __iter0__ [__index0__];
						__accu0__.append (r.start_msec);
					}
					return __accu0__;
				} ();
				self._requests_by_end = sorted (valid_requests, __kwargdict__ ({key: (function __lambda__ (r) {
					return r.end_msec;})}));
				self._request_end_timestamps = function () {
					var __accu0__ = [];
					var __iter0__ = self._requests_by_end;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var r = __iter0__ [__index0__];
						__accu0__.append (r.end_msec);
					}
					return __accu0__;
				} ();
				self._indexed = true;
			});},
			get _RequestWillBeSent () {return __get__ (this, function (self, request_id, params) {
				var redirect_initiator = null;
				if (__in__ (request_id, self._requests_in_flight)) {
					var redirect_initiator = self._HandleRedirect (request_id, params);
				}
				!__in__ (request_id, self._requests_in_flight) && !__in__ (request_id, self._completed_requests_by_id);
				var r = Request ();
				r.request_id = request_id;
				_CopyFromDictToObject (params, r, tuple ([tuple (['frameId', 'frame_id']), tuple (['loaderId', 'loader_id']), tuple (['documentURL', 'document_url']), tuple (['timestamp', 'timestamp']), tuple (['wallTime', 'wall_time']), tuple (['initiator', 'initiator'])]));
				var request = params ['request'];
				_CopyFromDictToObject (request, r, tuple ([tuple (['url', 'url']), tuple (['method', 'method']), tuple (['headers', 'headers']), tuple (['initialPriority', 'initial_priority'])]));
				r.resource_type = params.get ('type', 'Other');
				if (redirect_initiator) {
					var original_initiator = r.initiator;
					r.initiator = redirect_initiator;
					r.initiator [Request.ORIGINAL_INITIATOR] = original_initiator;
					var initiating_request = self._completed_requests_by_id [redirect_initiator [Request.INITIATING_REQUEST]];
					var initiating_initiator = initiating_request.initiator.get (Request.ORIGINAL_INITIATOR, initiating_request.initiator);
					if (initiating_initiator != original_initiator) {
						self.inconsistent_initiators_count++;
					}
				}
				self._requests_in_flight [request_id] = tuple ([r, RequestTrack._STATUS_SENT]);
			});},
			get _HandleRedirect () {return __get__ (this, function (self, request_id, params) {
				var __left0__ = self._requests_in_flight [request_id];
				var r = __left0__ [0];
				var status = __left0__ [1];
				status == RequestTrack._STATUS_SENT;
				__in__ ('redirectResponse', params);
				var redirect_response = params ['redirectResponse'];
				_CopyFromDictToObject (redirect_response, r, tuple ([tuple (['headers', 'response_headers']), tuple (['encodedDataLength', 'encoded_data_length']), tuple (['fromDiskCache', 'from_disk_cache'])]));
				r.timing = Timing.FromDevToolsDict (redirect_response ['timing']);
				var redirect_index = self._redirects_count_by_id [request_id];
				self._redirects_count_by_id [request_id]++;
				r.request_id = '%s%s.%d' % tuple ([request_id, self._REDIRECT_SUFFIX, redirect_index + 1]);
				var initiator = dict ([['type', 'redirect'], [Request.INITIATING_REQUEST, r.request_id]]);
				self._requests_in_flight [r.request_id] = tuple ([r, RequestTrack._STATUS_FINISHED]);
				delete self._requests_in_flight [request_id];
				self._FinalizeRequest (r.request_id);
				return initiator;
			});},
			get _RequestServedFromCache () {return __get__ (this, function (self, request_id, _) {
				__in__ (request_id, self._requests_in_flight);
				var __left0__ = self._requests_in_flight [request_id];
				var request = __left0__ [0];
				var status = __left0__ [1];
				status == RequestTrack._STATUS_SENT;
				request.served_from_cache = true;
			});},
			get _ResponseReceived () {return __get__ (this, function (self, request_id, params) {
				__in__ (request_id, self._requests_in_flight);
				var __left0__ = self._requests_in_flight [request_id];
				var r = __left0__ [0];
				var status = __left0__ [1];
				if (status == RequestTrack._STATUS_RESPONSE) {
					var old_params = self._request_id_to_response_received [request_id];
					var params_copy = copy.deepcopy (params);
					params_copy ['timestamp'] = null;
					old_params ['timestamp'] = null;
					params_copy == old_params;
					self.duplicates_count++;
					return ;
				}
				status == RequestTrack._STATUS_SENT;
				r.frame_id == params ['frameId'];
				r.timestamp <= params ['timestamp'];
				if (r.resource_type == 'Other') {
					r.resource_type = params.get ('type', 'Other');
				}
				else {
					r.resource_type == params.get ('type', 'Other');
				}
				var response = params ['response'];
				_CopyFromDictToObject (response, r, tuple ([tuple (['status', 'status']), tuple (['mimeType', 'mime_type']), tuple (['fromDiskCache', 'from_disk_cache']), tuple (['fromServiceWorker', 'from_service_worker']), tuple (['protocol', 'protocol']), tuple (['requestHeaders', 'request_headers']), tuple (['headers', 'response_headers'])]));
				var timing_dict = dict ({});
				if (__in__ (r.protocol, tuple (['data', 'about'])) || r.served_from_cache) {
					var timing_dict = dict ({'requestTime': r.timestamp});
				}
				else {
					var timing_dict = response ['timing'];
				}
				r.timing = Timing.FromDevToolsDict (timing_dict);
				self._requests_in_flight [request_id] = tuple ([r, RequestTrack._STATUS_RESPONSE]);
				self._request_id_to_response_received [request_id] = params;
			});},
			get _DataReceived () {return __get__ (this, function (self, request_id, params) {
				var __left0__ = self._requests_in_flight [request_id];
				var r = __left0__ [0];
				var status = __left0__ [1];
				status == RequestTrack._STATUS_RESPONSE || status == RequestTrack._STATUS_DATA;
				var offset = r._TimestampOffsetFromStartMs (params ['timestamp']);
				r.data_chunks.append (tuple ([offset, params ['encodedDataLength']]));
				self._requests_in_flight [request_id] = tuple ([r, RequestTrack._STATUS_DATA]);
			});},
			get _LoadingFinished () {return __get__ (this, function (self, request_id, params) {
				__in__ (request_id, self._requests_in_flight);
				var __left0__ = self._requests_in_flight [request_id];
				var r = __left0__ [0];
				var status = __left0__ [1];
				status == RequestTrack._STATUS_RESPONSE || status == RequestTrack._STATUS_DATA;
				r.encoded_data_length = params ['encodedDataLength'];
				r.timing.loading_finished = r._TimestampOffsetFromStartMs (params ['timestamp']);
				self._requests_in_flight [request_id] = tuple ([r, RequestTrack._STATUS_FINISHED]);
				self._FinalizeRequest (request_id);
			});},
			get _LoadingFailed () {return __get__ (this, function (self, request_id, _) {
				__in__ (request_id, self._requests_in_flight);
				var __left0__ = self._requests_in_flight [request_id];
				var r = __left0__ [0];
				var _ = __left0__ [1];
				r.failed = true;
				self._requests_in_flight [request_id] = tuple ([r, RequestTrack._STATUS_FINISHED]);
				self._FinalizeRequest (request_id);
			});},
			get _FinalizeRequest () {return __get__ (this, function (self, request_id) {
				__in__ (request_id, self._requests_in_flight);
				var __left0__ = self._requests_in_flight [request_id];
				var request = __left0__ [0];
				var status = __left0__ [1];
				status == RequestTrack._STATUS_FINISHED;
				delete self._requests_in_flight [request_id];
				self._completed_requests_by_id [request_id] = request;
				self._requests.append (request);
			});},
			get __eq__ () {return __get__ (this, function (self, o) {
				return self._requests == o._requests;
			});}
		});
		RequestTrack._REDIRECT_SUFFIX = '.redirect';
		RequestTrack._STATUS_SENT = 0;
		RequestTrack._STATUS_RESPONSE = 1;
		RequestTrack._STATUS_DATA = 2;
		RequestTrack._STATUS_FINISHED = 3;
		RequestTrack._STATUS_FAILED = 4;
		RequestTrack._EVENTS_KEY = 'events';
		RequestTrack._METADATA_KEY = 'metadata';
		RequestTrack._DUPLICATES_KEY = 'duplicates_count';
		RequestTrack._INCONSISTENT_INITIATORS_KEY = 'inconsistent_initiators';
		RequestTrack._METHOD_TO_HANDLER = dict ({'Network.requestWillBeSent': RequestTrack._RequestWillBeSent, 'Network.requestServedFromCache': RequestTrack._RequestServedFromCache, 'Network.responseReceived': RequestTrack._ResponseReceived, 'Network.dataReceived': RequestTrack._DataReceived, 'Network.loadingFinished': RequestTrack._LoadingFinished, 'Network.loadingFailed': RequestTrack._LoadingFailed});
		var _CopyFromDictToObject = function (d, o, key_attrs) {
			var __iter0__ = key_attrs;
			for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
				var __left0__ = __iter0__ [__index0__];
				var key = __left0__ [0];
				var attr = __left0__ [1];
				if (__in__ (key, d)) {
					setattr (o, attr, d [key]);
				}
			}
		};
		if (__name__ == '__main__') {
			var events = json.load (open (sys.argv [1], 'r'));
			var request_track = RequestTrack (null);
			var __iter0__ = events;
			for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
				var event = __iter0__ [__index0__];
				var event_method = event ['method'];
				request_track.Handle (event_method, event);
			}
		}
		__pragma__ ('<all>')
			__all__.IntervalBetween = IntervalBetween;
			__all__.Request = Request;
			__all__.RequestTrack = RequestTrack;
			__all__.ShortName = ShortName;
			__all__.TimeBetween = TimeBetween;
			__all__.Timing = Timing;
			__all__.TimingAsList = TimingAsList;
			__all__._CopyFromDictToObject = _CopyFromDictToObject;
			__all__.event = event;
			__all__.event_method = event_method;
			__all__.events = events;
			__all__.request_track = request_track;
		__pragma__ ('</all>')
	}) ();
