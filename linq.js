;(function () {
	function Clone(item){
		return JSON.parse(JSON.stringify(item));
	}
	
	function IGrouping(key, value) {
		// Grouping inteface to behave in the same way as C# interface
		// when using LINQ on a group you directly reference the Value
		this.Key = key;
		this.Value = value;
	}
	// setup the LINQ functions on IGrouping class
	IGrouping.prototype.Select 				= function(e){ return Clone(this.Value).Select(e); };
	IGrouping.prototype.Where 				= function(e){ return Clone(this.Value).Where(e); };	
	IGrouping.prototype.FirstOrDefault 		= function(e){ return Clone(this.Value).FirstOrDefault(e); };
	IGrouping.prototype.ToArray 			= function(e){ return Clone(this.Value).ToArray(e); };
	IGrouping.prototype.GroupBy 			= function(e){ return Clone(this.Value).GroupBy(e); };
	IGrouping.prototype.Sum 				= function(e){ return Clone(this.Value).Sum(e); };
	IGrouping.prototype.First 				= function(e){ return Clone(this.Value).First(e); };
	IGrouping.prototype.Last 				= function(e){ return Clone(this.Value).Last(e); };
	IGrouping.prototype.LastOrDefault 		= function(e){ return Clone(this.Value).LastOrDefault(e); };
	IGrouping.prototype.All 				= function(e){ return Clone(this.Value).All(e); };
	IGrouping.prototype.Any 				= function(e){ return Clone(this.Value).Any(e); };
	IGrouping.prototype.Distinct 			= function(e){ return Clone(this.Value).Distinct(e); };
	IGrouping.prototype.IndexOf 			= function(e){ return Clone(this.Value).IndexOf(e); };
	IGrouping.prototype.OrderBy 			= function(e){ return Clone(this.Value).OrderBy(e); };
	IGrouping.prototype.OrderByDescending 	= function(e){ return Clone(this.Value).OrderByDescending(e); };
	IGrouping.prototype.Union 				= function(e){ return Clone(this.Value).Union(e); };
	IGrouping.prototype.ForEach 			= function(e){ return Clone(this.Value).ForEach(e); };
	
	// Get sum from array
	Object.defineProperty(Array.prototype, 'Sum', {
		value: function Sum(action) {
			var res = 0;
			
			for(var i = 0; i < this.length; i++){
				res += action ? action(this[i]) : this[i];	
			};
			
			return res;
		}
	});
	// select function on array
	Object.defineProperty(Array.prototype, 'Select', {
		value: function Select(action) {
			var res = [];
			for (var i = 0; i < this.length; i++) {
				res[i] = action(this[i]);
			}

			return res;
		}
	});
	// where function on array 
	Object.defineProperty(Array.prototype, 'Where', {
		value: function Where(action) {
			var res = [];

			for (var i = 0; i < this.length; i++) {
				if (action(this[i])) {
					res.push(this[i])
				}
			}

			return res;
		}
	});
	// groupby function on array
	Object.defineProperty(Array.prototype, 'GroupBy', {
		value: function GroupBy(action) {
			var res = [];

			function areSame(r) {
				return JSON.stringify(r.Key) === JSON.stringify(newObject);
			}

			for (var i = 0; i < this.length; i++) {
				var newObject = action(this[i]);

				if (res.some(areSame)) {
					res.filter(areSame)[0].Value.push(this[i]);
				} else {
					res.push(new IGrouping(
						newObject,
						[this[i]]
					));
				}
			}

			return res;
		}
	});
	
	// function to check and array and return a list of valid entires using action
	function valid(arr, action, callback){
		if(!action){
			 return arr;
		}

		// lets create a new array with the valid items
		var res = [];
		for(var i = 0; i < arr.length; i++){
			if(action(arr[i])){
				res.push(arr[i]);
			}
		}

		if(res.length > 0){
			return res;
		}
		
		if(callback){
			callback();
		}
	}
	
	// First or default function on array
	Object.defineProperty(Array.prototype, 'FirstOrDefault', {
		value: function FirstOrDefault(action) {
			var res = valid(this, action, function(){
				return null;	
			});
			
			if(res){
				return res[0] || null;
			}
		}
	});
	// First function on array
	Object.defineProperty(Array.prototype, 'First', {
		value: function First(action) {
			var res = valid(this, action, function(){
				throw "No elements in array";	
			});
			
			if(res){
				return res[0];
			}
		}
	});
	// Last or default function on array
	Object.defineProperty(Array.prototype, 'LastOrDefault', {
		value: function LastOrDefault(action) {
			var res = valid(this, action, function(){
				return null;	
			});
			
			if(res){
				return res[res.length - 1];
			}
		}
	})
	// Last function onarray
	Object.defineProperty(Array.prototype, 'Last', {
		value: function Last(action) {
			var res = valid(this, action, function(){
				throw "No elements in array";	
			});
			
			if(res){
				return res[res.length - 1];
			}			
		}
	});
	// function to return true or false if all meet criteria
	Object.defineProperty(Array.prototype, 'All', {
		value: function All(action) {
			for(var i = 0; i < this.length; i++){
				if(!action(this[i])){
					return false;
				}
			}
			
			return true;
		}
	});
	// function to return true or false if any meet criteria
	Object.defineProperty(Array.prototype, 'Any', {
		value: function Any(action) {
			for(var i = 0; i < this.length; i++){
				if(action(this[i])){
					return true;
				}
			}
			
			return false;
		}
	});
	// function to apply action to each in array
	Object.defineProperty(Array.prototype, 'ForEach', {
		value: function ForEach(action) {
			for(var i = 0; i < this.length; i++){
				action(this[i]);
			}
			
			return this;
		}
	});
	// function to return a distinct list from given array
	Object.defineProperty(Array.prototype, 'Distinct', {
		value: function Distinct(action) {
			var res = [];
			for(var i = 0; i < this.length; i++){
				var item = action ? action(this[i]) : this[i];
				var exists = res.some(function(r){ return JSON.stringify(action ? action(r) : r) === JSON.stringify(item) });
				
				if(!exists){
					res.push(this[i]);
				}
			}
			
			return res;
		}
	});
	// function to join two arrays
	Object.defineProperty(Array.prototype, 'Union', {
		value: function Union(array) {
			return this.concat(array);
		}
	});
	// function to get the index of item in array
	Object.defineProperty(Array.prototype, 'IndexOf', {
		value: function IndexOf(item) {
			// if item == object TODO
			for(var i = 0; i < this.length; i++){
				if(JSON.stringify(item) === JSON.stringify(this[i])){
					return i;
				}
			}
			
			return -1;
		}
	});
	// ToArray
	Object.defineProperty(Array.prototype, 'ToArray', {
		value: function ToArray() {
			return this;
		}
	});
	// function to order array
	Object.defineProperty(Array.prototype, 'OrderBy', {
		value: function OrderBy(action){
			return this.sort(
				function(a, b){
					return JSON.stringify(action ? action(a) : a).localeCompare(JSON.stringify(action ? action(b) : b)); 
				}
			).reverse(); // this will order by desc so we need to reverse
		}
	});
	// function to order array descending
	Object.defineProperty(Array.prototype, 'OrderByDescending', {
		value: function OrderByDescending(action){
			return this.OrderBy(action).reverse();
		}
	});
})();
