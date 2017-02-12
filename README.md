# iframe-resize

Secure cross-origin iframe height resize for dynamic content. Uses message event to communicate with the parent window.


## Usage in the parent window

* Add jQuery and the script.
```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="iframe-resize.js"></script>
```

* Attach the function to the selector. The selector could be an iframe, a parent elemnt of iframes, the document.
```
$('iframe').iframeResize();
```

## Usage in the iframe window

* Add a postMessage() sending as parameter the height of the document on every event you think is necessary. For example:
```
(function(){
	var sendMessage = function() {
		// Checks if it's an iframe.
		if(window.top !== window.self) {
			// This will get the height of the body.
    		var value = self.document.body.offsetHeight;
			// Send the height to the parent window.
			top.postMessage(value, '*');
		}
	}
	// Add DOM ready and click event listener to document.
	if ('addEventListener' in window){
		document.addEventListener('click', sendMessage, false);
		document.addEventListener('DOMContentLoaded', sendMessage, false);
	} else if ('attachEvent' in window){
		// On every click will send the message to the top window.
		document.attachEvent('onclick', sendMessage);
	    document.attachEvent("onreadystatechange", function(){
	        if ( document.readyState === "complete" ) {
	            sendMessage();
	        }
	    });
	}
})();
```


# Author

**Sebastian Lopez**

- <https://twitter.com/SebasWebDev>


# License 

Code released under the [MIT License](https://github.com/msebasl/iframe-resize/blob/master/LICENSE). 