document.addEventListener('DOMContentLoaded', init, false);

var pageTitles = {'cont1.html':'Just text title', 'cont2.html':'An elephant and some text', 'cont3.html':'A longer text'};

function hasBrowserHistory()
{
	return !!(window.history && history.pushState);
}

/*
This function does all the work with the History API
*/
function updateHistory(url, replaceHistory)
{
	//Create a title for the page
	var title = "History API Demo -> " + pageTitles[url];
	//Create a page path
	var path  = "?page=" + url.split(".")[0];
	
	if(replaceHistory){
		/* 
		If this is the first page we are loading
		replace the current history item.
		*/
		history.replaceState(url, title, path);
	}else{
		/*
		If we got here by clicking one of the links
		add a new item to the browser history
		*/
		history.pushState(url, title, path);
	}
	// Update the page title to get a logical name in the history
	document.title = title;
}

/* Function to dynamically load content */
function loadPage(whichPage, replaceHistory)
{
	jQuery.ajax({
		url: whichPage,
		cache: false,
		success: function(html){
			//Replace existing content
			jQuery('#content').html(html);
			//Update the history
			updateHistory(this.url.split('?')[0], replaceHistory);
		}
	});
}

/*
Handler for the history pop state.
This will fire when the page is loaded (state = null)
and when the back and forward buttons are used (state = pushed state)
*/
function historyPopStateHandler(e)
{
	if(e.state != null){
		loadPage(e.state, true);
	}
}

/* Helper function to parse URL params - ingore it */
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function init()
{
	//Check if the history API is available
	if(!hasBrowserHistory()){
		alert('Sorry dude, your browser does not support the history API');
		return;
	}		
	
	//Check if we have any url params (e.g bookmark or reload)
	var params = getUrlVars();
	
	if(params['page'] != undefined && params['page'] != null){
		//Load the holder page with the correct content
		loadPage(params['page'] + ".html", true);
	}else{
		//Load the default page
		loadPage('cont1.html', true);
	}
	
	
	//Setup listeners for the links
	jQuery('nav > a').click(function(e){
		e.preventDefault();
		loadPage(jQuery(e.target).attr('href'), false);
	});
	
	//Setup listeners for the history events
	window.addEventListener('popstate', historyPopStateHandler);
}