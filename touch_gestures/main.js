/**
MULTI-TOUCH IMAGE DEMO BY JØRN KINDERÅS 03.04.2011

This demo shows you how to use gesture events combined
with touch events to transform an image.
**/

document.addEventListener('DOMContentLoaded', init, false);

/* Globals */

var elephants;

/****** Setting it up **************/

function init()
{
	// Check if we're on a touch device
    if('ongesturestart' in window == false){
        alert('Sorry, you need a multitouch enabled device to use this demo');
        return;
    }
    
    //Create the add elephant button
    var addButton = document.createElement('p');
    addButton.innerHTML = "Create an Elephant!";
    addButton.addEventListener('touchend',elephantButtonUpHandler, false);
    addButton.addEventListener('touchstart', elephantButtonDownHandler, false);
    document.body.insertBefore(addButton,document.getElementsByTagName('footer')[0]);
    
    //Create an array to hold all the images
    elephants = new Array();
    
    //Prevent the page itself from scrolling when dragging outside of an image
    document.addEventListener('touchmove', preventScrollingHandler, false);
}

//Handler for create button finger down state
function elephantButtonDownHandler(event)
{
	event.preventDefault();
	//Swap the class so the button ges red when the finger is down on it
	document.getElementsByTagName('p')[0].className = 'buttonDown';
}

//Handler for when the finger is lifted off the create button
function elephantButtonUpHandler(event)
{
	event.preventDefault();
	
	//Create a new instance of the touch image
	var touchImage = new TouchImage("elephant.jpg");
	//Add the new touchimage to the array
	elephants.push(touchImage);
	
	//Remove the down state and modify the text of the button
	document.getElementsByTagName('p')[0].className = '';
	document.getElementsByTagName('p')[0].innerHTML = "Create another elephant";
}

//Prevents the entire page from scrolling
function preventScrollingHandler(event)
{
	event.preventDefault();
}

/************ The touch image object ****************/

//The touch image
function TouchImage(source)
{
	this.image                = document.createElement('img');
	this.image.style.position = "absolute";
	this.source               = source;
	
	this.startScale = 0;
	this.startRotation = 0;
	this.rotation = 0;
	this.scale    = 1;
	this.posX     = 0;
	this.posY     = 0;
	this.posZ     = 0;
	this.offsetX  = 0;
	this.offsetY  = 0;
	
	this.load();
}

//Loading the actual image into the touchimage
TouchImage.prototype.load = function()
{
	var tImage = this;
	
	this.image.onload = function(){
		
		document.body.appendChild(this);
		
		//Add the gesture and touch event listeners to the image
    	tImage.image.addEventListener('gesturestart', tImage, false);
    	tImage.image.addEventListener('gesturechange', tImage, false);
    	tImage.image.addEventListener('gestureend', tImage, false);
    	tImage.image.addEventListener('touchcancel', tImage, false);
    	tImage.image.addEventListener('touchstart', tImage, false);
    	tImage.image.addEventListener('touchend', tImage, false);
    	
    	//Center the image on screen
    	tImage.posX = window.innerWidth * 0.5 - tImage.image.width * 0.5;
    	tImage.posY = window.innerHeight * 0.5 - tImage.image.height * 0.5;
    	
    	//Sort the images on screen in the z-axis
    	tImage.sortDepth(elephants);
	};
	this.image.src = this.source;
}

//Handle all events for the touch image
TouchImage.prototype.handleEvent = function(event)
{
	if(typeof(this[event.type]) === "function"){
		return this[event.type](event);
	}
}

//Applying transforms to the image within the object
TouchImage.prototype.applyTransforms = function()
{
	/* Note that we are using transform3d(), not transform().
	This is to trigger hardware rendering and to stack the images
	in the z-axis */
	var transform = 'translate3d(' + this.posX + 'px,' + this.posY + 'px, '+this.posZ+'px)';
	transform += ' rotate(' + this.rotation + 'deg)';
	transform += ' scale(' + this.scale + ')';
	this.image.style.webkitTransform = transform;  
}

/*This method position images in the z-axis,
 moving the selected one to the front */
TouchImage.prototype.sortDepth = function(aElements)
{
	aElements.sort(function(a,b){
		return (a.posZ > b.posZ);
	});
	
	for(var i=0;i<aElements.length;i++){
		if(aElements[i] == this){
			aElements[i].posZ = aElements.length;
		}else{
			aElements[i].posZ = i;
		}
		aElements[i].applyTransforms();		
	}
}

/*
When a second finger is placed on the screen
we capture the start values for scale and rotation
*/
TouchImage.prototype.gesturestart = function(event)
{
	event.preventDefault();
	this.startRotation = this.rotation;
	this.startScale    = this.scale;
}
/*
When we move one or more fingers.
*/
TouchImage.prototype.gesturechange = function(event)
{
	event.preventDefault();
	
	//Calculate the new scale and rotation
	this.scale    = this.startScale * event.scale;
	this.rotation = this.startRotation + event.rotation;
	
	//Set max and min scale values
	this.scale = Math.max(this.scale, 0.4);
	this.scale = Math.min(this.scale, 1.5);
	
	//Apply the new scale and rotation values
	this.applyTransforms();	
}
TouchImage.prototype.gestureend = function(event)
{
	//At this point only one finger is left on the screen
	//Stop listening for move events to avoid the picture snapping
	//to the wrong position
	this.image.removeEventListener('touchmove', this, false);
}

//A finger is placed on the screen
TouchImage.prototype.touchstart = function(event)
{
	event.preventDefault();
	
	//Calculate where on the image the touch occured
	this.offsetX = event.touches[0].clientX - this.posX;
	this.offsetY = event.touches[0].clientY - this.posY;
	
	//Move this image to the front
	this.sortDepth(elephants);
	
	//Start listening for movement of the finger
	this.image.addEventListener('touchmove', this, false);
}

//A finger moved on screen
TouchImage.prototype.touchmove = function(event)
{
	event.preventDefault();
	
	//Set the new x position of the image
	this.posX = event.touches[0].clientX - this.offsetX;
	this.posY = event.touches[0].clientY - this.offsetY;
	
	//Apply the transform
	this.applyTransforms();
}

//A finger was removed from the screen
TouchImage.prototype.touchend = function(event)
{
	//
}

//Something unexpected happened, like a call..
TouchImage.prototype.touchcancel = function(event)
{
	alert('The elephants have been paused, click ok wake them up!');
}