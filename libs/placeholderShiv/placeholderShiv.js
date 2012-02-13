
/*
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
*/

(function() {
  "use strict";
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.PlaceholderShiv = (function() {
    /*
    	Construtor
    */
    function PlaceholderShiv(args) {
      this.blurHandler = __bind(this.blurHandler, this);
      this.focusHandler = __bind(this.focusHandler, this);
      var item, _ref;
      if (!document.addEventListener) {
        alert("This browser is not supported, use the jQuery plugin");
        throw "This browser is not supported, use the jQuery plugin!";
        return false;
      }
      this.overrideNative = false;
      /*
      		If missing or not valid input, use the default set of input types
      */
      if (!(args != null) || !(args.includeTypes != null) || (typeof args.includeTypes === 'object' && args.includeTypes.length === 0) || (typeof args.includeTypes !== 'object')) {
        this.includeTypes = ['text', 'email', 'tel', 'search', 'url'];
      } else {
        /*
        			Make sure all input types are in lowercase format
        */
        this.includeTypes = (function() {
          var _i, _len, _ref, _results;
          _ref = args.includeTypes;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            _results.push(item.toLowerCase());
          }
          return _results;
        })();
        this.overrideNative = true;
      }
      /*
      		If no color is passed, use the default #999
      */
      if (args != null) {
        this.placeholderColor = (_ref = args.placeholderColor) != null ? _ref : "#999";
        this.overrideNative = args.placeholderColor != null;
      } else {
        this.placeholderColor = "#999";
      }
      /*
      		Get all the input elements on in the DOM
      */
      this.inputElements = document.getElementsByTagName('input');
      /*
      		Do we have native placeholder support?
      */
      this.nativeSupport = false;
      if (this.placeholderSupport() && !this.overrideNative) {
        this.nativeSupport = true;
      }
      this.setup();
    }

    /*
    	Remember the placeholder text (value)
    	Remember the current input text color
    	Set the placeholder color as the current color
    	Add listeners
    */

    PlaceholderShiv.prototype.setup = function() {
      var item, itemType, _i, _len, _ref;
      _ref = this.inputElements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        /*
        			If the input has no value, ignore it
        */
        if (!(item.value != null) || item.value === "") continue;
        itemType = item.getAttribute('type').toLowerCase();
        if (__indexOf.call(this.includeTypes, itemType) >= 0) {
          item.setAttribute('placeholder', item.value);
          if (!this.nativeSupport) {
            item.placeholderText = item.value;
            item.defaultColor = this.getStyle(item, 'color');
            item.style.color = this.placeholderColor;
            item.addEventListener('focus', this.focusHandler, false);
            item.addEventListener('blur', this.blurHandler, false);
          } else {
            item.value = "";
          }
        }
      }
      return true;
    };

    /*
    	When the input get focus clear it out and restore the
    	original color
    */

    PlaceholderShiv.prototype.focusHandler = function(e) {
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

    PlaceholderShiv.prototype.blurHandler = function(e) {
      var item;
      item = e.target;
      if (item.value === "") {
        item.style.color = this.placeholderColor;
        return item.value = item.placeholderText;
      }
    };

    /*
    	Method for checking for native placeholder support
    */

    PlaceholderShiv.prototype.placeholderSupport = function() {
      return __indexOf.call(document.createElement("input"), "placeholder") >= 0;
    };

    /* 
    	Helper method to get the computed style
    */

    PlaceholderShiv.prototype.getStyle = function(oElm, strCssRule) {
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

    return PlaceholderShiv;

  })();

}).call(this);
