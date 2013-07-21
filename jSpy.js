$.fn.isOnScreen = function(attrs){
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

$(function() {
  // find the element
  // get its height
  // if we scrolled further than the hight, and we are scrolling up, reveal incrementally
  var $el = $("#scroll");
  var initOffset = {
    top: $el.offset().top,
    bottom: $el.offset().top + $el.outerHeight()
  } 
  
  var height = $el.height(); // element's height
  var outerHeight = $el.outerHeight() + parseFloat($el.css("marginBottom")); // used to know when to re-show the element
  
  var revealed = height;
  var prevPos = $(window).scrollTop(); // initial offset is 0
  
  
  $(window).scroll(function() {
    var pos = $(this).scrollTop();
    delta = pos - prevPos; // positive delta if we move down
    
    // on the way down, way until the bottom leaves the screen
    // on the way up wait until the top enters the screen
    // if we haven't scrolled past the element, do nothing
    if ((initOffset.bottom > pos && delta > 0) || (initOffset.top > pos && delta < 0)) {
      $el.css("position", "static");
      $el.removeClass("hover");
      return;
    }
    
    
    // right now, element is not fully visible
    // we are moving down
      // if the elmenent is already completely hidden, do nothing
      // if the element is not completely hidden, hide in by amount of movement
    // we are moving up
      // move element up by by amount of movement
    var topOffset = $el.position().top;
    
    // var newRevealed = ((-height + revealed) + delta);
    
    
    /* Scroll Up */
    if (delta < 0) { 
      console.log("Scrolling up");
      
      // if element is somewhat visible, we may want to reveal further
      if ($el.isOnScreen({partial: true})) {
        if ($el.isOnScreen()) { // if element is fully vislble, we are done
          // do nothing
        } else { // otherwise, reveal it further by amount of movement, cap at height
          $el.css("top", Math.min(topOffset - delta,0));
        }
      }
      
      // element is hidden, we want to start showing it
      // we set initial position to be offscreen by original height
      else {
        $el.css("position","fixed");
        $el.addClass("hover");
        $el.css("top", - outerHeight - delta);
      }
    } 
    
    /* Scroll Down */
    else { // we are scrolling down
      if ($el.isOnScreen({partial: true})) { // if element is already somewhat visible, keep hiding
        $el.css("top", topOffset - delta);
      } else {
        // do nothing
      }
    }
    
    prevPos = pos;
  });
});