	(function () {
		'Gives a picture of the network activity between timestamps.';
		var NetworkActivityLens = __class__ ('NetworkActivityLens', [object], {
			get __init__ () {return __get__ (this, function (self, trace) {
				'Initializes a NetworkActivityLens instance.\n\n    Args:\n      trace: (LoadingTrace)\n    ';
				self._trace = trace;
				self._start_end_times = list ([]);
				self._active_events_list = list ([]);
				self._uploaded_bytes_timeline = list ([]);
				self._downloaded_bytes_timeline = list ([]);
				self._upload_rate_timeline = list ([]);
				self._download_rate_timeline = list ([]);
				var requests = trace.request_track.GetEvents ();
				self._network_events = list (itertools.chain.from_iterable (NetworkEvent.EventsFromRequest (request)requestrequests));
				self._IndexEvents ();
				self._CreateTimelines ();
			});},
			get uploaded_bytes_timeline () {return __get__ (this, function (self) {
				return tuple ([self._start_end_times, self._uploaded_bytes_timeline]);
			});},
			get downloaded_bytes_timeline () {return __get__ (this, function (self) {
				return tuple ([self._start_end_times, self._downloaded_bytes_timeline]);
			});},
			get upload_rate_timeline () {return __get__ (this, function (self) {
				return tuple ([self._start_end_times, self._upload_rate_timeline]);
			});},
			get download_rate_timeline () {return __get__ (this, function (self) {
				return tuple ([self._start_end_times, self._download_rate_timeline]);
			});},
			get _IndexEvents () {return __get__ (this, function (self) {
				var start_end_times_set = set ();
				var __iter0__ = self._network_events;
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var event = __iter0__ [__index0__];
					start_end_times_set.add (event.start_msec);
					start_end_times_set.add (event.end_msec);
				}
				self._start_end_times = sorted (list (start_end_times_set));
				self._active_events_list = function () {
					var __accu0__ = [];
					var __iter0__ = self._start_end_times;
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var _ = __iter0__ [__index0__];
						__accu0__.append (list ([]));
					}
					return __accu0__;
				} ();
				var __iter0__ = self._network_events;
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var event = __iter0__ [__index0__];
					var start_index = bisect.bisect_right (self._start_end_times, event.start_msec) - 1;
					var end_index = bisect.bisect_right (self._start_end_times, event.end_msec);
					for (var index = start_index; index < end_index; index++) {
						self._active_events_list [index].append (event);
					}
				}
			});},
			get _CreateTimelines () {return __get__ (this, function (self) {
				var __iter0__ = enumerate (self._start_end_times);
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var __left0__ = __iter0__ [__index0__];
					var index = __left0__ [0];
					var timestamp = __left0__ [1];
					var upload_rate = sum (e.UploadRate ()eself._active_events_list [index]timestamp != e.end_msec);
					var download_rate = sum (e.DownloadRate ()eself._active_events_list [index]timestamp != e.end_msec);
					var uploaded_bytes = sum (e.UploadedBytes ()eself._active_events_list [index]timestamp == e.end_msec);
					var downloaded_bytes = sum (e.DownloadedBytes ()eself._active_events_list [index]timestamp == e.end_msec);
					self._uploaded_bytes_timeline.append (uploaded_bytes);
					self._downloaded_bytes_timeline.append (downloaded_bytes);
					self._upload_rate_timeline.append (upload_rate);
					self._download_rate_timeline.append (download_rate);
				}
			});}
		});
		var NetworkEvent = __class__ ('NetworkEvent', [object], {
			get __init__ () {return __get__ (this, function (self, request, kind, start_msec, end_msec, chunk_index) {
				if (typeof chunk_index == 'undefined' || (chunk_index != null && chunk_index .__class__ == __kwargdict__)) {;
					var chunk_index = null;
				};
				'Creates a NetworkEvent.';
				self._request = request;
				self._kind = kind;
				self.start_msec = start_msec;
				self.end_msec = end_msec;
				self._chunk_index = chunk_index;
			});},
			get _GetStartEndOffsetsMsec () {return __get__ (this, function (cls, request, kind, index) {
				if (typeof index == 'undefined' || (index != null && index .__class__ == __kwargdict__)) {;
					var index = null;
				};
				var __left0__ = tuple ([0, 0]);
				var start_offset = __left0__ [0];
				var end_offset = __left0__ [1];
				var r = request;
				if (kind == 'dns') {
					var start_offset = r.timing.dns_start;
					var end_offset = r.timing.dns_end;
				}
				else {
					if (kind == 'connect') {
						var start_offset = r.timing.connect_start;
						var end_offset = r.timing.connect_end;
					}
					else {
						if (kind == 'send') {
							var start_offset = r.timing.send_start;
							var end_offset = r.timing.send_end;
						}
						else {
							if (kind == 'receive_headers') {
								var start_offset = r.timing.send_end;
								var end_offset = r.timing.receive_headers_end;
							}
							else {
								if (kind == 'receive_body') {
									if (index === null) {
										var start_offset = r.timing.receive_headers_end;
										var end_offset = r.timing.loading_finished;
									}
									else {
										var i = index - 1;
										var __break0__ = false;
										while (i >= 0) {
											var __left0__ = r.data_chunks [i];
											var offset = __left0__ [0];
											var size = __left0__ [1];
											if (size != 0) {
												var previous_chunk_start = offset;
												__break0__ = true;
												break;
											}
											i--;
										}
										if (!__break0__) {
											var previous_chunk_start = r.timing.receive_headers_end;
										}
										var start_offset = previous_chunk_start;
										var end_offset = r.data_chunks [index] [0];
									}
								}
							}
						}
					}
				}
				return tuple ([start_offset, end_offset]);
			});},
			get EventsFromRequest () {return __get__ (this, function (cls, request) {
				if (request.from_disk_cache || request.served_from_cache || request.IsDataRequest ()) {
					return list ([]);
				}
				var events = list ([]);
				var __iter0__ = cls.KINDS - set (list (['receive_body']));
				for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
					var kind = __iter0__ [__index0__];
					var event = cls._EventWithKindFromRequest (request, kind);
					if (event) {
						events.append (event);
					}
				}
				var kind = 'receive_body';
				if (request.data_chunks) {
					var __iter0__ = enumerate (request.data_chunks);
					for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
						var __left0__ = __iter0__ [__index0__];
						var index = __left0__ [0];
						var chunk = __left0__ [1];
						if (chunk [0] != 0) {
							var event = cls._EventWithKindFromRequest (request, kind, index);
							if (event) {
								events.append (event);
							}
						}
					}
				}
				else {
					var event = cls._EventWithKindFromRequest (request, kind, null);
					if (event) {
						events.append (event);
					}
				}
				return events;
			});},
			get _EventWithKindFromRequest () {return __get__ (this, function (cls, request, kind, index) {
				if (typeof index == 'undefined' || (index != null && index .__class__ == __kwargdict__)) {;
					var index = null;
				};
				var __left0__ = cls._GetStartEndOffsetsMsec (request, kind, index);
				var start_offset = __left0__ [0];
				var end_offset = __left0__ [1];
				var event = cls (request, kind, request.start_msec + start_offset, request.start_msec + end_offset, index);
				if (start_offset == -(1) || end_offset == -(1)) {
					return null;
				}
				return event;
			});},
			get UploadedBytes () {return __get__ (this, function (self) {
				'Returns the number of bytes uploaded during this event.';
				if (!__in__ (self._kind, 'send')) {
					return 0;
				}
				if (!(self._request.request_headers)) {
					return 0;
				}
				return sum (len (k) + len (str (v))tuple ([k, v])self._request.request_headers.py_items ());
			});},
			get DownloadedBytes () {return __get__ (this, function (self) {
				'Returns the number of bytes downloaded during this event.';
				if (!__in__ (self._kind, tuple (['receive_headers', 'receive_body']))) {
					return 0;
				}
				if (self._kind == 'receive_headers') {
					return sum (len (k) + len (str (v))tuple ([k, v])self._request.response_headers.py_items ());
				}
				else {
					if (self._chunk_index === null) {
						return self._request.encoded_data_length;
					}
					else {
						return self._request.data_chunks [self._chunk_index] [1];
					}
				}
			});},
			get UploadRate () {return __get__ (this, function (self) {
				'Returns the upload rate of this event in Bytes / s.';
				return (1000 * self.UploadedBytes ()) / float (self.end_msec - self.start_msec);
			});},
			get DownloadRate () {return __get__ (this, function (self) {
				'Returns the download rate of this event in Bytes / s.';
				var downloaded_bytes = self.DownloadedBytes ();
				var value = (1000 * downloaded_bytes) / float (self.end_msec - self.start_msec);
				if (value > 1000000.0) {
					print (self._kind, downloaded_bytes, self.end_msec - self.start_msec);
				}
				return value;
			});}
		});
		NetworkEvent.KINDS = set (tuple (['dns', 'connect', 'send', 'receive_headers', 'receive_body']));
		__pragma__ ('<all>')
			__all__.NetworkActivityLens = NetworkActivityLens;
			__all__.NetworkEvent = NetworkEvent;
		__pragma__ ('</all>')
	}) ();
