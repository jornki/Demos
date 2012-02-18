(function($) {
	"use strict"
	$.fn.tap = function(callback) {
		if(!"ontouchstart" in window){
			throw "Tap only works on touch devices";
    		return this;
		}

		var version, didMove, tapCancelTime, startTime, endTime, _bind;
		version = "1.0.0";
    	tapCancelTime = 2 * 1000;
		_bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
		
	  	return this.each(function(index, element){
	  		var elem = $(element);

	  		elem.on('touchstart', _bind(function(e){
	  			didMove = false;
	  			startTime = new Date().getTime();
	  		},this));
	  		elem.on('touchmove', _bind(function(e){
	  			didMove = true;
	  		},this));
	  		elem.on('touchend', _bind(function(e){
	  			endTime = new Date().getTime();
	  			if(!didMove && ((endTime - startTime) < tapCancelTime)){
	  				callback(e);
	  			}
	  		},this));
	  		elem.on('touchcancel', _bind(function(e){
	  			callback(e);
	  		},this));
	  	});
	};
})(jQuery);