/*
Start listening for messages from the main thread
*/
addEventListener('message', function(e){
	var imageData = e.data.imagedata;
	var pix = imageData.data;
     
	for (var i = 0, n = pix.length; i < n; i += 4) {
		pix[i  ] = 255 - pix[i  ]; // red
		pix[i+1] = 255 - pix[i+1]; // green
		pix[i+2] = 255 - pix[i+2]; // blue
	}
    
    // post a message back to the caller
	postMessage({'index':e.data.index,'imagedata':imageData});
});