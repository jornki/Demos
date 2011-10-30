/**
DEVICE COMPASS DEMO BY JØRN KINDERÅS 23.11.2011

This demo shows how to listen for and compass events
dispatched along with the "deviceorientation" event.
Note that this only wotks for iOS 5 and newer.
**/

document.addEventListener('DOMContentLoaded', init, false);

var image;

function init()
{	
	image = document.createElement('img');
	image.style.height = "300px";
	image.style.width  = "300px";
	document.body.appendChild(image);
	image.onload = function(){
		window.addEventListener('deviceorientation', orientationHandler, false);
	}
	image.src = "arrow.png";
}

function orientationHandler(e)
{
	if(e.webkitCompassAccuracy === -1){
		alert("To much compass interference");
		return false;	
	}
	image.style.webkitTransform = "rotateZ("+(180 - e.webkitCompassHeading)+"deg)";
	return true;
}