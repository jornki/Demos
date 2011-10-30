/**
DEVICE ORIENTATION DEMO BY JØRN KINDERÅS 26.06.2011

This demo shows how to listen for and use device motion events
provided by the build-in gyroscope and accelerometer.
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
	image.style.webkitTransform = "perspective(500) rotateZ("+e.alpha+"deg) rotateX("+e.beta+"deg) rotateY("+e.gamma+"deg)";
}