(function($) {

  var methods = {
    init: function() {
      this.data("cardjs", new CardJs(this));
      return this;
    },
    cardNumber: function() {
      return this.data("cardjs").getCardNumber();
    },
    cardType: function() {
      return this.data("cardjs").getCardType();
    },
    name: function() {
      return this.data("cardjs").getName();
    },
    expiryMonth: function() {
      return this.data("cardjs").getExpiryMonth();
    },
    expiryYear: function() {
      return this.data("cardjs").getExpiryYear();
    },
    cvc: function() {
      return this.data("cardjs").getCvc();
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
// Initialise for all elements with card-js class.
//
$(function() {
  $(".card-js").each(function(i, obj) {
    $(obj).CardJs();
  });
});