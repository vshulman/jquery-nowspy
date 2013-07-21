$.fn.isOnScreen = function(attrs) {
    /* adapted from: http://upshots.org/javascript/jquery-test-if-element-is-in-viewport-visible-on-screen */
    attrs = attrs || {};
    var partial = attrs.partial || false;
    var win = $(window);
     
    var viewport = {
        top : win.scrollTop(),
    };
    viewport.bottom = viewport.top + win.height();
     
    var bounds = this.offset();
    bounds.bottom = bounds.top + this.outerHeight();
     
    if (partial) {
      return (!(viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    } else { // is the element fully visible?
      return (bounds.top > viewport.top && bounds.bottom < viewport.bottom);
    }
     
};

$.fn.nowspy = function(log) {
  var log = log || false;
  $this = $(this);
  
  var initOffset = { /* used to determine if the element is outside the viewport */
    top: $this.offset().top,
    bottom: $this.offset().top + $this.outerHeight()
  } 
  
  var height = $this.height(); // element's height
  var outerHeight = $this.outerHeight() + parseFloat($this.css("marginBottom")); // used to know when to re-show the element
  var prevPos = $(window).scrollTop(); // initial offset is 0
  
  $(window).scroll(function() {
    var pos = $(this).scrollTop();
    delta = pos - prevPos; // delta is positive on downwards scroll
    
    /* if we haven't scrolled past the element in its original position, do nothing */
    
    /* on scroll down, wait until element is fully out of the viewport
       on scroll up, wait until element is in its original position */
    if ((initOffset.bottom > pos && delta > 0) || (initOffset.top > pos && delta < 0)) {
      $this.css("position", "static");
      $this.removeClass("spying");
      return;
    }
    
    /* element is no longer visible in its static position */
    var topOffset = $this.position().top;
    
    /* Scroll Up
       possible states:
       - element is invisible
       - element is partially visible
       - element is fully visible
    */
    if (delta < 0) { 
        
      /* if element is invisible, we want to start reveal */ 
      if (!$this.isOnScreen({partial: true})) {
        $this.css("position","fixed");
        $this.addClass("spying");
        $this.css("top", - outerHeight - delta);  
      } else { /* element is not fully invisible... */
        
        /* if element is fully visible, stop revealing */
        if ($this.isOnScreen()) { 
          // do nothing
        } else { /* if element is partially visible, continue revealing it until it's fully revealed */
          $this.css("top", Math.min(topOffset - delta,0));
        }
      }
    }
    
    /* Scroll Down
       - if the elmenent is already completely hidden, do nothing
       - if the element is not completely hidden, keep hiding by amt of delta
    */
    else {
      if ($this.isOnScreen({partial: true})) { // if element is already somewhat visible, keep hiding
        $this.css("top", topOffset - delta);
      } else {
        // do nothing
      }
    }
    
    prevPos = pos;
  });
};