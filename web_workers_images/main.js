var ctxAr;
var posAr; 

var numImages;
var imgWidth;


// Slider(Range) event handlers
function numImagesChangedHandler(e)
{
	document.getElementById('numImagesLabel').innerHTML = e.currentTarget.value + " images";
}
function numImagesUpdatedHandler(e)
{
	numImages = e.currentTarget.value;
	createImageGridWithNumImagesOfWidth();
}
function widthImagesChangedHandler(e)
{
	document.getElementById('widthImagesLabel').innerHTML = e.currentTarget.value + " px";
}
function widthImagesUpdatedHandler(e)
{
	imgWidth = e.currentTarget.value;
	createImageGridWithNumImagesOfWidth();
}

/*
Creates the image grid array from scratch everytime it's called.
*/
function createImageGridWithNumImagesOfWidth()
{
	var images = ['img1.jpg','img2.jpg','img3.jpg'];
	
	ctxAr = new Array();
	
	//Clear out any old images
	var holder = document.getElementById('image-holder');
	while(holder.hasChildNodes()){
		holder.removeChild(holder.firstChild);
	}
	
	for(var i=0;i<numImages;i++){
		var img = document.createElement('img');
		img.onload = function(){
			var cv    = document.createElement('canvas');
			cv.width  = imgWidth;
			cv.height = imgWidth;
			
			var ctx = cv.getContext('2d');
			ctx.drawImage(this,0,0,imgWidth, imgWidth);
			
			//Keep on to the canvas and it's context
			ctxAr.push({'canvas':cv,'context':ctx});
			
			if(ctxAr.length == numImages){
				//When all the images have loaded, render them
				renderImages(imgWidth);
				return;
			}
		}
		img.src = images[Math.floor(Math.random()*3)];
	}
}

/*
This function adds the images to the DOM
*/
function renderImages(imgWidth)
{
	posAr = new Array();
	
	var maxImageCols = Math.floor(window.innerWidth / imgWidth);
	
	var currentCol = 0;
	
	for(var i=0;i<ctxAr.length;i++){
		var cv = ctxAr[i].canvas;		
		
		var x = currentCol * imgWidth;
		var y = Math.floor(i / maxImageCols) * imgWidth;
		
		// Create an array of possible x,y coordinates
		posAr.push({'x':x,'y':y});
		
		cv.style.webkitTransform = "translate3d("+x+"px,"+y+"px,0)";
		
		//document.body.appendChild(cv);
		document.getElementById('image-holder').appendChild(cv);
		
		if((currentCol+1) < maxImageCols){
			currentCol++;
		}else{
			currentCol = 0;
		}

	}
}

/*
Move the images to new random positions animated
*/
function randomizePositions()
{
	//Randomize the position array
	posAr.sort(function() {return 0.5 - Math.random()});
	
	//Move all images
	for(var i=0;i<ctxAr.length;i++){
		ctxAr[i].canvas.style.webkitTransform = "translate3d("+posAr[i].x+"px,"+posAr[i].y+"px,0)";
	}
}

/*
Convert all images to grayscale versions using Web Workers
*/
function grayscaleImages()
{
	// Check wheter animation should run while converting images
	if(document.getElementById('ch_random').checked){
		randomizePositions();
	}
	
	for(var i=0;i<ctxAr.length;i++){
		//For each image, create a new worker
		var worker = new Worker('DWGrayscale.js');
		//Listen for messages from the worker
		worker.addEventListener('message', function(e){
			//When the converted image data comes back, stick into the canvas context
			ctxAr[e.data.index].context.putImageData(e.data.imagedata,0,0);
		});
		//The the worker to start converting the image data
		worker.postMessage({'index':i,'imagedata':ctxAr[i].context.getImageData(0,0, ctxAr[i].canvas.width, ctxAr[i].canvas.height)});
	}
}

/*
Invert the colors in the images. 
See comments in grayscaleImages() for details of worker logic
*/
function invertImages()
{	
	// Check wheter animation should run while converting images
	if(document.getElementById('ch_random').checked){
		randomizePositions();
	}
	
	for(var i=0;i<ctxAr.length;i++){
		var worker = new Worker('DWInvert.js');
		
		worker.addEventListener('message', function(e){
			ctxAr[e.data.index].context.putImageData(e.data.imagedata,0,0);;
		});
		
		worker.postMessage({'index':i,'imagedata':ctxAr[i].context.getImageData(0,0, ctxAr[i].canvas.width, ctxAr[i].canvas.height)});
	}
}

//STARTUP
document.addEventListener('DOMContentLoaded', init, false);

function init()
{

	// Add event listeners
	document.getElementById('grayscale').addEventListener('click', grayscaleImages);
	document.getElementById('invert').addEventListener('click', invertImages);
	document.getElementById('random').addEventListener('click', randomizePositions);
	document.getElementById('slider').addEventListener('change', numImagesChangedHandler);
	document.getElementById('slider').addEventListener('mouseup', numImagesUpdatedHandler);
	
	document.getElementById('sliderWidth').addEventListener('change', widthImagesChangedHandler);
	document.getElementById('sliderWidth').addEventListener('mouseup', widthImagesUpdatedHandler);
	
	
	
	//INIT
	document.getElementById('numImagesLabel').innerHTML   = document.getElementById('slider').value + " images";
	document.getElementById('widthImagesLabel').innerHTML = document.getElementById('sliderWidth').value + " px";
	
	//Startup
	imgWidth  = document.getElementById('sliderWidth').value;
	numImages = document.getElementById('slider').value;
	createImageGridWithNumImagesOfWidth();
}