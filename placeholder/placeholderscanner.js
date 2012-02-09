
/*
** PlaceholderScanner by Jørn Kinderås - 2012 **

DESCRIPTION:
This class will scan the page for defined input elements
like "text", "email" and so on, fetching their "value" attributes content, using
this a placeholder text. It will add an HTML5 "placeholder"
attribute to the input elements, but will also mimic this feature 
by setting and restoring the value of the elements on focus and blur.

USAGE:
1. Give the target input elements a value "<input type="text" value="[my placeholder text]" />"
2. Initialize the scanner: 
scanner = new PlaceholderScanner({placeholderColor:"#999",includeTypes:[...]})

ARGUMENTS[optional]:
* placeholderColor(color[string]) * 
A color for the placeholder text
Default: #999

* includeTypes(array) * 
An array of input elements e.g ['text','email']
Note: Only specify this if you do not want the default set of elements.
default elements: ['text','email','tel','search','url']
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.PlaceholderScanner = (function() {
    /*
    	Construtor
    */
    function PlaceholderScanner(args) {
      this.blurHandler = __bind(this.blurHandler, this);
      this.focusHandler = __bind(this.focusHandler, this);
      /*
      		If missing or not valid input, use the default set of input types
      */
      var _ref;
      if (!(args != null) || !(args.includeTypes != null) || (typeof args.includeTypes === 'object' && args.includeTypes.length === 0) || (typeof args.includeTypes !== 'object')) {
        this.includeTypes = ['text', 'email', 'tel', 'search', 'url'];
      } else {
        /*
        			Make sure all input types are in lowercase format
        */
        this.includeTypes = args.includeTypes.map(function(item) {
          return item.toLowerCase();
        });
      }
      /*
      		If no color is passed, use the default #999
      */
      if (args != null) {
        this.placeholderColor = (_ref = args.placeholderColor) != null ? _ref : "#999";
      } else {
        this.placeholderColor = "#999";
      }
      /*
      		Get all the input elements on in the DOM
      */
      this.inputElements = document.getElementsByTagName('input');
      this.setup();
    }

    /*
    	Remember the placeholder text (value)
    	Remember the current input text color
    	Set the placeholder color as the current color
    	Add listeners
    */

    PlaceholderScanner.prototype.setup = function() {
      var item, itemType, _i, _len, _ref;
      _ref = this.inputElements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        itemType = item.getAttribute('type').toLowerCase();
        if (__indexOf.call(this.includeTypes, itemType) >= 0) {
          item.placeholderText = item.value;
          item.setAttribute('placeholder', item.placeholderText);
          item.defaultColor = this.getStyle(item, 'color');
          item.style.color = this.placeholderColor;
          item.addEventListener('focus', this.focusHandler);
          item.addEventListener('blur', this.blurHandler);
        }
      }
      return true;
    };

    /*
    	When the input get focus clear it out and restore the
    	original color
    */

    PlaceholderScanner.prototype.focusHandler = function(e) {
      var item;
      item = e.target;
      if (item.value === item.placeholderText) {
        item.value = "";
        return item.style.color = item.defaultColor;
      }
    };

    /*
    	When the input looses focus set the placeholder text
    	if the form value is empty and apply the placeholder color
    */

    PlaceholderScanner.prototype.blurHandler = function(e) {
      var item;
      item = e.target;
      if (item.value === "") {
        item.style.color = this.placeholderColor;
        return item.value = item.placeholderText;
      }
    };

    /* 
    	Helper method to get the computed style
    */

    PlaceholderScanner.prototype.getStyle = function(oElm, strCssRule) {
      var strValue;
      strValue = "";
      if (document.defaultView && document.defaultView.getComputedStyle) {
        strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
      } else if (oElm.currentStyle) {
        strCssRule = strCssRule.replace(/\-(\w)/g, function(strMatch, p1) {
          return p1.toUpperCase();
        });
        strValue = oElm.currentStyle[strCssRule];
      }
      return strValue;
    };

    return PlaceholderScanner;

  })();

}).call(this);
