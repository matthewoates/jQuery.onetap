// Copyright (c) 2013 Matthew Oates

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

(function (doc, $) {
    'use strict';

    var listenToClicks = true;
    var tappedTimeout;
    var mouseDown = false;

    $(doc).on('mousedown mouseup', function (event) {
        // we need to know if the mouse is down for dragging events
        mouseDown = (event.type === 'mousedown');
    });

    var tapped = function () {
        // each time a tap is detected, we stop listening to clicks for 1 second
        // this is necessary because many devices support touch and mouse inputs
        listenToClicks = false;

        clearTimeout(tappedTimeout);
        tappedTimeout = setTimeout(function () {
            listenToClicks = true;
        }, 1000);
    };

    var getEventPos = function (event) {
        var offset = $(event.target).offset();
        var touch;

        if ('pageX' in event) {
            touch = event;
        } else if (event.originalEvent.touches && event.originalEvent.touches.length > 0) {
            touch = event.originalEvent.touches[0];
        } else {
            touch = event.originalEvent.changedTouches[0];
        }

        return {
            x: touch.pageX - offset.left,
            y: touch.pageY - offset.top,
            pageX: touch.pageX,
            pageY: touch.pageY
        };
    };

    var eventTypes = {
        touchstart : {type: 'tapstart', isTouch:  true},
        touchend   : {type:  'tapstop', isTouch:  true},
        touchmove  : {type:  'tapdrag', isTouch:  true},
        mousedown  : {type: 'tapstart', isTouch: false},
        mouseup    : {type:  'tapstop', isTouch: false},
        mousemove  : {type:  'tapdrag', isTouch: false}
    };

    var onTapEvent = function (event) {
        var tapEvent = $.extend({}, getEventPos(event), event, eventTypes[event.type]);

        if (tapEvent.isTouch) {
            tapped();

            if (event.type === 'touchmove') {
                event.preventDefault();
            }
        }

        if ((event.type !== 'mousemove' && (listenToClicks || tapEvent.isTouch)) ||
            (event.type === 'mousemove' && mouseDown && listenToClicks)) {
            $(event.target).trigger(tapEvent);
        }
    };

    $.event.special.tapstart = {
        add: function () {
            $(this).on('mousedown.__tap', onTapEvent).on('touchstart.__tap', onTapEvent);
        },
        remove: function () {
            $(this).off('mousedown.__tap touchstart.__tap');
        }
    };

    $.event.special.tapstop = {
        add: function () {
            $(this).on('mouseup.__tap', onTapEvent).on('touchend.__tap', onTapEvent);
        },
        remove: function () {
            $(this).off('mouseup.__tap touchend._tap');
        }
    };

    $.event.special.tapdrag = {
        add: function () {
            $(this).on('mousemove.__tap', onTapEvent).on('touchmove.__tap', onTapEvent);
        },
        remove: function () {
            $(this).off('mousemove.__tap touchmove._tap');
        }
    };
}(document, jQuery));
