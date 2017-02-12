/*!
 * jQuery Iframe Resize 
 *
 * Version 0.0.1
 *
 * https://github.com/msebasl/iframe-resize
 *
 * Copyright 2017 Sebastian Lopez (sebastianlopezdesign.com)
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

// Closure with jQuery support.
(function ($) {
    'use strict';
    var _PLUGIN_    = 'iframeResize',
        _VERSION_   = '0.0.1',
        _AUTHOR_    = 'Sebastian Lopez',
        _INDEX_     = 0;

    //  iframeResize already excists
    if ( $.fn[ _PLUGIN_ ] ) {
      return;
    }

    /**
     * Constructor.
     */    
    function IframeResize(ele, id, options) {
        this.id = id;
        this.targetIframe = null;
        this.options = {
            selector: 'iframe.resizable, iframe[resizable]'
        };

        if (options) {
            var obj = this;
            $.each(options, function (k, v) {
                obj.options[k] = v;
            });
        }

        if (ele) {
            $(ele).attr('iframe-resize', true);
            this.targetIframe = $(ele);
        }

        this.attachWindowEvents();
        this.attachIframeEvents();
    }

    /**
     * Window's event listeners.
     */
    IframeResize.prototype.attachWindowEvents = function () {
        var $this = this,
            // Events functions.
            windowEvents = {
                default: function () {
                    // Instance of Drupal behavior.
                    var that = $this;

                    // Check if target iframe exists.
                    if (that.targetIframe) {
                        that.resizeHeight(that.targetIframe);
                    }
                },
                // Message event API for cross-domain support.
                message: function (e) {
                    var that = $this;
                    // Check if the target iframe is set.
                    if (that.targetIframe) {
                        var iframe = $(that.targetIframe),
                            origin = e.origin || e.originalEvent.origin,
                            domain = location.protocol + '//' + location.hostname;
                        // Check if the domain is same as iframe src.
                        if ((domain === origin || iframe.attr('src').charAt(0) === '/' || iframe.attr('src').indexOf(origin) === 0) && !isNaN(e.data)) {
                            that.resizeHeight(null, e.data);
                        }
                    }
                }
            };
        // This will be triggerd when the iframe is clicked.
        this.addEvent(window.top, 'blur', windowEvents.default);
        this.addEvent(window.top, 'focus', windowEvents.default);
        // Usage from iframe: top.postMessage(456, "http://localhost:3000");
        // More info: http://javascript.info/tutorial/cross-window-messaging-with-postmessage
        this.addEvent(window.top, 'message', windowEvents.message);
    };

    /**
     * Attach events to the target iframe.
     */    
    IframeResize.prototype.attachIframeEvents = function () {
        var that = this;

        if ( that.targetIframe ) {
            that.targetIframe.on('load', function () {
                that.resizeHeight(this);
            });
        } else {
            var iframes = $(document).find(that.selector);

            iframes.each(function () {
                // Sets the target iframe with the element.
                that.targetIframe = this;
                var iframe = $(this);
                iframe.attr('iframe-resize', true);
                // Initial height resize.
                iframe.on('load', function () {
                    that.resizeHeight(this);
                });
            });
        }
    };

    /**
     * Resize the active iframe.
     */
    IframeResize.prototype.resizeIframe = function () {
        setTimeout(function () {
            window.top.iframeResize[ this.id ].resizeHeight();
        }, 500);
    };

    /**
     * Resize the height of an iframe.
     *
     * @param {object} iframe: the iframe element object.
     * @param {number} height: the height to resize to.
     */
    IframeResize.prototype.resizeHeight = function (iframe, height) {
        // Check if the iframe element is passed.
        if ( !iframe || typeof iframe === 'undefined' ) {
            iframe = window.top.iframeResize[this.id].targetIframe;
        }

        iframe = $(iframe);
        // Default height.
        var newHeight = iframe[0].offsetHeight;
        // Check second parameter.
        if (typeof height !== 'undefined' && !isNaN(height)) {
            newHeight = Math.abs(+height);
        } else {
            // Attempt to read the body of the iframe.
            // It doesn't work with cross-origin without origin headers.
            try {
                newHeight = iframe[0].contentWindow.document.body.offsetHeight;
            } catch (e) {
                console.log(e);
            }
        }

        iframe.animate({ 'height': newHeight + 'px' }, 400);
    };
    /*
     * Function to attach events to elements.
     *
     * @param {object} obj: the DOM element object to attach events to.
     * @param {string} evt: the event to be attached.
     * @param {function} func: the function to run when the event is triggered.
     */
    IframeResize.prototype.addEvent = function (obj, evt, func) {
        if ( 'addEventListener' in window ) {
            obj.addEventListener(evt, func, false);
        } else if ( 'attachEvent' in window ) { //IE
            obj.attachEvent('on' + evt, func);
        }
    };

    // Plugin declaration.
    $.fn[ _PLUGIN_ ] = function (options) {
        window.iframeResize =  window.iframeResize || {};
        this.each(function () {
            var ele = $(this),
                id = new Date();

            if ( ele.is('iframe') ) {
                // Unique ID for multiple iframes.
                window.iframeResize[ id.getTime() ] = new IframeResize(ele, id.getTime() + _INDEX_, options);
                _INDEX_++;
            }
            else {
              ele.find('iframe').each( function () {
                // Unique ID for multiple iframes.
                window.iframeResize[ id.getTime() ] = new IframeResize(ele, id.getTime() + _INDEX_, options);
                _INDEX_++;
              });
            }
        });

        // Return the same element for function chaining.
        return $(this);
    };
    
    $.fn[ _PLUGIN_ ].version = _AUTHOR_;

    $.fn[ _PLUGIN_ ].version = _VERSION_;

})(jQuery);
