var itemsAr = new Array();

var startTime;

function hasProperty(num)
{
	if(num == 5)
		return true
	return false	
}

$(function(){
	var _i;
	for(_i = 0; _i< 1000000;_i++){
		itemsAr.push(Math.floor(Math.random() * 500));
	}
	console.log("Done generating - > Testing");

	startTime = new Date().getTime();

	/*for(_i = 0; _i< itemsAr.length;_i++){
		hasProperty(itemsAr[_i]);
	}*/
	$.each(itemsAr, function(index, val){
		hasProperty(val);
	});
	/*itemsAr.forEach(function(element, index, ar){
		hasProperty(element);
	});*/

	endTime = new Date().getTime();
	dur = endTime - startTime;

	console.log("It took " +dur+ " milisec");
});