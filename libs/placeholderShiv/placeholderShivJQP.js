/*
** PlaceholderShiv by Jørn Kinderås - 2012 **

REQUIREMENTS:
This jQuery plugin requires jQuery 1.7.1 or better.

DESCRIPTION:
This plugin will mimic the HTML 5 placeholder attribute
for the passed input element(s). It will also add the actual
placeholder attribute for maximum compability with newer browsers.

EXAMPLE USAGE:
$('input').setupPlaceholderShiv();

*/
(function($) {
	$.fn.setupPlaceholderShiv = function() {
	  	var plColor, includeTypes;
	    plColor = "#999";
	    
	    return this.each(function(index, element){
	    	var elem = $(element);
	    	if(elem.is('input')){
	    		element.defaultColor = elem.css('color');
	    		element.placeholderText = elem.val();
				elem.attr('placeholder',elem[0].placeholderText);
				elem.css('color',plColor);

				elem.on('focus', function(e){
					if($(this).val() === this.placeholderText){
						$(this).val('');
						$(this).css('color', this.defaultColor);
					}
				});
				elem.on('blur', function(e){
					if($(this).val() === ""){
						$(this).val(this.placeholderText);
						$(this).css('color', plColor);
					}
				});
	    	}
	    });
	};
})(jQuery);