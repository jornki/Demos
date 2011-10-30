function saveData(e)
{
	//Save the data
	localStorage.document = document.getElementById('editbox').innerHTML;
}

function toggleBold(e)
{	
	//Set the selection to bold and save the data
	document.execCommand('bold',false,null);
	saveData(null);
}
function toggleItalic(e)
{
	//Set the selection to italic and save the data
	document.execCommand("italic");
	saveData(null);
}

function restore()
{
	//If we have already a saved document, restore it on startup
	if(localStorage.document){
		document.getElementById('editbox').innerHTML = localStorage.document;
	}
}

function init()
{
	//Each time we type something, save it
	document.getElementById('editbox').addEventListener('keyup', saveData);
	//Event listeners for the bold and italic buttons
	document.getElementById('bold').addEventListener('click', toggleBold);
	document.getElementById('italic').addEventListener('click', toggleItalic);
	restore();	
}

document.addEventListener('DOMContentLoaded', init, false);