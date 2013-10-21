jQuery.onetap
=========

This is a jQuery plugin that provides a common interface to mouse and touch interactions.

This works well with:
- devices with a mouse
- devices with a touch screen
- devices with a mouse and a touch screen

This does not work very well with:
- devices that do not have a mouse or touch screen

Why?
----
onClick events on touch devices add a 300 ms delay. This is so that swipes are not confused with clicks. In some cases, this behavior is undesired.

Naive implementations may subscribe to mouse and touch events, but this may cause two events to be fired for one user action.

jQuery.onetap fires one event per user interaction, regardless of whether the event is from a mouse or touch event.

Usage
----
*see: example/example.html*

Version
----

0.1

Installation
--------------

Include jQuery.onetap.js in your html file.

License
----

MIT
