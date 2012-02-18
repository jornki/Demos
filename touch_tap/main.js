(function(){
	"use strict";

    var init, tapEventHandler, output; 
    
    tapEventHandler = function(e)
    {
    	e.preventDefault();
    	if(e.type === "cancel"){
    		//reset UI or whatever
    	}else{
    		//do awesome stuff
    		if(e.originalEvent){
    			//It's a jquery event
    			$(output).html("Tap fired from jqPlugin on " + e.target);
    		}else{
    			//It's a standard event
    			output.innerHTML = "Tap fired from js lib on " + e.target;
    		}
    	}
    }

    init = function()
    {
    	var div,link;

	    div = document.getElementById('aDiv');
	    link = document.getElementById('aLink');
	    output = document.getElementById('out');

	    div.tap(tapEventHandler);
	    link.tap(tapEventHandler);
	    //$(div).tap(tapEventHandler);
    }

    if(document.addEventListener){
        document.addEventListener('DOMContentLoaded', init, false);
    }else{
        window.onload = init;
    }

}).call(this);