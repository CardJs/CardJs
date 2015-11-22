(function($) {

  var methods = {
    init: function() {
      new CardJs(this);
    }
  };


  /**
   * jQuery function.
   *
   * @param methodOrOptions
   * @returns {*}
   */
  $.fn.CardJs = function(methodOrOptions) {
    if(methods[methodOrOptions]) {
      return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if(typeof methodOrOptions === "object" || !methodOrOptions) {
      return methods.init.apply( this, arguments );
    } else {
      $.error("Method " +  methodOrOptions + " does not exist on jQuery.CardJs");
    }
  };


}(jQuery));


//
// Initialise for all elements with cardjs class.
//
$(function() {
  $(".card-js").each(function(i, obj) {
    $(obj).CardJs();
  });
});