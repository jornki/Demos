/*
** Tap event by Jørn Kinderås - 2012 **

REQUIREMENTS:
The "tap" event can only be used on touch enabled devices - duh!

DESCRIPTION:
The "tap" event library will extend any Object, adding a "tap" method
which will handle common touch event best practices. A tap is defined as:
- The user places his finger on the screen
- The user lifts his finger off the screen within 2 seconds without moving it

If the user moves his finger after having placed it on the screen, a "tap"
will not fire. This allows for UIs where the user can "grab" an UI element
and scroll past it without triggering an action. If the user waits over 2 seconds
to lift his finger off an object no event will fire.

USAGE:
1. Get an object using e.g. document.getElementById('elem')
2. Add the tap event to the object and pass a callback function.

EXAMPLE:
var myDiv = document.getElementById('elem');
myDiv.tap(function(e){
    if(e.type === "cancel"){
        // The event was canceled, like when a phonecall comes in
    }else{
        // Look at the touches object
        console.log(e.touches);
    } 
});

ARGUMENTS:
You do need to pass an event handler function. This function
will be called when a tap occurs. The original event object
will be passed to your event handler. This event object is 
usually a "touchend" event object, but it also might be a
"touchcancel" object, in which case you do need to handle it.
See the example above for how to do this.
*/
(function(){
    "use strict";

    Object.prototype.tap = function(callback)
    {
    	if(!this.addEventListener || !("ontouchstart" in window)){
    		throw "Tap only works on touch devices";
    		return false;
    	}

    	var version, didMove, tapCancelTime, startTime, endTime, _bind;

    	version = "1.0.1";
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