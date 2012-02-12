(function(){
    "use strict";

    $(function(){
    	$('#jsShiv').on('click', jsShivHandler);
    	$('#jqShiv').on('click', jqShivHandler);
    });

    function jsShivHandler(e)
    {
    	var start = new Date().getTime();
    	
    	//var pls = new PlaceholderShiv({placeholderColor:"#F3C",includeTypes:['search','url']});
    	var pls = new PlaceholderShiv();
    	
    	$('#out').html((new Date().getTime() - start) + " ms");
    }
    function jqShivHandler(e)
    {
    	var start = new Date().getTime();
    	
    	$('input').setupPlaceholderShiv();
    	
    	$('#out').html((new Date().getTime() - start) + " ms");
    }

}).call(this);
