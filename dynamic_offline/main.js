/**
HTML 5 DATABASE STORAGE DEMO BY JØRN KINDERÅS 26.02.2011

This demo show how to cache dynimic data into a client-side database
using the HTML 5 JavaScript database API's.
**/

var sImgURL = "elephant.jpg";
var db;//Database reference

document.addEventListener('DOMContentLoaded',init,false);
			
function init()
{	
	initDatabase();	 
}

function initDatabase()
{
	/* Check if the browser has support for the HTML 5 database APIs */
	if(!window.openDatabase){
		document.getElementsByTagName('p')[0].innerHTML = "Sorry dude, this browser does not know about the HTML 5 database APIs yet. Try Safari, Chrome or Opera perhaps.";
		showImage('sorry.jpg');
		return;
	}
	
	// Okay, it does support the database APIs!
	try{
		//Create a database of 1 Megabytes
		var dbSize = 1024 * 1024; // 1 MB
		db = openDatabase('testdb','1.0','Offline Elephant DB',dbSize);
	}catch(e){
		if(e == 2){
			//You have updated the version number
			alert('Wrong DB version number');
		}else{
			//Any other error
			alert('Could not open database, errorcode: ' + e);
		}
	}
	//Create the table if it does not exist
	var sql = 'CREATE TABLE IF NOT EXISTS offline_image (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, filename TEXT DEFAULT "filename.jpg", image TEXT DEFAULT "empty");';
	db.transaction(
		function(transaction){
			transaction.executeSql(sql,[],
			function(transaction, result){
				//Init complete, now try to read the image
				readImage();
			},
			errorHandler);
		}
	);
	
}

function readImage()
{
	//Try to load the image from the local database
	db.transaction(
		function(transaction){
			transaction.executeSql("SELECT image FROM offline_image WHERE filename = ?",[sImgURL],readDBdataHandler,errorHandler);
		}
	);
}

function readDBdataHandler(transaction, result)
{
	// If the image is found in the db, use the local version
	if(result.rows.length > 0){
		//The image exists locally
		showImage(result.rows.item(0).image);
		document.getElementsByTagName('p')[0].innerHTML = "The image was loaded from your computer.";
	}else{
		//save the image
		saveImage();
	}
}

/*
In this function the image is loaded,
then rendered into a canvas element.
The canvas element has a method (toDataURL) which
returns a base64 serialized version of the image.
The resulting string is saved to the database and 
then rendered on screen.
*/
function saveImage()
{
	var canvas = document.createElement('canvas');//Create a canvas element
	var ctx    = canvas.getContext('2d');// Ant the 2d context
	var img    = document.createElement('img'); //The image element to load the image
	//When the image has loaded
	img.onload = function(){
		//Match the canvas size to the image size
		canvas.width  = img.width;
		canvas.height = img.height;
		//Draw the image data into the canvas
		ctx.drawImage(img,0,0,img.width,img.height);
		//Get the serialized png data
		var base64Image = canvas.toDataURL();
		//Show the image data 
		showImage(base64Image);
		
		//Insert the image string into the local database
		db.transaction(
			function(transaction){
				transaction.executeSql("INSERT INTO offline_image(filename, image) VALUES(?,?)",[sImgURL,base64Image],
				function(transaction, result){
					//Image saved
					base64Image = null;//Free up memory
					document.getElementsByTagName('p')[0].innerHTML = "The image was saved for offline usage.";
				}, errorHandler);
			}
		);
		
	}
	img.src = sImgURL;
}
function showImage(imgString)
{
	// img elements can take both dataurls (base64 data) and filepaths
	document.getElementById('id-image').src = imgString;
}

// Error handler used for all database transactions
function errorHandler(transaction, error)
{
	alert('Transaction error: ' + error.message);
}
