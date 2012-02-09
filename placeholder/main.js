(function(){
    
    if(document.addEventListener){
        document.addEventListener('DOMContentLoaded', init, false);
    }else{
        window.onload = init;
    }

    function init()
    {
	    pls = new PlaceholderScanner({placeholderColor:"#F3C",includeTypes:['search','url']});
    }

}).call(this);
