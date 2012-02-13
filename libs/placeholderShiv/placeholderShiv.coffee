###
** PlaceholderShiv by Jørn Kinderås - 2012 **

REQUIREMENTS:
This class requires a browser supporting "addEventListener"

DESCRIPTION:
This class will scan the page for defined input elements
like "text", "email" and so on, fetching their "value" attributes content, using
this a placeholder text. It will add an HTML5 "placeholder"
attribute to the input elements, but will also mimic this feature 
by setting and restoring the value of the elements on focus and blur.

USAGE:
1. Give the target input elements a value "<input type="text" value="[my placeholder text]" />"
2. Initialize the shiv: 
scanner = new PlaceholderShiv({placeholderColor:"#999",includeTypes:[...]})

ARGUMENTS[optional]:
NOTE: If you pass any argument the native placeholder functionality
will be overridden and JavaScript will be used in addition to 
native placeholder text

* placeholderColor(color[string]) * 
A color for the placeholder text
Default: #999

* includeTypes(array) * 
An array of input elements e.g ['text','email']
Note: Only specify this if you do not want the default set of elements.
default elements: ['text','email','tel','search','url']
###
"use strict"
class window.PlaceholderShiv
	###
	Construtor
	###
	constructor: (args) ->
		if not document.addEventListener
			alert "This browser is not supported, use the jQuery plugin"
			throw "This browser is not supported, use the jQuery plugin!"
			return no

		@overrideNative = no
		###
		If missing or not valid input, use the default set of input types
		###
		if not args? or not args.includeTypes? or (typeof args.includeTypes is 'object' and args.includeTypes.length is 0) or (typeof args.includeTypes isnt 'object')
			@includeTypes = ['text','email','tel','search','url']
		else
			###
			Make sure all input types are in lowercase format
			###
			@includeTypes = (item.toLowerCase() for item in args.includeTypes)
			@overrideNative = yes

		###
		If no color is passed, use the default #999
		###
		if args?
			@placeholderColor = args.placeholderColor ? "#999"
			@overrideNative = args.placeholderColor?
		else
			@placeholderColor = "#999"
			

		###
		Get all the input elements on in the DOM
		###
		@inputElements = document.getElementsByTagName('input')

		###
		Do we have native placeholder support?
		###
		@nativeSupport = no
		if @placeholderSupport() and not @overrideNative
			@nativeSupport = yes
		
		@setup()
	
	###
	Remember the placeholder text (value)
	Remember the current input text color
	Set the placeholder color as the current color
	Add listeners
	###
	setup: () ->
		for item in @inputElements
			###
			If the input has no value, ignore it
			###
			if not item.value? or item.value is ""
				continue

			itemType = item.getAttribute('type').toLowerCase()
			if itemType in @includeTypes
				item.setAttribute('placeholder',item.value)
				if not @nativeSupport
					item.placeholderText = item.value
					item.defaultColor = @getStyle item, 'color'
					item.style.color = @placeholderColor
					item.addEventListener('focus', @focusHandler, no)
					item.addEventListener('blur', @blurHandler, no)
				else
					item.value = ""
		return yes
	
	###
	When the input get focus clear it out and restore the
	original color
	###
	focusHandler: (e) =>
		item = e.target
		if item.value is item.placeholderText
			item.value = ""
			item.style.color = item.defaultColor
	
	###
	When the input looses focus set the placeholder text
	if the form value is empty and apply the placeholder color
	###
	blurHandler: (e) =>
		item = e.target
		if item.value is ""
			item.style.color = @placeholderColor
			item.value = item.placeholderText
	
	###
	Method for checking for native placeholder support
	###
	placeholderSupport: () ->
		("placeholder" of document.createElement("input"))

	### 
	Helper method to get the computed style 
	###
	getStyle: (oElm, strCssRule) ->
    	strValue = "";
	    if document.defaultView and document.defaultView.getComputedStyle
	        strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule)
	    else if oElm.currentStyle
	        strCssRule = strCssRule.replace(/\-(\w)/g, (strMatch, p1) -> return p1.toUpperCase())
	        strValue = oElm.currentStyle[strCssRule]
	    return strValue

