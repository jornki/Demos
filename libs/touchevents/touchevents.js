(function(){
    "use strict";

    Object.prototype.tap = function(callback)
    {
    	if(!this.addEventListener || !"ontouchstart" in window){
    		throw "Tap only works on touch devices";
    		return false;
    	}

    	var version, didMove, tapCancelTime, startTime, endTime, _bind;

    	version = "1.0.0";
    	tapCancelTime = 2 * 1000;
    	_bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    	this.addEventListener('touchstart',_bind(function(e){
    		startTime = new Date().getTime();
    		didMove = false;
    	}, this));
    	this.addEventListener('touchmove',_bind(function(e){
    		didMove = true;
    	}, this));
    	this.addEventListener('touchend',_bind(function(e){
    		endTime = new Date().getTime();
    		if(!didMove && ((endTime - startTime) < tapCancelTime)){
    			callback(e);
    		}
    	}, this));
    	this.addEventListener('touchcancel',_bind(function(e){
    		callback(e);
    	},this));
    }

}).call(this);