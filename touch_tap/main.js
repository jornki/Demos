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
    			$(output).html("Tap fired from jqPlugin on " + "\"" + $(e.target).attr('id') + "\"");
    		}else{
    			//It's a standard event
    			output.innerHTML = "Tap fired from js lib on " + "\"" + e.target.getAttribute('id') + "\"";
    		}
    	}
        setTimeout(function(){
            return output.innerHTML = 'Reset';
        }, 2000);
    }

    init = function()
    {
    	var regDiv,jqDiv;

	    regDiv = document.getElementById('aDiv');
	    jqDiv  = $('#jqDiv');
	    output = document.getElementById('out');

	    regDiv.tap(tapEventHandler);
        jqDiv.tap(tapEventHandler);

        return false;
    }

    if(document.addEventListener){
        document.addEventListener('DOMContentLoaded', init, false);
    }else{
        window.onload = init;
    }

}).call(this);