"use strict";
// Transcrypt'ed from Python, 2016-04-26 14:51:27
function request_track () {
	var __all__ = {};
	var __world__ = __all__;
	
	// Nested object creator, part of the nesting may already exist and have attributes
	var __nest__ = function (headObject, tailNames, value) {
		// In some cases this will be a global object, e.g. 'window'
		var current = headObject;
		
		if (tailNames != '') {	// Split on empty string doesn't give empty list
			// Find the last already created object in tailNames
			var tailChain = tailNames.split ('.');
			var firstNewIndex = tailChain.length;
			for (var index = 0; index < tailChain.length; index++) {
				if (!current.hasOwnProperty (tailChain [index])) {
					firstNewIndex = index;
					break;
				}
				current = current [tailChain [index]];
			}
			
			// Create the rest of the objects, if any
			for (var index = firstNewIndex; index < tailChain.length; index++) {
				current [tailChain [index]] = {};
				current = current [tailChain [index]];
			}
		}
		
		// Insert it new attributes, it may have been created earlier and have other attributes
		for (var attrib in value) {
			current [attrib] = value [attrib];			
		}		
	};
	__all__.__nest__ = __nest__;
	
	// Initialize module if not yet done and return its globals
	var __init__ = function (module) {
		if (!module.__inited__) {
			module.__all__.__init__ (module.__all__);
		}
		return module.__all__;
	};
	__all__.__init__ = __init__;
	
	// Since we want to assign functions, a = b.f should make b.f produce a bound function
	// So __get__ should be called by a property rather then a function
	// Factory __get__ creates one of three curried functions for func
	// Which one is produced depends on what's to the left of the dot of the corresponding JavaScript property
	var __get__ = function (self, func, quotedFuncName) {
		if (self) {
			if (self.hasOwnProperty ('__class__') || typeof self == 'string' || self instanceof String) {			// Object before the dot
				if (quotedFuncName) {									// Memoize call since fcall is on, by installing bound function in instance
					Object.defineProperty (self, quotedFuncName, {		// Will override the non-own property, next time it will be called directly
						value: function () {							// So next time just call curry function that calls function
							var args = [] .slice.apply (arguments);
							return func.apply (null, [self] .concat (args));
						},				
						writable: true,
						enumerable: true,
						configurable: true
					});
				}
				return function () {									// Return bound function, code dupplication for efficiency if no memoizing
					var args = [] .slice.apply (arguments);				// So multilayer search prototype, apply __get__, call curry func that calls func
					return func.apply (null, [self] .concat (args));
				};
			}
			else {														// Class before the dot
				return func;											// Return static method
			}
		}
		else {															// Nothing before the dot
			return func;												// Return free function
		}
	}
	__all__.__get__ = __get__;
			
	// Class creator function
	var __class__ = function (name, bases, extra) {
		// Create class functor
		var cls = function () {
			var args = [] .slice.apply (arguments);
			return cls.__new__ (args);
		};
		
		// Copy methods, properties and static attributes from base classes to new class object
		for (var index = bases.length - 1; index >= 0; index--) {	// Reversed order, since class vars of first base should win
			var base = bases [index];
			for (var attrib in base) {
				var descrip = Object.getOwnPropertyDescriptor (base, attrib);
				Object.defineProperty (cls, attrib, descrip);
			}
		}
		
		// Add class specific attributes to class object
		cls.__name__ = name;
		cls.__bases__ = bases;
		
		// Add own methods, properties and static attributes to class object
		for (var attrib in extra) {
			var descrip = Object.getOwnPropertyDescriptor (extra, attrib);
			Object.defineProperty (cls, attrib, descrip);
		}
				
		// Return class object
		return cls;
	};
	__all__.__class__ = __class__;

	// Create mother of all classes		
	var object = __all__.__class__ ('object', [], {
		__init__: function (self) {},
			
		__name__: 'object',
		__bases__: [],
			
		// Object creator function is inherited by all classes (??? Make global?)
		__new__: function (args) {	// Args are just the constructor args		
			// In JavaScript the Python class is the prototype of the Python object
			// In this way methods and static attributes will be available both with a class and an object before the dot
			// The descriptor produced by __get__ will return the right method flavor
			var instance = Object.create (this, {__class__: {value: this, enumerable: true}});
			
			// Call constructor
			this.__init__.apply (null, [instance] .concat (args));
			
			// Return instance			
			return instance;
		}	
	});
	__all__.object = object;
	
	// Define __pragma__ to preserve '<all>' and '</all>', since it's never generated as a function, must be done early, so here
	var __pragma__ = function () {};
	__all__.__pragma__ = __pragma__;
	__nest__ (
		__all__,
		'org.transcrypt.__base__', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __Envir__ = __class__ ('__Envir__', [object], {
						get __init__ () {return __get__ (this, function (self) {
							self.transpiler_name = 'transcrypt';
							self.transpiler_version = '3.5.143';
							self.target_subdir = '__javascript__';
						});}
					});
					var __envir__ = __Envir__ ();
					__pragma__ ('<all>')
						__all__.__Envir__ = __Envir__;
						__all__.__envir__ = __envir__;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'org.transcrypt.__standard__', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var Exception = __class__ ('Exception', [object], {
						get __init__ () {return __get__ (this, function (self) {
							var args = tuple ([].slice.apply (arguments).slice (1));
							self.args = args;
						});},
						get __repr__ () {return __get__ (this, function (self) {
							if (len (self.args)) {
								return '{}{}'.format (self.__class__.__name__, repr (tuple (self.args)));
							}
							else {
								return '???';
							}
						});},
						get __str__ () {return __get__ (this, function (self) {
							if (len (self.args) > 1) {
								return str (tuple (self.args));
							}
							else {
								if (len (self.args)) {
									return str (self.args [0]);
								}
								else {
									return '???';
								}
							}
						});}
					});
					var ValueError = __class__ ('ValueError', [Exception], {
					});
					var __sort__ = function (iterable, key, reverse) {
						if (typeof key == 'undefined' || (key != null && key .__class__ == __kwargdict__)) {;
							var key = null;
						};
						if (typeof reverse == 'undefined' || (reverse != null && reverse .__class__ == __kwargdict__)) {;
							var reverse = false;
						};
						if (arguments.length) {
							var __ilastarg0__ = arguments.length - 1;
							if (arguments [__ilastarg0__] && arguments [__ilastarg0__].__class__ == __kwargdict__) {
								var __allkwargs0__ = arguments [__ilastarg0__--];
								for (var __attrib0__ in __allkwargs0__) {
									switch (__attrib0__) {
										case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
										case 'key': var key = __allkwargs0__ [__attrib0__]; break;
										case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
									}
								}
							}
						}
						if (key) {
							iterable.sort ((function __lambda__ (a, b) {
								if (arguments.length) {
									var __ilastarg0__ = arguments.length - 1;
									if (arguments [__ilastarg0__] && arguments [__ilastarg0__].__class__ == __kwargdict__) {
										var __allkwargs0__ = arguments [__ilastarg0__--];
										for (var __attrib0__ in __allkwargs0__) {
											switch (__attrib0__) {
												case 'a': var a = __allkwargs0__ [__attrib0__]; break;
												case 'b': var b = __allkwargs0__ [__attrib0__]; break;
											}
										}
									}
								}
								return key (a) > key (b);}));
						}
						else {
							iterable.sort ();
						}
						if (reverse) {
							iterable.reverse ();
						}
					};
					var sorted = function (iterable, key, reverse) {
						if (typeof key == 'undefined' || (key != null && key .__class__ == __kwargdict__)) {;
							var key = null;
						};
						if (typeof reverse == 'undefined' || (reverse != null && reverse .__class__ == __kwargdict__)) {;
							var reverse = false;
						};
						if (arguments.length) {
							var __ilastarg0__ = arguments.length - 1;
							if (arguments [__ilastarg0__] && arguments [__ilastarg0__].__class__ == __kwargdict__) {
								var __allkwargs0__ = arguments [__ilastarg0__--];
								for (var __attrib0__ in __allkwargs0__) {
									switch (__attrib0__) {
										case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
										case 'key': var key = __allkwargs0__ [__attrib0__]; break;
										case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
									}
								}
							}
						}
						if (type (iterable) == dict) {
							var result = copy (iterable.py_keys ());
						}
						else {
							var result = copy (iterable);
						}
						__sort__ (result, key, reverse);
						return result;
					};
					__pragma__ ('<all>')
						__all__.Exception = Exception;
						__all__.ValueError = ValueError;
						__all__.__sort__ = __sort__;
						__all__.sorted = sorted;
					__pragma__ ('</all>')
				}
			}
		}
	);

	// Initialize non-nested modules __base__ and __standard__ and make its names available directly and via __all__
	// It can't do that itself, because it is a regular Python module
	// The compiler recognizes its their namesand generates them inline rather than nesting them
	// In this way it isn't needed to import them everywhere
	 	
	__nest__ (__all__, '', __init__ (__all__.org.transcrypt.__base__));
	var __envir__ = __all__.__envir__;

	__nest__ (__all__, '', __init__ (__all__.org.transcrypt.__standard__));
	var Exception = __all__.Exception;
	var __sort__ = __all__.__sort__;
	var sorted = __all__.sorted;

	// Complete __envir__, that was created in __base__, for non-stub mode
	__envir__.executor_name = __envir__.transpiler_name;
	
	// Make make __main__ available in browser
	var __main__ = {__file__: ''};
	__all__.main = __main__;
	
	// Define current exception, there's at most one exception in the air at any time
	var __except__ = null;
	__all__.__except__ = __except__;
		
	// Define recognizable dictionary for **kwargs parameter
	var __kwargdict__ = function (anObject) {
		anObject.__class__ = __kwargdict__;	// This class needs no __name__
		anObject.constructor = Object;
		return anObject;
	}
	__all__.___kwargdict__ = __kwargdict__;
	
	// Property installer function, no member since that would bloat classes
	var property = function (getter, setter) {	// Returns a property descriptor rather than a property
		if (!setter) {	// ??? Make setter optional instead of dummy?
			setter = function () {};
		}
		return {get: function () {return getter (this)}, set: function (value) {setter (this, value)}, enumerable: true};
	}
	__all__.property = property;
	
	var __merge__ = function (object0, object1) {
		var result = {};
		for (var attrib in object0) {
			result [attrib] = object0 [attrib];
		}
		for (var attrib in object1) {
			result [attrib] = object1 [attrib];
		}
		return result;
	}
	__all__.__merge__ = __merge__;
	
	// Console message
	var print = function () {
		var args = [] .slice.apply (arguments)
		var result = ''
		for (var i = 0; i < args.length; i++) {
			result += str (args [i]) + ' ';
		}
		console.log (result);
	};
	__all__.print = print;
	
	// Make console.log understand apply
	console.log.apply = function () {
		print ([] .slice.apply (arguments) .slice (1));
	};

	// In function, used to mimic Python's in operator
	var __in__ = function (element, container) {
		if (type (container) == dict) {
			return container.py_keys () .indexOf (element) > -1;
		}
		else {
			return container.indexOf (element) > -1;
		}
	}
	__all__.__in__ = __in__;
	
	// Find out if an attribute is special
	var __specialattrib__ = function (attrib) {
		return (attrib.startswith ('__') && attrib.endswith ('__')) || attrib == 'constructor' || attrib.startswith ('py_');
	}
	__all__.__specialattrib__ = __specialattrib__;
		
	// Len function for any object
	var len = function (anObject) {
		try {
			return anObject.length;
		}
		catch (exception) {
			var result = 0;
			for (attrib in anObject) {
				if (!__specialattrib__ (attrib)) {
					result++;
				}
			}
			return result;
		}
	};
	__all__.len = len;
	
	var bool = {__name__: 'bool'}
	__all__.bool = bool;
	
	var float = function (any) {
		if (isNaN (any)) {
			throw ('ValueError');	// !!! Turn into real value error
		}
		else {
			return +any;
		}
	}
	float.__name__ = 'float'
	__all__.float = float;
	
	var int = function (any) {
		return float (any) | 0
	}
	int.__name__ = 'int';
	__all__.int = int;
	
	var type = function (anObject) {
		try {
			return anObject.__class__;
		}
		catch (exception) {
			var aType = typeof anObject;
			if (aType == 'boolean') {
				return bool;
			}
			else if (aType == 'number') {
				if (anObject % 1 == 0) {
					return int;
				}
				else {
					return float;
				}				
			}
			else {
				return aType;
			}
		}
	}
	__all__.type = type;
	
	var isinstance = function (anObject, classinfo) {
		function isA (queryClass) {
			if (queryClass == classinfo) {
				return true;
			}
			for (var index = 0; index < queryClass.__bases__.length; index++) {
				if (isA (queryClass.__bases__ [index], classinfo)) {
					return true;
				}
			}
			return false;
		}
		return isA (anObject.__class__)
	};
	__all__.isinstance = isinstance;
	
	// Repr function uses __repr__ method, then __str__ then toString
	var repr = function (anObject) {
		try {
			return anObject.__repr__ ();
		}
		catch (exception) {
			try {
				return anObject.__str__ ();
			}
			catch (exception) {	// It was a dict in Python, so an Object in JavaScript
				try {
					if (anObject.constructor == Object) {
						var result = '{';
						var comma = false;
						for (var attrib in anObject) {
							if (!__specialattrib__ (attrib)) {
								if (attrib.isnumeric ()) {
									var attribRepr = attrib;				// If key can be interpreted as numerical, we make it numerical 
								}											// So we accept that '1' is misrepresented as 1
								else {
									var attribRepr = '\'' + attrib + '\'';	// Alpha key in dict
								}
								
								if (comma) {
									result += ', ';
								}
								else {
									comma = true;
								}
								try {
									result += attribRepr + ': ' + anObject [attrib] .__repr__ ();
								}
								catch (exception) {
									result += attribRepr + ': ' + anObject [attrib] .toString ();
								}
							}
						}
						result += '}';
						return result;					
					}
					else {
						return typeof anObject == 'boolean' ? anObject.toString () .capitalize () : anObject.toString ();
					}
				}
				catch (exception) {
					console.log ('ERROR: Could not evaluate repr (<object of type ' + typeof anObject + '>)');
					return '???';
				}
			}
		}
	}
	__all__.repr = repr;
	
	// Char from Unicode or ASCII
	
	var chr = function (charCode) {
		return String.fromCharCode (charCode);
	}
	__all__.chr = chr;

	// Unicode or ASCII from char
	
	var ord = function (aChar) {
		return aChar.charCodeAt (0);
	}
	__all__.org = ord;
	
	// Reversed function for arrays
	var reversed = function (iterable) {
		iterable = iterable.slice ();
		iterable.reverse ();
		return iterable;
	}
	
	// Zip method for arrays
	var zip = function () {
		var args = [] .slice.call (arguments);
		var shortest = args.length == 0 ? [] : args.reduce (	// Find shortest array in arguments
			function (array0, array1) {
				return array0.length < array1.length ? array0 : array1;
			}
		);
		return shortest.map (					// Map each element of shortest array
			function (current, index) {			// To the result of this function
				return args.map (				// Map each array in arguments
					function (current) {		// To the result of this function
						return current [index]; // Namely it's index't entry
					}
				);
			}
		);
	}
	__all__.zip = zip;
	
	// Range method, returning an array
	function range (start, stop, step) {
		if (typeof stop == 'undefined') {
			// one param defined
			stop = start;
			start = 0;
		}
		if (typeof step == 'undefined') {
			step = 1;
		}
		if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
			return [];
		}
		var result = [];
		for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
			result.push(i);
		}
		return result;
	};
	__all__.range = range;
	
	// Enumerate method, returning a zipped list
	function enumerate (iterable) {
		return zip (range (len (iterable)), iterable);
	}
	__all__.enumerate = enumerate;
		
	// Shallow and deepcopy
	
	function copy (anObject) {
		if (anObject == null || typeof anObject == "object") {
			return anObject;
		}
		else {
			var result = {}
			for (var attrib in obj) {
				if (anObject.hasOwnProperty (attrib)) {
					result [attrib] = anObject [attrib];
				}
			}
			return result;
		}
	}
	__all__.copy = copy;
	
	function deepcopy (anObject) {
		if (anObject == null || typeof anObject == "object") {
			return anObject;
		}
		else {
			var result = {}
			for (var attrib in obj) {
				if (anObject.hasOwnProperty (attrib)) {
					result [attrib] = deepcopy (anObject [attrib]);
				}
			}
			return result;
		}
	}
	__all__.deepcopy = deepcopy;
		
	// List extensions to Array
	
	function list (iterable) {										// All such creators should be callable without new
		var instance = iterable ? [] .slice.apply (iterable) : [];	// Spread iterable, n.b. array.slice (), so array before dot
		// Sort is the normal JavaScript sort, Python sort is a non-member function
		return instance;
	}
	__all__.list = list;
	Array.prototype.__class__ = list;	// All arrays are lists (not only if constructed by the list ctor), unless constructed otherwise
	list.__name__ = 'list';
	
	Array.prototype.__getslice__ = function (start, stop, step) {
		if (start < 0) {
			start = this.length + start;
		}
		
		if (stop == null) {
			stop = this.length;
		}
		else if (stop < 0) {
			stop = this.length + stop;
		}
		
		var result = list ([]);
		for (var index = start; index < stop; index += step) {
			result.push (this [index]);
		}
		
		return result;
	}
		
	Array.prototype.__setslice__ = function (start, stop, step, source) {
		if (start < 0) {
			start = this.length + start;
		}
			
		if (stop == null) {
			stop = this.length;
		}
		else if (stop < 0) {
			stop = this.length + stop;
		}
			
		if (step == null) {	// Assign to 'ordinary' slice, replace subsequence
			Array.prototype.splice.apply (this, [start, stop - start] .concat (source)) 
		}
		else {				// Assign to extended slice, replace designated items one by one
			var sourceIndex = 0;
			for (var targetIndex = start; targetIndex < stop; targetIndex += step) {
				this [targetIndex] = source [sourceIndex++];
			}
		}
	}
		
	Array.prototype.__repr__ = function () {
		if (this.__class__ == set && !this.length) {
			return 'set()';
		}
		
		var result = !this.__class__ || this.__class__ == list ? '[' : this.__class__ == tuple ? '(' : '{';
		
		for (var index = 0; index < this.length; index++) {
			if (index) {
				result += ', ';
			}
			try {
				result += this [index] .__repr__ ();
			}
			catch (exception) {
				result += this [index] .toString ();
			}
		}
		
		if (this.__class__ == tuple && this.length == 1) {
			result += ',';
		}
		
		result += !this.__class__ || this.__class__ == list ? ']' : this.__class__ == tuple ? ')' : '}';;
		return result;
	};
	
	Array.prototype.__str__ = Array.prototype.__repr__;
	
	Array.prototype.append = function (element) {
		this.push (element);
	};

	Array.prototype.clear = function () {
		this.length = 0;
	};
	
	Array.prototype.extend = function (aList) {
		this.push.apply (this, aList);
	};
	
	Array.prototype.insert = function (index, element) {
		this.splice (index, 0, element);
	};

	Array.prototype.remove = function (element) {
		var index = this.indexOf (element);
		if (index == -1) {
			throw ('KeyError');
		}
		this.splice (index, 1);
	};

	Array.prototype.index = function (element) {
		return this.indexOf (element)
	};
	
	Array.prototype.py_pop = function (index) {
		if (index == undefined) {
			return this.pop ()	// Remove last element
		}
		else {
			return this.splice (index, 1) [0];
		}
	};	
	
	Array.prototype.py_sort = function () {
		__sort__.apply  (null, [this].concat ([] .slice.apply (arguments)));	// Can't work directly with arguments
		// Python params: (iterable, key = None, reverse = False)
		// py_sort is called with the Transcrypt kwargs mechanism, and just passes the params on to __sort__
		// __sort__ is def'ed with the Transcrypt kwargs mechanism
	};
	
	// Tuple extensions to Array
	
	function tuple (iterable) {
		var instance = iterable ? [] .slice.apply (iterable) : [];
		instance.__class__ = tuple;	// Not all arrays are tuples
		return instance;
	}
	__all__.tuple = tuple;
	tuple.__name__ = 'tuple';
	
	// Set extensions to Array
	// N.B. Since sets are unordered, set operations will occasionally alter the 'this' array by sorting it
		
	function set (iterable) {
		var instance = [];
		if (iterable) {
			for (var index = 0; index < iterable.length; index++) {
				instance.add (iterable [index]);
			}
			
			
		}
		instance.__class__ = set;	// Not all arrays are sets
		return instance;
	}
	__all__.set = set;
	set.__name__ = 'set';
	
	Array.prototype.__bindexOf__ = function (element) {	// Used to turn O (n^2) into O (n log n)
	// Since sorting is lex, compare has to be lex. This also allows for mixed lists
	
		element += '';
	
		var mindex = 0;
		var maxdex = this.length - 1;
			 
		while (mindex <= maxdex) {
			var index = (mindex + maxdex) / 2 | 0;
			var middle = this [index] + '';
	 
			if (middle < element) {
				mindex = index + 1;
			}
			else if (middle > element) {
				maxdex = index - 1;
			}
			else {
				return index;
			}
		}
	 
		return -1;
	}
	
	Array.prototype.add = function (element) {		
		if (this.indexOf (element) == -1) {	// Avoid duplicates in set
			this.push (element);
		}
	};
	
	Array.prototype.discard = function (element) {
		var index = this.indexOf (element);
		if (index != -1) {
			this.splice (index, 1);
		}
	};
	
	Array.prototype.isdisjoint = function (other) {
		this.sort ();
		for (var i = 0; i < other.length; i++) {
			if (this.__bindexOf__ (other [i]) != -1) {
				return false;
			}
		}
		return true;
	};
	
	Array.prototype.issuperset = function (other) {
		this.sort ();
		for (var i = 0; i < other.length; i++) {
			if (this.__bindexOf__ (other [i]) == -1) {
				return false;
			}
		}
		return true;
	};
	
	Array.prototype.issubset = function (other) {
		return set (other.slice ()) .issuperset (this);	// Sort copy of 'other', not 'other' itself, since it may be an ordered sequence
	};
	
	Array.prototype.union = function (other) {
		var result = set (this.slice () .sort ());
		for (var i = 0; i < other.length; i++) {
			if (result.__bindexOf__ (other [i]) == -1) {
				result.push (other [i]);
			}
		}
		return result;
	};
	
	Array.prototype.intersection = function (other) {
		this.sort ();
		var result = set ();
		for (var i = 0; i < other.length; i++) {
			if (this.__bindexOf__ (other [i]) != -1) {
				result.push (other [i]);
			}
		}
		return result;
	};
	
	Array.prototype.difference = function (other) {
		var sother = set (other.slice () .sort ());
		var result = set ();
		for (var i = 0; i < this.length; i++) {
			if (sother.__bindexOf__ (this [i]) == -1) {
				result.push (this [i]);
			}
		}
		return result;
	};
	
	Array.prototype.symmetric_difference = function (other) {
		return this.union (other) .difference (this.intersection (other));
	};
	
	Array.prototype.update = function () {	// O (n)
		var updated = [] .concat.apply (this.slice (), arguments) .sort ();		
		this.clear ();
		for (var i = 0; i < updated.length; i++) {
			if (updated [i] != updated [i - 1]) {
				this.push (updated [i]);
			}
		}
	};
	
	// Dict extensions to object
	
	function __keys__ () {
		var keys = []
		for (var attrib in this) {
			if (!__specialattrib__ (attrib)) {
				keys.push (attrib);
			}     
		}
		return keys;
	}
	__all__.__keys__ = __keys__;
		
	function __items__ () {
		var items = []
		for (var attrib in this) {
			if (!__specialattrib__ (attrib)) {
				items.push ([attrib, this [attrib]]);
			}     
		}
		return items;
	}
	__all__.__items__ = __items__;
		
	function __del__ (key) {
		delete this [key];
	}
	
	__all__.__del__ = __del__;
		
	function dict (objectOrPairs) {
		if (!objectOrPairs || objectOrPairs instanceof Array) {	// It's undefined or an array of pairs
			var instance = {};
			if (objectOrPairs) {
				for (var index = 0; index < objectOrPairs.length; index++) {
					var pair = objectOrPairs [index];
					instance [pair [0]] = pair [1];
				}
			}
		}
		else {													// It's a JavaScript object literal
			var instance = objectOrPairs;
		}
			
		// Trancrypt interprets e.g. {aKey: 'aValue'} as a Python dict literal rather than a JavaScript object literal
		// So dict literals rather than bare Object literals will be passed to JavaScript libraries
		// Some JavaScript libraries call all enumerable callable properties of an object that's passed to them
		// So the properties of a dict should be non-enumerable
		Object.defineProperty (instance, '__class__', {value: dict, enumerable: false, writable: true});
		Object.defineProperty (instance, 'py_keys', {value: __keys__, enumerable: false});			
		Object.defineProperty (instance, 'py_items', {value: __items__, enumerable: false});		
		Object.defineProperty (instance, 'py_del', {value: __del__, enumerable: false});
		
		return instance;
	}
	__all__.dict = dict;
	dict.__name__ = 'dict';
	
	// String extensions
		
	function str (stringable) {
		try {
			return stringable.__str__ ();
		}
		catch (e) {
			return new String (stringable);
		}
	}
	__all__.str = str;	
	
	String.prototype.__class__ = str;	// All strings are str
	str.__name__ = 'str';
	
	String.prototype.__repr__ = function () {
		return (this.indexOf ('\'') == -1 ? '\'' + this + '\'' : '"' + this + '"') .replace ('\n', '\\n');
	};
	
	String.prototype.__str__ = function () {
		return this;
	};
	
	String.prototype.capitalize = function () {
		return this.charAt (0).toUpperCase () + this.slice (1);
	};
	
	String.prototype.endswith = function (suffix) {
		return suffix == '' || this.slice (-suffix.length) == suffix;
	};
	
	String.prototype.find  = function (sub, start) {
		return this.indexOf (sub, start);
	};
	
	// Since it's worthwhile for the 'format' function to be able to deal with *args, it is defined as a property
	// __get__ will produce a bound function if there's something before the dot
	// Since a call using *args is compiled to e.g. <object>.<function>.apply (null, args), the function has to be bound already
	// Otherwise it will never be, because of the null argument
	// Using 'this' rather than 'null' contradicts the requirement to be able to pass bound functions around
	// The object 'before the dot' won't be available at call time in that case, unless implicitly via the function bound to it
	// While for Python methods this mechanism is generated by the compiler, for JavaScript methods it has to be provided manually
	// Call memoizing is unattractive here, since every string would then have to hold a reference to a bound format method
	Object.defineProperty (String.prototype, 'format', {
		get: function () {return __get__ (this, function (self) {
			var args = tuple ([] .slice.apply (arguments).slice (1));			
			var autoIndex = 0;
			return self.replace (/\{(\w*)\}/g, function (match, key) { 
				if (key == '') {
					key = autoIndex++;
				}
				if (key == +key) {	// So key is numerical
					return args [key] == 'undefined' ? match : args [key];
				}
				else {				// Key is a string
					for (var index = 0; index < args.length; index++) {
						// Find first 'dict' that has that key and the right field
						if (typeof args [index] == 'object' && typeof args [index][key] != 'undefined') {
							return args [index][key];	// Return that field field
						}
					}
					return match;
				}
			});
		});},
		enumerable: true
	});
	
	String.prototype.isnumeric = function () {
		return !isNaN (parseFloat (this)) && isFinite (this);
	};
	
	String.prototype.join = function (aList) {
		return aList.join (this);
	};
	
	String.prototype.lower = function () {
		return this.toLowerCase ();
	};
	
	String.prototype.py_replace = function (old, aNew, maxreplace) {
		return this.split (old, maxreplace) .join (aNew);
	};
	
	String.prototype.lstrip = function () {
		return this.replace (/^\s*/g, '');
	};
	
	String.prototype.rfind = function (sub, start) {
		return this.lastIndexOf (sub, start);
	};
	
	String.prototype.rsplit = function (sep, maxsplit) {
		var split = this.split (sep || /s+/);
		return maxsplit ? [ split.slice (0, -maxsplit) .join (sep) ].concat (split.slice (-maxsplit)) : split;
	};
	
	String.prototype.rstrip = function () {
		return this.replace (/\s*$/g, '');
	};
	
	String.prototype.py_split = function (sep, maxsplit) {
		if (!sep) {
			sep = ' ';
		}
		return this.split (sep || /s+/, maxsplit);
	};
	
	String.prototype.startswith = function (prefix) {
		return this.indexOf (prefix) == 0;
	};
	
	String.prototype.strip = function () {
		return this.trim ();
	};
		
	String.prototype.upper = function () {
		return this.toUpperCase ();
	};
	
	// Operator overloading, only the ones that make most sense in matrix operations
	
	var __neg__ = function (a) {
		if (typeof a == 'object' && '__neg__' in a) {
			return a.__neg__ ();
		}
		else {
			return -a;
		}
	};  
	__all__.__neg__ = __neg__;
	
	var __matmul__ = function (a, b) {
		return a.__matmul__ (b);
	};  
	__all__.__matmul__ = __matmul__;
	
	var __mul__ = function (a, b) {
		if (typeof a == 'object' && '__mul__' in a) {
			return a.__mul__ (b);
		}
		else if (typeof b == 'object' && '__rmul__' in b) {
			return b.__rmul__ (a);
		}
		else {
			return a * b;
		}
	};  
	__all__.__mul__ = __mul__;
	
	var __div__ = function (a, b) {
		if (typeof a == 'object' && '__div__' in a) {
			return a.__div__ (b);
		}
		else if (typeof b == 'object' && '__rdiv__' in b) {
			return b.__rdiv__ (a);
		}
		else {
			return a / b;
		}
	};  
	__all__.__div__ = __div__;
	
	var __add__ = function (a, b) {
		if (typeof a == 'object' && '__add__' in a) {
			return a.__add__ (b);
		}
		else if (typeof b == 'object' && '__radd__' in b) {
			return b.__radd__ (a);
		}
		else {
			return a + b;
		}
	};  
	__all__.__add__ = __add__;
	
	var __sub__ = function (a, b) {
		if (typeof a == 'object' && '__sub__' in a) {
			return a.__sub__ (b);
		}
		else if (typeof b == 'object' && '__rsub__' in b) {
			return b.__rsub__ (a);
		}
		else {
			return a - b;
		}
	};  
	__all__.__sub__ = __sub__;
	
	var __getitem__ = function (container, key) {
		if (typeof container == 'object' && '__getitem__' in container) {
			return container.__getitem__ (key);
		}
		else {
			return container [key];
		}
	};
	__all__.__getitem__ = __getitem__;

	var __setitem__ = function (container, key, value) {
		if (typeof container == 'object' && '__setitem__' in container) {
			container.__setitem__ (key, value);
		}
		else {
			container [key] = value;
		}
	};
	__all__.__setitem__ = __setitem__;

	var __getslice__ = function (container, lower, upper, step) {
		if (typeof container == 'object' && '__getitem__' in container) {
			return container.__getitem__ ([lower, upper, step]);
		}
		else {
			return container.__getslice__ (lower, upper, step);
		}
	};
	__all__.__getslice__ = __getslice__;

	var __setslice__ = function (container, lower, upper, step, value) {
		if (typeof container == 'object' && '__setitem__' in container) {
			container.__setitem__ ([lower, upper, step], value);
		}
		else {
			container.__setslice__ (lower, upper, step, value);
		}
	};
	__all__.__setslice__ = __setslice__;

	var __call__ = function (/* <callee>, <params>* */) {
		var args = [] .slice.apply (arguments)
		if (typeof args [0] == 'object' && '__call__' in args [0]) {
			return args [0] .__call__ .apply (null,  args.slice (1));
		}
		else {
			return args [0] .apply (null, args.slice (1));
		}		
	};
	__all__.__call__ = __call__;

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
	return __all__;
}
window ['request_track'] = request_track ();
